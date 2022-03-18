import { useOutletContext, Link } from 'react-router-dom';

function AdminList() {

    // eslint-disable-next-line
    const [parks, setParks, trails, setTrails] = useOutletContext();

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
        <div className='admin-list'>
            Parks
            {parksHTML}
            Trails
            {trailsHTML}
        </div>
    )
}

export default AdminList