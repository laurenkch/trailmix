import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { handleError, TRAIL_TYPES , getWeather} from './../../util';
import Cookies from 'js-cookie';

function TripDetail() {
    
    const params = useParams();

    const [state, setState] = useState(null);
    const [weather, setWeather] = useState(null);

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


    }, [])

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
            {state.date}
            <button type='button'>Edit Date</button>
            {state.time}
            <button type='button'>Edit Time</button>
            {state.park}
            {state.address}
            {state.fee}
            {weather != null &&
            <div>
                {weatherHtml}
            </div>}
            <button button='type'>Cancel Trip</button>
        </div>

    )
}

export default TripDetail