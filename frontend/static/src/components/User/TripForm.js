import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { handleError, TRAIL_TYPES, handleInput, TimeInput, FEEDBACK_CHECKBOX_OPTIONS, RADIO_OPTIONS } from './../../util';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';

function TripForm() {

    const navigate = useNavigate();

    const INITIAL_STATE = {
        trail: '',
        date: '',
        time: '--:--',
        notes: '',
    }

    const params = useParams();
    const [trail, setTrail] = useState(null);
    const [state, setState] = useState(INITIAL_STATE);

    ////////////////////////////////////////////////////LOAD TRAIL

    const getTrail = async () => {
        const options = {
            method: 'GET',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
        };

        const response = await fetch(`/api/v1/trails/${params.trailId}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        const trail = await response.json();
        setTrail(trail);
    };

    useEffect(() => {
        if(!trail)
            getTrail();
    }, [trail])

    if (!trail) {
        return 'Loading...'
    };

    const submitTrip = async (e) => {
        e.preventDefault();

        const data = { ...state, trail: trail.id };
        if (data.time.includes('-')) {
            data.time = null
        }

        const options = {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        const response = await fetch('/api/v1/trails/trips/', options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        setState(INITIAL_STATE);
        navigate('/');
    }


    let weatherHtml;

    if (typeof (trail.weather) != typeof ('string')) {
        weatherHtml = trail.weather
            .filter(segment => segment.isDaytime)
            .map((segment) =>
                <div key={segment.number} className='scroll-squares'>
                    <h4>{segment.name}</h4>
                    <div className='weather-image'>
                        <img src={segment.icon} alt={segment.shortForecast} />
                    </div>
                    <p>{segment.temperature}{segment.temperatureUnit}</p>
                    <p>{segment.windSpeed}{segment.windDirection}</p>
                    <p>{segment.detailedForecast}</p>
                </div>)
    }
    
    // if (typeof(trail.weather) === typeof('string')) {
    //     console.log(`Weather error: ${trail.weather}`);
    // }
    
    let feedbackHtml;

    if (Object.values(state).includes(true)) {
        feedbackHtml = FEEDBACK_CHECKBOX_OPTIONS
            .filter((option) => (trail[option]))
            .map((option) => (option.replaceAll('_', ' ')))
            .map((option, index) => (<div className='feedback-badge' key={index}>{option}</div>))
    };

    const printRadioFeedback = () => {

        let data = [];

        for (const [key, value] of Object.entries(RADIO_OPTIONS)) {
            let variable = trail[key]
            let displayValue = <div className='feedback-badge' key={key}>{value[variable]}</div>
            data.push(displayValue);
        }
        return data;
    }

    const radioFeedbackHtml = printRadioFeedback();

    return (
        <div className='wrapper'>
            <div className='trip-form'>
            <div className='left'>
            <h2>Trip to {trail.name}</h2>
            <ul className='trail'>
                <li>
                    <h3>
                        Elevation gain
                    </h3>
                    {trail.elevation_gain}ft
                </li>
                <li>
                    <h3>
                        Length
                    </h3>
                    {trail.length} miles
                </li>
                <li>
                    <h3>
                        Trail Type
                    </h3>
                    {TRAIL_TYPES[trail.trail_type]}
                </li>
                <li>
                    <h3>
                        Park
                    </h3>
                    {trail.park.name}
                </li>
            <li>{trail.park.address}</li>
                <li>
                    <h3>
                        Address
                    </h3>
                    {trail.park.address}
                </li>
                {trail.park.hours && <li className='whitespace'>
                    <h3>
                        Hours
                    </h3>
                    {trail.park.hours.replaceAll(';', '\n')}
                </li>
                }
                {trail.park.fee &&
                    <li className='whitespace'>
                        <h3>
                            Fees
                        </h3>
                        {trail.park.fee.replaceAll(';', '\n')}
                    </li>
                }
                </ul>
            
            {(feedbackHtml || radioFeedbackHtml) &&
                <h3>Other hikers say this trail...</h3>
            }
            {(feedbackHtml || radioFeedbackHtml) &&
                < div className='feedback-wrapper'>
                    {feedbackHtml && feedbackHtml}
                    {radioFeedbackHtml && radioFeedbackHtml}
                </div>
            }
                {weatherHtml && <h3>Weather</h3>}
                <div className='horizontal-scroll-wrapper'>
            {weatherHtml}
                    </div>
                </div>
            <div className='right'>
            <Form className='form' onSubmit={submitTrip}>
                <Form.Label htmlFor='date'>
                    <h3>Calendar</h3>
                </Form.Label>
                <Form.Control
                    type='date'
                    onChange={(e)=> handleInput(e, setState)}
                    required
                    name='date'
                    id='date'
                    value={state.date}
                />
                <Form.Label htmlFor='time'>
                            <h3>Time</h3>
                </Form.Label>
                <TimeInput setFormState={setState} formState={state} />
                <Form.Label htmlFor='notes'>
                            <h3>Notes</h3>
                </Form.Label>
                <Form.Control
                    as='textarea'
                    rows={5}
                    name='notes'
                    id='notes'
                    value={state.notes}
                    onChange={(e)=> handleInput(e, setState)}
                />
                <button className='trail-list-button form-submit' type='submit'>Save Trip</button>
                    </Form>
                </div>
            </div>
            <Accordion>
                <Accordion.Header>Trail Description</Accordion.Header>
                <Accordion.Body>
                    {trail.description}
                </Accordion.Body>
            </Accordion>
        </div>
    )
};

export default TripForm