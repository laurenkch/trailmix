import { useState, useEffect, useParams } from 'react';
import { handleError } from './../../util';
import { Link } from 'react-router-dom';

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
    }, []);

    if (!trips) {
        return 'Loading...'
    }
    const currentTime = new Date();

    trips.forEach((trip) => console.log(trip));

    const upcomingTripsHtml = trips
        .filter((trip) => new Date(trip.date) > currentTime)
        .map((trip, index) => (
            <Link to={`/trip/${trip.id}`} key={index}>
                <h3>{trip.trailname}</h3>
                {trip.date}
                {trip.time}
            </Link>
        ));
    const pastTripsHtml = trips
        .filter((trip) => new Date(trip.date) < currentTime)
        .map((trip, index) => (
            <li key={index}>
                <h3>{trip.trailname}</h3>
                {trip.date}
                {trip.time}
            </li>
        ));

    return (
        <div>
            <h2>Upcoming Trips</h2>
            <ul>
                {upcomingTripsHtml}
            </ul>
            <h2>Past Trips</h2>
            <ul>
                {pastTripsHtml}
            </ul>
        </div>
    )
}

export default Trips