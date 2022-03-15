import { useOutletContext, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError } from '../../util';
import Cookies from 'js-cookie';
import {
    MapContainer,
    TileLayer,
    Popup,
    Marker
} from 'react-leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Accordion from 'react-bootstrap/Accordion';



function Home() {

    // eslint-disable-next-line
    const [navigate, auth, setAuth, admin, setAdmin] = useOutletContext();
    const [parks, setParks] = useState(null);
    const [trails, setTrails] = useState(null);
    const [searchState, setSearchState] = useState('');
    const [isSearching, setIsSearching] = useState(false);

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

    const [results, setResults] = useState('');


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

    const popupHtml = parks.map((park) => (
        <Marker key={park.id} position={[park.latitude, park.longitude]}>
            <Popup>
                <Link to={`park/${park.id}`}>{park.name}</Link>
            </Popup>
        </Marker>
    ));

    let resultsHtml;
    if (results) {
        resultsHtml = results.map((trail) => <div key={trail.id} onMouseDown={()=>navigate(`trail/${trail.id}`)}>{trail.name}</div>)
    }

    const runSearch = (e) => {
        setSearchState(e.target.value);
        const data = trails.filter((trail) => trail.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setResults(data)
    }

    return (
        <div>

            <MapContainer center={[34.7119067, -82.3037375]} zoom={9}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {popupHtml}
            </MapContainer>
            <div>
                <input
                    type='text'
                    onChange={runSearch}
                    name='search'
                    value={searchState}
                    onFocus={()=>setIsSearching(true)}
                    onBlur={() => {
                        setIsSearching(false)
                        setSearchState('')
                    }}
                    autoComplete='off'
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                {isSearching && resultsHtml}
            </div>
            <Accordion>
                <Accordion.Item eventKey='0'>
                <Accordion.Header>Parks</Accordion.Header>
                <Accordion.Body>
                    <ul>{parksHTML}</ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Accordion>
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

export default Home

// const trailHtml = state.trails.map((trail, index) => <Accordion.Item eventKey={index} key={index}>
//     <Accordion.Header>{trail.name}</Accordion.Header>
//     <Accordion.Body>
//         <ul>
//             <li>{trail.length} miles</li>
//             <li>{trail.elevation_gain} feet</li>
//             <li>{TRAIL_TYPES[trail.trail_type]}</li>
//             <Link to={`/trail/${trail.id}`}>See More</Link>
//             <Link to={`/plan/${trail.id}`}>Plan your trip</Link>
//         </ul>
//     </Accordion.Body>
// </Accordion.Item>)