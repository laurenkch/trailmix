import { useOutletContext, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError } from '../../util';
import Cookies from 'js-cookie';
import {
    MapContainer,
    TileLayer,
    Popup,
    Marker,
} from 'react-leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Accordion from 'react-bootstrap/Accordion';
import Fuse from 'fuse.js';

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

    const options = {
        isCaseSensitive: false,
        includeScore: true,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: [
            "name",
        ]
    };

    const fuse = new Fuse([...trails,...parks], options);

    if (results.length > 0) {
        resultsHtml = results.map((item, index) => item.latitude ? 
                <div className='result' key={index} onMouseDown={() => navigate(`park/${item.id}`)}>{item.name}</div>
            :
                <div className='result' key={index} onMouseDown={() => navigate(`trail/${item.id}`)}>{item.name}</div>
            )
        } else {
            resultsHtml = <div>'No matching trails'</div>
        };

    const runSearch = (e) => {
        setSearchState(e.target.value);
        const data = fuse.search(e.target.value)
        const newData = data
            .map((result) => ( result.item ));
        setResults(newData)
    }

    console.log(results);

    return (
        <div className='home wrapper'>
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
            <MapContainer center={[34.842798, -82.7640215]} zoom={9.2}>
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

