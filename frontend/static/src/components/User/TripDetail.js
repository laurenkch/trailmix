import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleError, TRAIL_TYPES, handleInput, TimeInput} from './../../util';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';



function TripDetail() {
    
    const params = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [trip, setTrip] = useState(null);

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
            setTrip(trip);

            setState({
                id: trip.id,
                date: trip.date,
                time: trip.time,
            })

        }

        if (!trip) {
            getTripDetails();
        }

    }, [params.tripId, trip]);

    ///////////////////////////////////////////////// EDIT TRIP

    const editTrip = async (e) => {

        e.preventDefault();

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

        const data = await response.json()
        setTrip(data)

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

        navigate('/trips')
    };


///////////////////////////////////////////////// DISPLAY LOGIC


    if (!trip ) {
        return 'Loading...'
    }

    let weatherHtml;

    if (trip.weather) {
        const data = trip.weather[0]
        weatherHtml =
            <div className='scroll-squares'>
                <h4>{data.name}</h4>
                <div className='weather-image'>
                    <img src={data.icon} alt={data.shortForecast} />
                </div>
                <p>{data.temperature}{data.temperatureUnit}</p>
                <p>{data.windSpeed}{data.windDirection}</p>
                <p>{data.detailedForecast}</p>
            </div>
    };

    console.log(state);

    return (
        <div>
            <h2>{trip.trailname}</h2>

            {!isEditingDate &&
                <div>
                    {trip.date}
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
                { trip.time }
                    < button type='button' onClick={() => setIsEditingTime(true)}>Edit Time</button>
                </div>
            }
            {isEditingTime &&
                <Form onSubmit={editTrip}>
                    <TimeInput setFormState={setState} formState={state}/>
                    <button type='submit'>Save</button>
                </Form>
            }
            {trip.park}
            {trip.length}
            {trip.elevation_gain}
            {trip.difficulty}
            {TRAIL_TYPES[trip.trail_type]}
            {trip.address}
            {trip.fee}
            {trip.weather &&
            <div>
                {weatherHtml}
            </div>}
            <button button='type' onClick={deleteTrip}>Cancel Trip</button>
        </div>

    )
}

export default TripDetail