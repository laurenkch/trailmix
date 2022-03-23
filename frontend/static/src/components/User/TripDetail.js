import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { handleError, TRAIL_TYPES, handleInput, TimeInput, convertWindDegrees } from './../../util';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';
import MapModal from './MapModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function TripDetail() {

    const params = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState(null);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [trip, setTrip] = useState(null);

    const [showMap, setShowMap] = useState(false);

    const handleOpenMap = () => { setShowMap(true) };

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
        if (data.time && data.time.includes('-')) {
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

    console.log(trip);


    ///////////////////////////////////////////////// DISPLAY LOGIC

    if (!trip) {
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
            <Link className='link' to={`/trail/${trip.trail.id}/`}><h2>{trip.trailname}</h2></Link>
            <div className='trail-buttons'>
                <button className='trail-list-button' type='button' onClick={handleOpenMap}>Trail Map</button>
            </div>
            <div className='trail-top'>
                <div className='trip-details'>
                    <h2>Date</h2>
                    {!isEditingDate &&
                        <div className='trip-detail'>
                            {trip.date}
                            <button type='button' className='icon-button absolute-end' onClick={() => setIsEditingDate(true)}>< FontAwesomeIcon icon={faPencil} /></button>
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
                                <button type='submit flex-end' className='trail-list-button'>Save</button>
                            </Form>
                        </div>
                    }
                    <h2>Time</h2>
                    {!isEditingTime && trip.time === null &&
                        <div>
                            {trip.time}
                            < button type='button' className='icon-button' onClick={() => setIsEditingTime(true)}>Add Time</button>
                        </div>
                    }
                    {!isEditingTime && trip.time !== null &&
                        <div>
                            {trip.time}
                            < button type='button' className='icon-button' onClick={() => setIsEditingTime(true)}> < FontAwesomeIcon icon={faPencil} />
                            </button>
                        </div>
                    }
                    {isEditingTime &&
                        <Form onSubmit={editTrip}>
                            <TimeInput setFormState={setState} formState={state} />
                            <button type='submit'>Save</button>
                            <button type='button' className='trail-list-button' onClick={(e) => {
                                const newState = state
                                newState.time = null
                                setTrip(newState)
                                editTrip(e)
                            }}
                            >Delete Time</button>
                        </Form>
                    }
                    <h2>Notes</h2>
                    {!isEditingNotes && !trip.notes &&
                        <div>
                            {trip.notes}
                            < button type='button' className='icon-button' onClick={() => setIsEditingTime(true)}>Add Notes</button>
                        </div>
                    }
                    {!isEditingNotes && trip.notes &&
                        <div>
                            {trip.notes}
                            <button type='button' className='icon-button' onClick={() => setIsEditingNotes(true)}>< FontAwesomeIcon icon={faPencil} /></button>
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
                            <button type='submit' className='trail-list-button'>Save</button>
                        </Form>
                    }
                    <button button='type' className='close-modal' onClick={deleteTrip}>Cancel Trip</button>

                </div>
                <div className='trip-weather'>
                    {trip.weather &&
                        <div>
                            <h3>Weather</h3>
                            {weatherHtml}
                        </div>}
                </div>
            </div>

            <ul>

                <h3 className='park-name-detail'>
                    {trip.parkname}
                </h3>
                <li>
                    <h3>
                        Length
                    </h3>
                    {trip.length} miles
                </li>
                <li>
                    <h3>
                        Elevation gain
                    </h3>
                    {trip.elevation_gain} ft
                </li>
                <li>
                    <div className='difficulty-heading'>
                        <h3>
                            Difficulty
                        </h3>
                    </div>
                    <div>
                        {trip.difficulty}
                    </div>
                </li>
                <li>
                    <h3>
                        Trail Type
                    </h3>
                    {TRAIL_TYPES[trip.trail_type]}
                </li>
                <li>
                    <h3>
                        Address
                    </h3>
                    {trip.address}
                </li>
                {trip.fee &&
                    <li className='whitespace'>
                        <h3>
                            Fees
                        </h3>
                        {trip.fee.replaceAll(';', '\n').replaceAll('/', ' ')}
                    </li>
                }
            </ul>
            <MapModal trail={trip.trail} latitude={trip.latitude} longitude={trip.longitude} show={showMap} setShow={setShowMap} />
        </div>

    )
}

export default TripDetail