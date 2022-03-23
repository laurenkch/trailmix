import { useState, useEffect } from 'react';
import { handleError, convertDateFormat, convertTimeFormat } from './../../util';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

function Trips() {

    const [trips, setTrips] = useState(null);

    useEffect(() => {

        const getTrips = async () => {

            const response = await fetch('/api/v1/trails/trips/').catch(handleError);
            if (!response.ok) {
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                setTrips(data);
            }
        }
        if (!trips) {
            getTrips();
        }
    }, [trips]);

    if (!trips) {
        return 'Loading...'
    }
    const currentTime = new Date();

    if (trips.length < 1) {
        return 'No trips planned'
    }

    const upcomingTripsHtml = trips
        .filter((trip) => new Date(trip.date) > currentTime)
        .map((trip, index) => (
            <div>
            <Link className='trip-link' to={`/trip/${trip.id}`} key={index}>
                    <h3>{trip.trailname}</h3>
                </Link>
                <div>
                <div>
                    {convertDateFormat(trip.date)}
                </div>
                <div>
                        {convertTimeFormat(trip.time)}
                    </div>
                </div>
            </div>
        ));
    
    const pastTripsHtml = trips
        .filter((trip) => new Date(trip.date) < currentTime)
        .map((trip, index) => (
            <li key={index}>
                <h3>{trip.trailname}</h3>
                <div>{convertDateFormat(trip.date)}</div>
            </li>
        ));

    return (
        <div className='wrapper'>
            <h2>Upcoming Trips</h2>
            <ul>
                {upcomingTripsHtml.length > 0 ? upcomingTripsHtml: 'No upcoming trips'}
            </ul>
            <div className='past-trips'>
            <Accordion>
                <Accordion.Item eventKey='0'>
                    <Accordion.Header>Past Trips</Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            {pastTripsHtml.length > 0 ? pastTripsHtml: 'No past trips' }
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            </div>
        </div>
    )
}

export default Trips