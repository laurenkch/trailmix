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
    const [results, setResults] = useState('');


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
                setResults(data);
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

    const popupHtml = parks.map((park) => (
        <Marker key={park.id} position={[park.latitude, park.longitude]}>
            <Popup>
                <Link to={`park/${park.id}`}>{park.name}</Link>
            </Popup>
        </Marker>
    ));

    let resultsHtml;

    if (results.length > 0) {
        resultsHtml = results.map((trail) => <div className='result' key={trail.id} onMouseDown={()=>navigate(`trail/${trail.id}`)}>{trail.name}</div>)
    } else {
        resultsHtml = <div>'No matching trails'</div>
    }

    const runSearch = (e) => {
        setSearchState(e.target.value);
        const data = trails.filter((trail) => trail.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setResults(data)

    }

    return (
        <div className='home'>
            <div className='full-width search'>
                <input
                    className='search-bar'
                    type='text'
                    onChange={runSearch}
                    name='search'
                    value={searchState}
                    onFocus={() => setIsSearching(true)}
                    onBlur={() => {
                        setIsSearching(false)
                        setSearchState('')
                    }}
                    autoComplete='off'
                    placeholder='search trails'
                />
                <FontAwesomeIcon className='search-icon gray-font' icon={faMagnifyingGlass} />
                <div className={isSearching ? 'search-results' : 'hidden search-results'}>
                    {isSearching && resultsHtml}
                </div>
            </div>
            <MapContainer center={[34.7119067, -82.3037375]} zoom={9}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {popupHtml}
            </MapContainer>
            <div className='home-lists'>
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
        </div>
    )
}

export default Home

