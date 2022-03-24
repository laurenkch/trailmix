import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { handleError, TRAIL_TYPES, handleInput, TimeInput, convertWindDegrees, getWeatherIcons, convertTimeFormat } from './../../util';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';
import MapModal from './MapModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faMap } from '@fortawesome/free-solid-svg-icons';

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
                notes: trip.notes,
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
        if ((data.time && data.time.includes('-')) || ((e.target.name === 'time') && (e.target.id === 'delete'))) {
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

    if (!trip) {
        return 'Loading...'
    }

    let weatherHtml;

    if (trip.weather) {
        const data = trip.weather.daily[0]
        let date = new Date(data.dt)
        weatherHtml =
            <div className='scroll-squares whitespace'>
                <h4>{date.toLocaleDateString(undefined, {
                    weekday: 'long', month: 'numeric',
                    day: 'numeric'
                }).replace(',', '\n')}</h4>
                <div className='weather-icon'>
                    {getWeatherIcons(data.weather[0].description)}
                </div>
                <p className='temp'>{data.temp.day.toFixed(0)} F</p>
                <p>Winds {'\n' + data.wind_speed.toFixed(0)} {convertWindDegrees(data.wind_deg)}</p>
                <p>{data.weather[0].description}</p>
            </div>
    };

    return (
        <div className='wrapper'>
            
            <Link className='link' to={`/trail/${trip.trail.id}/`}><h2 className='max-75'>Trip to {trip.trailname}</h2></Link>
            <div className='trail-buttons'>
                <button className='mobile trail-list-button map-button' type='button' onClick={handleOpenMap}>Map <FontAwesomeIcon icon={faMap} /></button>
                <button className='trail-list-button desktop map-button trip-detail-map' type='button' onClick={handleOpenMap}>Map <FontAwesomeIcon icon={faMap} /></button>
            </div>
            <div className='trail-top'>
                <div className='trip-details'>
                    <h3>Trip Details</h3>
                    {!isEditingDate &&
                        <div className='trip-detail'>
                            <div className='flex'>
                                <h4>Date</h4>
                            <button type='button' className='icon-button' onClick={() => setIsEditingDate(true)}>< FontAwesomeIcon icon={faPencil} /></button>
                            </div>
                            {trip.date}
                        </div>
                    }
                    {isEditingDate &&
                        <div className='trip-detail'>
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
                    {!isEditingTime && trip.time === null &&
                        <div className='trip-detail'>
                            <h4>Time</h4>
                            {convertTimeFormat(trip.time)}
                            < button type='button' className='icon-button' onClick={() => setIsEditingTime(true)}>Add Time</button>
                        </div>
                    }
                    {!isEditingTime && trip.time !== null &&
                <div className='trip-detail'>
                            <div className='flex'>
                            <h4>Time</h4>
                            <button type='button' className='icon-button' onClick={() => setIsEditingTime(true)}> < FontAwesomeIcon icon={faPencil} />
                            </button>
                            </div>
                            {convertTimeFormat(trip.time)}
                        </div>
                    }
                    {isEditingTime && trip.time === null &&
    <div className='trip-detail'>
                            <h4>Time</h4>
                            <Form onSubmit={editTrip}>
                                <TimeInput setFormState={setState} formState={state} />
                                <button type='submit' className='trail-list-button'>Save</button>
                            </Form>
                        </div>
                    }
                    {isEditingTime && trip.time != null &&
                        <div className='trip-detail'>
                        <h4>Time</h4>
                        <Form onSubmit={editTrip}>
                            <TimeInput setFormState={setState} formState={state} />
                            <button type='submit' className='trail-list-button'>Save</button>
                            <button type='button' className='trail-list-button' id='delete' name='time' onClick={(e) => {
                                editTrip(e)
                            }}
                            >Delete Time</button>
                        </Form>
                        </div>
                    }
                    {!isEditingNotes && !trip.notes &&
                        <div className='trip-detail'>
                            <h4>Notes</h4>
                            {trip.notes}
                            <button type='button' className='icon-button' onClick={() => setIsEditingNotes(true)}>Add Notes</button>
                        </div>
                    }
                    {!isEditingNotes && trip.notes &&
                        <div className='trip-detail'>
                            <div className='flex'>
                                <h4>Notes</h4>
                                <button type='button' className='icon-button' onClick={() => setIsEditingNotes(true)}>< FontAwesomeIcon icon={faPencil} /></button>
                            </div>
                            {trip.notes}
                        </div>}
                    {isEditingNotes &&
                        <div className='trip-detail'>
                            <h4>Notes</h4>
                        <Form onSubmit={editTrip}>
                            <Form.Control
                                as='textarea'
                                rows={5}
                                onChange={(e) => handleInput(e, setState)}
                                name='notes'
                                id='notes'
                                value={state.notes}
                            />
                            <button type='submit' className='trail-list-button'>Save</button>
                        </Form>
                        </div>
                    }

                </div>
                <div className='trip-weather'>
                    {trip.weather &&
                        <div className='scroll-squares flex center column'>
                            <h3 className='center'>Weather</h3>
                            {weatherHtml}
                        </div>}
                    {!trip.weather &&
                        <div className='scroll-squares flex center column no-weather-wrapper'>
                            <h3 className='center'>Weather</h3>
                            <div className='no-weather-wrapper flex center'>
                                <p className='no-weather'>Weather is available 7 days out. Check back closer to your trip to view the weather forecast!</p>
                            </div>
                        </div>}
                </div>
            </div>
            <ul className='trip-detail-trail-info'>
                <li>
                <h4>
                    {trip.parkname}
                </h4>
                    {trip.address}
                </li>
                <li>
                    <h4>
                        Length
                    </h4>
                    {trip.length} miles
                </li>
                <li>
                    <h4>
                        Elevation gain
                    </h4>
                    {trip.elevation_gain} ft
                </li>
                <li>
                    <div className='difficulty-heading'>
                        <h4>
                            Difficulty
                        </h4>
                    </div>
                    <div>
                        {trip.difficulty}
                    </div>
                </li>
                <li>
                    <h4>
                        Trail Type
                    </h4>
                    {TRAIL_TYPES[trip.trail_type]}
                </li>
                {trip.fee &&
                    <li className='whitespace'>
                        <h4>
                            Fees
                        </h4>
                        {trip.fee.replaceAll(';', '\n').replaceAll('/', ' ')}
                    </li>
                }
            </ul>
            <button button='type' className='cancel-trip' onClick={deleteTrip}>Cancel Trip</button>
            <MapModal trail={trip.trail} latitude={trip.latitude} longitude={trip.longitude} show={showMap} setShow={setShowMap} />
        </div>

    )
}

export default TripDetail