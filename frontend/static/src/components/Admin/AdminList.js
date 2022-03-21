import { useOutletContext, Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';

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
                <Accordion>
                    <Accordion.Item eventKey='0'>
                        <Accordion.Header>Parks</Accordion.Header>
                        <Accordion.Body>
                            <ul>{parksHTML}</ul>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey='1'>
                        <Accordion.Header>Trails</Accordion.Header>
                        <Accordion.Body>
                            <ul>{trailsHTML}</ul>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
        </div>
    )
}

export default AdminList