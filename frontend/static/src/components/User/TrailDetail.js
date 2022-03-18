import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError, TRAIL_TYPES, DIFFICULTY_KEY, FEEDBACK_CHECKBOX_OPTIONS, RADIO_OPTIONS } from './../../util';
import Cookies from 'js-cookie';
import FeedbackModal from './FeedbackModal';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
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
            <h3>
                {`Level ${entry.level}`}
            </h3>
            {entry.description}
        </div>)
    
    const difficultyHtml =
        <div className='levels'>
            Difficulty is based on total length and elevation gain.
            {difficultyMap}
        </div>
    
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            <div className='tip'>
                {difficultyHtml}
            </div>
        </Tooltip>
    );

    let weatherHtml;

    if (state.weather) {
        weatherHtml = state.weather
            .filter(segment => segment.isDaytime)
            .map((segment) =>
                <div key={segment.number} className='scroll-squares'>
                <h4>{segment.name}</h4>
                <div className='weather-image'>
                    <img src={segment.icon} alt={segment.shortForecast} />
                </div>
                <p>{segment.temperature}{segment.temperatureUnit}</p>
                <p>{segment.windSpeed}{segment.windDirection}</p>
                <p>{segment.detailedForecast}</p>
            </div>)
    } 
    
    let feedbackHtml;

    if (Object.values(state).includes('true')) {
        feedbackHtml = FEEDBACK_CHECKBOX_OPTIONS
            .filter((option) => (state[option]))
            .map((option) => (option.replaceAll('_', ' ')))
            .map((option, index) => (<div className='feedback-badge' key={index}>{option}</div>))
    };

    const printRadioFeedback = () => {

        let data = [];

        for (const [key, value] of Object.entries(RADIO_OPTIONS)) {
            let variable = state[key]

            if (variable) {
                let displayValue = <div className='feedback-badge' key={key}>{value[variable]}</div>
                data.push(displayValue);
            }
        }
        return data;
    }

    const radioFeedbackHtml = printRadioFeedback();
    
    return (
        <div className='wrapper trail'>
            <h2>{state.name}</h2>
            <ul>
                <li>
                    <h3>
                        Elevation gain
                    </h3>
                    {state.elevation_gain}ft
                </li>
                <li>
                    <h3>
                        Length
                    </h3>
                    {state.length} miles
                </li>
                <li>
                    <div className='difficulty-heading'>
                        <h3>
                            Difficulty
                        </h3>
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}

                            trigger={['hover', 'focus']}
                        >
                            <Button variant="success"><FontAwesomeIcon icon={faCircleQuestion} /></Button>
                        </OverlayTrigger>
                    </div>
                    <div>
                        {state.difficulty}
                    </div>
                </li>
                <li>
                    <h3>
                        Trail Type
                    </h3>
                    {TRAIL_TYPES[state.trail_type]}
                </li>
                <li>
                    <h3>
                        Description
                    </h3>
                    {state.description}
                </li>
                <li>
                    <h3>
                        Park
                    </h3>
                    {state.park.name}
                </li>
                <li>
                    <h3>
                        Address
                    </h3>
                    {state.park.address}
                </li>
                {state.park.fee && <li className='whitespace'>
                    <h3>
                        Fees
                    </h3>
                    {state.park.fee.replaceAll(';', '\n')}
                </li>}
                {state.park.hours && <li className='whitespace'>
                    <h3>
                        Hours
                    </h3>
                    {state.park.hours.replaceAll(';', '\n')}
                </li>
                }
            </ul>
            {feedbackHtml && radioFeedbackHtml && <h3>Other hikers say this trail...</h3>}
            {(feedbackHtml || radioFeedbackHtml) &&
                < div className='feedback-wrapper'>
            {feedbackHtml && feedbackHtml}
            {radioFeedbackHtml && radioFeedbackHtml}
        </div>
            }
            {auth && <button
                type='button' onClick={handleOpenFeedback}
            >
                How was this hike?
            </button>}
            <div className='plan-trip-prompt-wrapper'>
            {auth && <Link className='plan-trip-prompt'
                to={`/plan/${state.id}`}
            >
                Plan a trip to {state.name}
            </Link>}
            {!auth && <button className='plan-trip-prompt'
                type='button' onClick={handleOpenLogin}
            >
                Plan a trip to {state.name}
                </button>}
            </div>
            <div className='weather'>
            <h3>Weather</h3>
            <div className='horizontal-scroll-wrapper'>
                {weatherHtml}
                </div>
            </div>
            <FeedbackModal id={state.id} show={showFeedback} setShow={setShowFeedback} />
            <LoginModal trailId={state.id} show={showLogin} setShow={setShowLogin} navigate={navigate} setAuth={setAuth} setAdmin={setAdmin} setShowRegister={setShowRegister} />
            <RegisterModal trailId={state.id} show={showRegister} setShow={setShowRegister} navigate={navigate} setAuth={setAuth} setShowLogin={setShowLogin}/>
        </div>
    )
}

export default TrailDetail