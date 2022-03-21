import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { handleError, TRAIL_TYPES, handleInput, TimeInput, convertWindDegrees } from './../../util';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';



function TripDetail() {
    
    const params = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
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

        let data = state
        if (data.time && data.time.includes('-')){
            data.time = null
        }

        const options = {
            method: 'PUT',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(`/api/v1/trails/trip/${state.id}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        const updatedTrip = await response.json()
        setTrip(updatedTrip)

        setIsEditingDate(false);
        setIsEditingTime(false);
        setIsEditingNotes(false);

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
        const data = trip.weather.daily[0]
        weatherHtml =
            <div className='scroll-squares'>
                <h4>{data.dt}</h4>
                <p>{data.temp.day.toFixed(0)} F</p>
                <p>{data.wind_speed.toFixed(0)} {convertWindDegrees(data.wind_deg)}</p>
                <p>{data.weather[0].description}</p>
            </div>
    };

    return (
        <div className='wrapper'>
            <Link to={`/trail/${trip.trail.id}/`}><h2>{trip.trailname}</h2></Link>

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
            {!isEditingTime && trip.time === null &&
                <div>
                    {trip.time}
                    < button type='button' onClick={() => setIsEditingTime(true)}>Add Time</button>
                </div>
            }
            {!isEditingTime && trip.time !== null &&
                <div>
                { trip.time }
                    < button type='button' onClick={() => setIsEditingTime(true)}>Edit Time</button>
                </div>
            }
            {isEditingTime &&
                <Form onSubmit={editTrip}>
                    <TimeInput setFormState={setState} formState={state}/>
                    <button type='submit'>Save</button>
                    <button type='button' onClick={(e) => {
                        const newState = state
                        newState.time = null
                        setTrip(newState)
                        editTrip(e)
                    }}
                    >Delete Time</button>
                </Form>
            }
            {!isEditingNotes && trip.notes !== null &&
                <div>
                    {trip.notes}
                    <button type='button' onClick={() => setIsEditingNotes(true)}>Edit Notes</button>
                </div>}
            {isEditingNotes &&
                <Form onSubmit={editTrip}>
                    <Form.Control
                        as='textarea'
                        rows={5}
                        onChange={(e) => handleInput(e, setState)}
                        name='notes'
                        id='notes'
                        value={trip.notes}
                    />
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