import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError, TRAIL_TYPES, DIFFICULTY_KEY } from './../../util';
import Cookies from 'js-cookie';
import FeedbackModal from './FeedbackModal';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

function TrailDetail() {

    // eslint-disable-next-line
    const [navigate, auth, setAuth, admin, setAdmin] = useOutletContext();
    
    const params = useParams();

    const [state, setState] = useState(null);
    const [show, setShow] = useState(false);

    const handleOpen = () => { setShow(true) };

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

    const difficultykeyHtml = DIFFICULTY_KEY.map((entry) =>
        <div key={entry.level}>
            {`${entry.level} : ${entry.description}`}
        </div>)

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            <div>
                Difficulty level is based on trail length and elevation gain. 
                {difficultykeyHtml}
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
                type='button' onClick={handleOpen}
            >
                How was the hike?
            </button>}
            {auth && <Link
                to={`/plan/${state.id}`}
            >
                Plan a trip to {state.name}
            </Link>}
            <FeedbackModal id={state.id} show={show} setShow={setShow}/>
        </div>
    )
}

export default TrailDetail