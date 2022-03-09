import { useEffect, useState } from 'react';
import { handleError } from '../../util';
import { Link } from 'react-router-dom';


function Admin() {

    const [parks, setParks] = useState(null);
    const [trails, setTrails] = useState(null);

    useEffect(() => {
        const getParkList = async () => {

            const response = await fetch('/api/v1/trails/admin/parks/').catch(handleError);
            if (!response.ok) {
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                setParks(data);
            }
        }

        const getTrailList = async () => {

            const response = await fetch('/api/v1/trails/admin/').catch(handleError);
            if (!response.ok) {
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                setTrails(data);
            }
        }
        getParkList();
        getTrailList();
    }, []);

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

export default Admin