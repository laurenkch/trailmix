import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError, TRAIL_TYPES, DIFFICULTY_KEY, FEEDBACK_CHECKBOX_OPTIONS, RADIO_OPTIONS } from './../../util';
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

    const weatherHtml = state.weather
        .filter(segment => segment.isDaytime)
        .map((segment) => <div key={segment.number} className='scroll-squares'>
            <h4>{segment.name}</h4>
            <div className='weather-image'>
                <img src={segment.icon} alt={segment.shortForecast} />
            </div>
            <p>{segment.temperature}{segment.temperatureUnit}</p>
            <p>{segment.windSpeed}{segment.windDirection}</p>
            <p>{segment.detailedForecast}</p>
        </div>)
    

    let feedbackHtml;

    if (Object.values(state).includes(true)) {
        feedbackHtml = FEEDBACK_CHECKBOX_OPTIONS
            .filter((option) => (state[option]))
            .map((option) => (option.replaceAll('_', ' ')))
            .map((option, index) => (<div key={index}>{option}</div>))
    };

    const printRadioFeedback = () => {

        let data = [];

        for (const [key, value] of Object.entries(RADIO_OPTIONS)) {
            let variable = state[key]
            let displayValue = <div key={key}>{value[variable]}</div>
            data.push(displayValue);
        }
        return data;
    }

    const radioFeedbackHtml = printRadioFeedback();
    
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
            {feedbackHtml && feedbackHtml}
            {radioFeedbackHtml && radioFeedbackHtml}
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
            <h3>Weather</h3>
            <div className='horizontal-scroll-wrapper'>
                {weatherHtml}
            </div>
            <FeedbackModal id={state.id} show={showFeedback} setShow={setShowFeedback} />
            <LoginModal trailId={state.id} show={showLogin} setShow={setShowLogin} navigate={navigate} setAuth={setAuth} setAdmin={setAdmin} setShowRegister={setShowRegister} />
            <RegisterModal trailId={state.id} show={showRegister} setShow={setShowRegister} navigate={navigate} setAuth={setAuth} setShowLogin={setShowLogin}/>
        </div>
    )
}

export default TrailDetail