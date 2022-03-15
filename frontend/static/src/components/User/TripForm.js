import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { handleError, TRAIL_TYPES, handleInput, TimeInput } from './../../util';
import Form from 'react-bootstrap/Form';

function TripForm() {

    const navigate = useNavigate();

    const INITIAL_STATE = {
        trail: '',
        date: '',
        time: '--:--',
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

    const weatherHtml = trail.weather
        .filter(segment => segment.isDaytime)
        .map((segment) => <div key={segment.number} className='scroll-squares'>
        <h4>{segment.name}</h4>
        <div className='weather-image'>
            <img src={segment.icon} alt={segment.shortForecast} />
        </div>
        <p>{segment.temperature}{segment.temperatureUnit}</p>
        <p>{segment.windSpeed}{segment.windDirection}</p>
        <p>{segment.detailedForecast}</p>
        </div>)

    return (
        <div>
            <h2>Trip to {trail.name}</h2>
            <ul>
            <li>{trail.elevation_gain}ft</li>
            <li>{trail.length}miles</li>
            <li>{TRAIL_TYPES[trail.trail_type]}</li>
            <li>{trail.description}</li>
            <li>{trail.park.name}</li>
            <li>{trail.park.address}</li>
            <li>{trail.park.fee}</li>
            <li>{trail.park.hours}</li>

            <h3>Weather</h3>
                <div className='horizontal-scroll-wrapper'>
            {weatherHtml}
            </div>
                
            </ul>
        
            <Form className='form' onSubmit={submitTrip}>
                <Form.Label htmlFor='date'>
                    Calendar
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
                    Time
                </Form.Label>
                <TimeInput setFormState={setState} formState={state}/>
                <button type='submit'>Save Trip</button>
            </Form>
        </div>
    )
};

export default TripForm