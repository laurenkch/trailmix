import { useParams, Link, useOutletContext } from 'react-router-dom';
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
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';


function ParkDetail() {

    const params = useParams();
    // const navigate = useNavigate();

    // eslint-disable-next-line
    const [navigate, auth, setAuth, admin, setAdmin] = useOutletContext();

    const [state, setState] = useState(undefined);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [trailId, setTrailId] = useState(null);

    const handleOpenLogin = (e) => {
        console.log(e.target.value);
        setTrailId(e.target.value)
        setShowLogin(true)
    };

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
                <li>
                    <h4>
                        Length
                    </h4>
                    {trail.length.slice(-1)==='0'? trail.length.slice(0,-1) : trail.length} miles
                </li> 
                <li>
                    <h4>
                        Elevation gain
                    </h4>
                    {trail.elevation_gain} feet
                </li> 
                <li>
                    <h4>
                        Trail type
                    </h4>
                    {TRAIL_TYPES[trail.trail_type]}
                </li>
            </ul>
            <div className='trail-list-buttons'>
                <Link className='trail-list-button' to={`/trail/${trail.id}`}>
                    See More
                </Link>
                {/* <Link className='trail-list-button' to={`/plan/${trail.id}`}>
                    Plan a trip
                </Link> */}
                {auth && <Link className='trail-list-button'
                    to={`/plan/${trail.id}`}
                >
                    Plan a trip
                </Link>}
                {!auth && <button className='trail-list-button'
                    type='button' value={trail.id} onClick={handleOpenLogin}
                >
                    Plan a trip
                </button>}

            </div>
        </Accordion.Body>
    </Accordion.Item>)

    const position = [state.latitude, state.longitude]

    return (
        <div className='wrapper park'>
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
                <li className='park-attributes'>
                    <h3>
                        Address
                    </h3>
                    <div>
                        {state.address}
                    </div>
                </li>
                {state.hours &&
                    <li className='park-attributes'>
                        <h3>
                            Hours
                        </h3>
                        <div>
                            {state.hours.replaceAll(';', '\n')}
                        </div>
                    </li>
                }
                {state.fee &&
                    <li className='park-attributes'>
                        <h3>
                            Fees
                        </h3>
                        <div>
                            {state.fee.replaceAll(';', '\n')}
                        </div>
                    </li>}
                {state.activities &&
                    <li className='park-attributes'>
                        <h3>
                            Activites
                        </h3>
                        <div>
                            {state.activities}
                        </div>
                </li>}
            </ul>
            <h3>
                Trails
            </h3>
            <Accordion>
                {trailHtml}
            </Accordion>
            <LoginModal trailId={trailId} show={showLogin} setShow={setShowLogin} navigate={navigate} setAuth={setAuth} setAdmin={setAdmin} setShowRegister={setShowRegister} />
            <RegisterModal trailId={trailId} show={showRegister} setShow={setShowRegister} navigate={navigate} setAuth={setAuth} setShowLogin={setShowLogin} />
        </div>
    )
}

export default ParkDetail