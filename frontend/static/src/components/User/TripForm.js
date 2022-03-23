import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { handleError, TRAIL_TYPES, handleInput, TimeInput, FEEDBACK_CHECKBOX_OPTIONS, RADIO_OPTIONS, convertWindDegrees } from './../../util';
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
        if (!trail)
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
        weatherHtml = trail.weather.daily
            .map((day, index) => {
                let date = new Date(day.dt)
                    return (
                <div key={index} className='scroll-squares'>
                            <h4>{date.toLocaleDateString(undefined, { weekday: 'long' })}</h4>
                    <p>{day.temp.day.toFixed(0)} F</p>
                    <p>{day.wind_speed.toFixed(0)} {convertWindDegrees(day.wind_deg)}</p>
                    <p>{day.weather[0].description}</p>
                        </div>)

    })
}

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
            let variable = state[key]

            if (variable) {
                let displayValue = <div className='feedback-badge' key={key}>{value[variable]}</div>
                data.push(displayValue);
            }
        }
        if (data.length > 0) {
            return data;
        } else {
            return null;
        }
    }

    const radioFeedbackHtml = printRadioFeedback();

    return (
        <div className='wrapper'>
            <h2>Trip to {trail.name}</h2>
            <div className='trip-form'>
            <div className='mobile'>
                <Form className='form' onSubmit={submitTrip}>
                    <Form.Label htmlFor='date'>
                        <h3>Date</h3>
                    </Form.Label>
                    <Form.Control
                        type='date'
                        onChange={(e) => handleInput(e, setState)}
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
                        className='notes'
                        as='textarea'
                        rows={5}
                        name='notes'
                        id='notes'
                        value={state.notes}
                        onChange={(e) => handleInput(e, setState)}
                        placeholder='optional'
                    />
                    <button className='trail-list-button form-submit' type='submit'>Save Trip</button>
                </Form>
            </div>
                <div className='top'>
                    <div className='left desktop'>
                        <Form className='form desktop' onSubmit={submitTrip}>
                            <Form.Label htmlFor='date'>
                                <h3>Date</h3>
                            </Form.Label>
                            <Form.Control
                                type='date'
                                onChange={(e) => handleInput(e, setState)}
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
                                className='notes'
                                as='textarea'
                                rows={5}
                                name='notes'
                                id='notes'
                                value={state.notes}
                                onChange={(e) => handleInput(e, setState)}
                                placeholder='optional'
                            />
                            <button className='trail-list-button form-submit' type='submit'>Save Trip</button>
                        </Form>
                    </div>
                    <div className='right'>
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
                            <li>
                                <h3>
                                    Address
                                </h3>
                                {trail.park.address}
                            </li>

                            {(feedbackHtml || radioFeedbackHtml) &&
                                <li className='trip-feedback-wrapper'>
                                    <div>
                                        <h3 className='full-width'>Other hikers say this trail...</h3>
                                    </div>
                                    <div className='trip-badges-containter'>
                                        {feedbackHtml && feedbackHtml}
                                        {radioFeedbackHtml && radioFeedbackHtml}
                                    </div>
                                </li>
                            }
                        </ul>
                    </div>
                </div>

                <div className='bottom'>

                    <ul className='trail trip-form-segment'>
                        {trail.park.hours && <li className='whitespace'>
                            <h3>
                                Hours
                            </h3>
                            {trail.park.hours.replaceAll(';', '\n')}
                        </li>
                        }
                        {trail.park.fee &&
                            <li className='whitespace trip-form-segment'>
                                <h3>
                                    Fees
                                </h3>
                                {trail.park.fee.replaceAll(';', '\n').replaceAll('/', ' ')}
                            </li>
                        }
                    </ul>
                    {(typeof (trail.weather) != typeof ('string')) &&
                        <div className='trip-form-weather'>
                        <h3>Weather</h3>
                        <div className='horizontal-scroll-wrapper'>
                            {weatherHtml}
                        </div>
                    </div>
                    }
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