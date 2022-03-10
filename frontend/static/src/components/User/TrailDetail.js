import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleError, TRAIL_TYPES, TRAIL_FEEDBACK } from './../../util';
import Cookies from 'js-cookie';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function TrailDetail() {

    const params = useParams();

    const [state, setState] = useState(null);
    const [modalShow, setModalShow] = useState(false);


    const INITIAL_FEEDBACK = TRAIL_FEEDBACK.reduce((prevValue, currentValue) => (
        { ...prevValue, [currentValue]: false })
    , {});

    const [checkedState, setCheckedState] = useState(INITIAL_FEEDBACK);
    const [difficulty, setDifficulty] = useState(null);

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

    const handleFeedback = (e) => {
        const key = e.target.name
        const value= e.target.checked
        setCheckedState((prevState) => (
            { ...prevState, [key]: value}
        )
        
        )
    }

    const feedbackHtml = TRAIL_FEEDBACK.map((option,index) => (
        <div key={index} >
            <input onClick={handleFeedback} type="checkbox" id={option} name={option} checked={checkedState.option}/>
            <label htmlFor={option}>{option}</label>
        </div>
    ));

    const difficultyOptions = [1,2,3,4,5,6,7,8,9,10]
    
    const difficultyHtml = difficultyOptions.map((slot) => (
        <Button key={slot} type='button' value={slot} onClick={(e)=>setDifficulty(e.target.value)}>{slot}</Button>
    ));

    const submitFeedback = async (e) => {
        e.preventDefault();

        const submit = { ...checkedState, 'difficulty': difficulty, 'trail': state.id };
        console.log(submit);

        const options = {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submit),
        }

        const response = await fetch('/api/v1/trails/feedback/', options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        setModalShow(false);

    }

    return (
        <div>
            <h2>{state.name}</h2>
            <ul>
                <li>{state.elevation_gain}ft</li>
                <li>{state.length}miles</li>
                <li>{TRAIL_TYPES[state.trail_type]}</li>
                <li>{state.description}</li>
                <li>{state.park.name}</li>
                <li>{state.park.address}</li>
                <li>{state.park.fee}</li>
                <li>{state.park.hours}</li>
            </ul>
            <button
                type='button' onClick={() => setModalShow(true)}
            >
                How was the hike?
            </button>
            <Modal show={modalShow}>
                <Modal.Header closeButton>Select any that apply</Modal.Header>
                <Modal.Body>
                <Form onSubmit={submitFeedback}>
                    {feedbackHtml}
                        Difficulty Level:
                    <ButtonGroup>
                            {difficultyHtml}
                    </ButtonGroup>
                    <button type='submit'>Submit</button>
                </Form> 
                </Modal.Body>
                


                <button type='button' onClick={() => setModalShow(false)}>Close</button>

            </Modal>
        </div>
    )
}

export default TrailDetail