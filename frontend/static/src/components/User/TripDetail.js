import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleError, TRAIL_TYPES , getWeather, handleInput} from './../../util';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';

function TripDetail() {
    
    const params = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState(null);
    const [weather, setWeather] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [isEditingTime, setIsEditingTime] = useState(false);


    const currentTime = new Date();
    const forecastCutoff = currentTime.setDate(currentTime.getDate() + 7);

    useEffect(() => {

        const getTripDetails = async () => {

            const options = {
                method: 'GET',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            };

            const response = await fetch(`/api/v1/trails/trip/${params.tripId}/`, options).catch(handleError);

            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            const trip = await response.json();
            setState(trip);

            if (!weather && (new Date(trip.date) < forecastCutoff)) {
                const data = await getWeather(trip.latitude, trip.longitude);
                setWeather(data);
            } else {
                setWeather('none');
            }
        }

        if (!state) {
            getTripDetails();
        }


    }, []);

    ///////////////////////////////////////////////// EDIT TRIP

    const editTrip = async (e) => {

        e.preventDefault();
        console.log('test');

        const options = {
            method: 'PUT',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state),
        };

        const response = await fetch(`/api/v1/trails/trip/${state.id}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        setIsEditingDate(false);
        setIsEditingTime(false);

    };

///////////////////////////////////////////////// DELETE TRIP

    const deleteTrip = async (e) => {

        e.preventDefault();

        const options = {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }

        const response = await fetch(`/api/v1/trails/trip/${state.id}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        // setTrails(newTrailList);
        navigate('/trips')
    };


///////////////////////////////////////////////// DISPLAY LOGIC


    if (!state || weather == null) {
        return 'Loading...'
    }

    let weatherHtml;

    if (weather != null && weather != 'none') {
        weatherHtml = weather
            .filter((entry) => (new Date(entry.startTime).getDate() == new Date(state.date).getDate()))
            .map((entry) => (
                <div key={entry.number} className='scroll-squares'>
                    <h4>{entry.name}</h4>
                    <div className='weather-image'>
                        <img src={entry.icon} alt={entry.shortForecast} />
                    </div>
                    <p>{entry.temperature}{entry.temperatureUnit}</p>
                    <p>{entry.windSpeed}{entry.windDirection}</p>
                    <p>{entry.detailedForecast}</p>
                </div>));
    };

    return (
        <div>
            <h2>{state.trailname}</h2>

            {!isEditingDate &&
                <div>
                    {state.date}
                    <button type='button' onClick={() => setIsEditingDate(true)}>Edit Date</button>
                </div>
            }
            {isEditingDate &&
                <div>
                    <Form onSubmit={editTrip}>
                        <Form.Label htmlFor='date'>
                            Calendar
                        </Form.Label>
                        <Form.Control
                            type='date'
                            onChange={(e) => handleInput(e, setState)}
                            required
                            name='date'
                            id='date'
                            value={state.date}
                        />
                        <button type='submit'>Save</button>
                    </Form>
                </div>
            }
            {!isEditingTime &&
                <div>
                { state.time }
                    < button type='button' onClick={() => setIsEditingTime(true)}>Edit Time</button>
                </div>
            }
            {isEditingTime &&
                <Form onSubmit={editTrip}>
                    <Form.Label htmlFor='time'>
                        Time
                    </Form.Label>
                    <Form.Control
                        type='time'
                        onChange={(e) => handleInput(e, setState)}
                        name='time'
                        id='time'
                        placeholder='optional'
                        step={5000}
                        value={state.time}
                    />
                    <button type='submit'>Save</button>
                </Form>
            }
            {state.park}
            {state.address}
            {state.fee}
            {weather != null &&
            <div>
                {weatherHtml}
            </div>}
            <button button='type' onClick={deleteTrip}>Cancel Trip</button>
        </div>

    )
}

export default TripDetail