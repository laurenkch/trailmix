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
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


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
                {park.name}
            </Popup>
        </Marker>
    ));

    let resultsHtml;
    if (results) {
        resultsHtml = results.map((trail) => <div>{trail.name}</div>)
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
            <Form>
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
                {/* <button type='submit'><FontAwesomeIcon icon={faMagnifyingGlass}/></button> */}
            </Form>
            {isSearching && resultsHtml}
            Parks
            {parksHTML}
            Trails
            {trailsHTML}
        </div>
    )
}

export default Home