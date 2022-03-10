import { useOutletContext, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError } from '../../util';
import Cookies from 'js-cookie';

function Home() {

    const [navigate, auth, setAuth, admin, setAdmin] = useOutletContext();
    const [parks, setParks] = useState(null);
    const [trails, setTrails] = useState(null);

    useEffect(() => {


        if (admin) {
            navigate('/administrator')

        }
        const getParkList = async () => {

            const options = {
                method: 'GET',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            };

            const response = await fetch('/api/v1/trails/parks/', options).catch(handleError);
            if (!response.ok) {
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                setParks(data);
            }
        }

        const getTrailList = async () => {

            const options = {
                method: 'GET',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            };

            const response = await fetch('/api/v1/trails/', options).catch(handleError);
            if (!response.ok) {
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                setTrails(data);
            }
        }
        getParkList();
        getTrailList();
        
    }, [admin, navigate])

    if (!parks || !trails) {
        return 'Loading...'
    };

    const parksHTML = parks.map((park) => (
        <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`park/${park.id}`}
            key={park.id}
        >
            {park.name}
        </Link>
    ))

    const trailsHTML = trails.map((trail) => (
        <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`trail/${trail.id}`}
            key={trail.id}
        >
            {trail.name}
        </Link>

    ))

    return (
        <div>
            Parks
            {parksHTML}
            Trails
            {trailsHTML}
        </div>
    )
}

export default Home