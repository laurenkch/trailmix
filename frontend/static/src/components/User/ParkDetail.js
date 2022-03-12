import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { handleError, TRAIL_TYPES } from './../../util';
import Accordion from 'react-bootstrap/Accordion';
import {
    MapContainer,
    TileLayer,
    Popup,
    Marker
} from 'react-leaflet'
function ParkDetail() {

    const params = useParams();
    // const navigate = useNavigate();

    const [state, setState] = useState(undefined);

    ////////////////////////////////////////////////////LOAD PARK


    useEffect(() => {

        const getPark = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            };

            const response = await fetch(`/api/v1/trails/park/${params.parkId}/`, options).catch(handleError);

            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            const park = await response.json();
            setState(park);
        };
        getPark();

    }, [params.parkId]);

    if (!state) {
        return 'Loading...'
    }

    const trailHtml = state.trails.map((trail, index) => <Accordion.Item eventKey={index} key={index}>
        <Accordion.Header>{trail.name}</Accordion.Header>
        <Accordion.Body>
            <ul>
                <li>{trail.length} miles</li> 
                <li>{trail.elevation_gain} feet</li> 
                <li>{TRAIL_TYPES[trail.trail_type]}</li>
                <Link to={`/trail/${trail.id}`}>See More</Link>
                <Link to={`/plan/${trail.id}`}>Plan your trip</Link>
            </ul>
        </Accordion.Body>
    </Accordion.Item>)

    const position = [state.latitude, state.longitude]

    return (
        <div>
            <h2>{state.name}</h2>
            <MapContainer center={position} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                       {state.name}
                    </Popup>
                </Marker>
            </MapContainer>
            <ul>
                <li>Address: {state.address}</li>
                <li>Fee: {state.fee}</li>
                <li>Hours: {state.hours}</li>
                <li>Latitude: {state.latitude}</li>
                <li>Longitude: {state.longitude}</li>
                <li>Park code:{state.parkcode}</li>
                <li>Activities: {state.activities}</li>
            </ul>
            <Accordion>
                {trailHtml}
            </Accordion>
        </div>
    )
}

export default ParkDetail