import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError, TRAIL_TYPES, DIFFICULTY_KEY, FEEDBACK_CHECKBOX_OPTIONS, RADIO_OPTIONS, convertWindDegrees } from './../../util';
import Cookies from 'js-cookie';
import FeedbackModal from './FeedbackModal';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import Accordion from 'react-bootstrap/Accordion';
import MapModal from './MapModal';


function TrailDetail() {

    // eslint-disable-next-line
    const [navigate, auth, setAuth, admin, setAdmin] = useOutletContext();
    
    const params = useParams();

    const [state, setState] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [imageList, setImageList] = useState(false);

    const handleOpenFeedback = () => { setShowFeedback(true) };
    const handleOpenLogin = () => { setShowLogin(true) };
    const handleOpenMap = () => { setShowMap(true) };


    ////////////////////////////////////////////////////LOAD TRAIL

    const getImages = async (id) => {

        const options = {
            method: 'GET',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
        };

        const response = await fetch(`/api/v1/trails/photos/trailId/${id}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const data = await response.json();

        setImageList(data);
    };


    useEffect(() => {

        const getTrail = async () => {
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
            const trail = await response.json();

            setState(trail);

            if (trail) {
                getImages(trail.id);
            }
        };
        getTrail();

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

    if (typeof(state.weather) != typeof('string')) {
        weatherHtml = state.weather.daily
            .map((day, index) =>
                <div key={index} className='scroll-squares'>
                <h4>{day.dt.slice(5,10)}</h4>
                <p>{day.temp.day.toFixed(0)} F</p>
                    <p>{day.wind_speed.toFixed(0)} {convertWindDegrees(day.wind_deg)}</p>
                <p>{day.weather[0].description}</p>
            </div>)
    } 

    if (typeof (state.weather) === typeof ('string')) {
        console.log(state.weather);
    }
    
    let feedbackHtml;

    if (Object.values(state).includes(true)) {
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
        if (data.length > 0) {
            return data;
        } else {
            return null;
        }
    }

    let imageHtml;
    if (imageList) {
        imageHtml = imageList.map((image) => <div className='image-wrapper' key={image.id}>
            <img src={image.image} alt='trail' />
        </div>);
    }

    const radioFeedbackHtml = printRadioFeedback();
    
    return (
        <div className='trail'>
            <h2>{state.name}</h2>
            <div className='trail-buttons'>
            <button className='trail-list-button' type='button' onClick={handleOpenMap}>Trail Map</button>
                {auth && <Link className='trail-list-button'
                    to={`/plan/${state.id}`}
                >
                    Plan a trip to {state.name}
                </Link>}
                {!auth && <button className='trail-list-button'
                    type='button' onClick={handleOpenLogin}
                >
                    Plan a trip to {state.name}
                </button>}
            </div>
            <div className='horizontal-scroll-wrapper'>
                {imageHtml}
            </div>
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
                </ul>
                    <h3 className='park-name-detail'>
                    {state.park.name}
                    </h3>
                <ul>
                <li>
                    <h3>
                        Address
                    </h3>
                    {state.park.address}
                </li>
                {state.park.fee &&
                    <li className='whitespace'>
                    <h3>
                        Fees
                    </h3>
                    {state.park.fee.replaceAll(';', '\n')}
                    </li>
                }
                {state.park.hours && <li className='whitespace'>
                    <h3>
                        Hours
                    </h3>
                    {state.park.hours.replaceAll(';', '\n')}
                </li>
                }
            </ul>
            <Accordion className='stone'>
                <Accordion.Header className='stone'>Trail Description</Accordion.Header>
                <Accordion.Body>
                    {state.description}
                </Accordion.Body>
            </Accordion>
            {(feedbackHtml || radioFeedbackHtml) &&
                <h3>Other hikers say this trail...</h3>
            }
            {(feedbackHtml || radioFeedbackHtml) &&
                < div className='feedback-wrapper'>
            {feedbackHtml && feedbackHtml}
            {radioFeedbackHtml && radioFeedbackHtml}
                </div>
            }
            <div className='weather'>
                <h3>Weather</h3>
            <div className='horizontal-scroll-wrapper'>
                {weatherHtml}
                </div>
            </div>

            {auth && <div className='feedback-prompt-wrapper'>
                <div className='question-wrapper'><h3>Have you hiked this trail?</h3></div>
                <button
                    type='button' className='feedback-prompt' onClick={handleOpenFeedback}
                >Let us know how it was!</button>
            </div>}
            <MapModal latitude={state.park.latitude} longitude={state.park.longitude} show={showMap} setShow={setShowMap}/>
            <FeedbackModal id={state.id} show={showFeedback} setShow={setShowFeedback} />
            <LoginModal trailId={state.id} show={showLogin} setShow={setShowLogin} navigate={navigate} setAuth={setAuth} setAdmin={setAdmin} setShowRegister={setShowRegister} />
            <RegisterModal trailId={state.id} show={showRegister} setShow={setShowRegister} navigate={navigate} setAuth={setAuth} setShowLogin={setShowLogin}/>
        </div>
    )
}

export default TrailDetail