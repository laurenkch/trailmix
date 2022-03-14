import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError, TRAIL_TYPES, DIFFICULTY_KEY } from './../../util';
import Cookies from 'js-cookie';
import FeedbackModal from './FeedbackModal';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faX } from '@fortawesome/free-solid-svg-icons';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

function TrailDetail() {

    // eslint-disable-next-line
    const [navigate, auth, setAuth, admin, setAdmin] = useOutletContext();
    
    const params = useParams();

    const [state, setState] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showDifficulty, setShowDifficulty] = useState(false);

    const handleOpenFeedback = () => { setShowFeedback(true) };
    const handleOpenLogin = () => { setShowLogin(true) };

    ////////////////////////////////////////////////////LOAD TRAIL


    useEffect(() => {

        const getPark = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            };

            const response = await fetch(`/api/v1/trails/${params.trailId}/`, options).catch(handleError);

            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            const park = await response.json();
            setState(park);
        };
        getPark();

    }, [params.trailId]);

    if (!state) {
        return 'Loading...'
    }

    const difficultyMap = DIFFICULTY_KEY.map((entry) =>
        <div key={entry.level}>
            {`Level ${entry.level} : ${entry.description}`}
        </div>)
    
    const difficultyHtml = 
        <div>
            <button type='button' onClick={() => setShowDifficulty(false)}><FontAwesomeIcon icon={faX} /></button>
            Difficulty is based on total length and elevation gain.
            {difficultyMap}
        </div>
    
    const currentDifficultyHtml = 
        <div>
            {DIFFICULTY_KEY[state.difficulty - 1].description}
            <button type='button' onClick={()=>setShowDifficulty(true)}>Read more about difficulty</button>
        </div>
    
    
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            <div>
                {showDifficulty ? difficultyHtml : currentDifficultyHtml}
            </div>
        </Tooltip>
    );

    return (
        <div>
            <h2>{state.name}</h2>
            <ul>
                <li>Elevation gain: {state.elevation_gain}ft</li>
                <li>Length: {state.length}miles</li>
                <li>Difficulty: {state.difficulty}</li>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                    trigger="click"
                >
                    <Button variant="success"><FontAwesomeIcon icon={faCircleQuestion}/></Button>
                </OverlayTrigger>
                <li>Trail Type:{TRAIL_TYPES[state.trail_type]}</li>
                <li>Description: {state.description}</li>
                <li>Name: {state.park.name}</li>
                <li>Address: {state.park.address}</li>
                <li>Fee: {state.park.fee}</li>
                <li>Hours: {state.park.hours}</li>
            </ul>
            {auth && <button
                type='button' onClick={handleOpenFeedback}
            >
                How was this hike?
            </button>}
            {auth && <Link
                to={`/plan/${state.id}`}
            >
                Plan a trip to {state.name}
            </Link>}
            {!auth && <button
                type='button' onClick={handleOpenLogin}
            >
                Plan a trip to {state.name}
            </button>}
            <FeedbackModal id={state.id} show={showFeedback} setShow={setShowFeedback} />
            <LoginModal trailId={state.id} show={showLogin} setShow={setShowLogin} navigate={navigate} setAuth={setAuth} setAdmin={setAdmin} setShowRegister={setShowRegister} />
            <RegisterModal trailId={state.id} show={showRegister} setShow={setShowRegister} navigate={navigate} setAuth={setAuth} setShowLogin={setShowLogin}/>
        </div>
    )
}

export default TrailDetail