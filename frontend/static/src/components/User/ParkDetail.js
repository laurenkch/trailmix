import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { handleError } from './../../util';

function ParkDetail() {

    const params = useParams();
    const navigate = useNavigate();

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
    
    return (
        <div>
            <h2>{state.name}</h2>
            <ul>
                <li>Address: {state.address}</li>
                <li>Fee: {state.fee}</li>
                <li>Hours: {state.hours}</li>
                <li>Latitude: {state.latitude}</li>
                <li>Longitude: {state.longitude}</li>
                <li>Park code:{state.parkcode}</li>
                <li>Activities: {state.activities}</li>
            </ul>
        </div>
    )
}

export default ParkDetail