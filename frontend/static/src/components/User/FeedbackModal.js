import { handleError, FEEDBACK_CHECKBOX_OPTIONS, RADIO_OPTIONS } from './../../util';
import Cookies from 'js-cookie';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function FeedbackModal({ id, show, setShow }) {

    const handleClose = () => { setShow(false) };

    const INITIAL_FEEDBACK = FEEDBACK_CHECKBOX_OPTIONS.reduce((prevValue, currentValue) => (
        { ...prevValue, [currentValue]: false })
        , {});


    const radioKey = Object.keys(RADIO_OPTIONS);
    const radioValues = Object.values(RADIO_OPTIONS);

    const INITIAL_RADIO_OPTIONS = radioKey.reduce((prevValue, currentValue) => (
        { ...prevValue, [currentValue]: '' })
        , {});

    const [checkedState, setCheckedState] = useState(INITIAL_FEEDBACK);
    const [radioState, setRadioState] = useState(INITIAL_RADIO_OPTIONS);

    // ////////////////////////////////////////////////HANDLE FORM INPUT
    
    const handleFeedback = (e) => {
        const key = e.target.name
        const value = e.target.checked
        setCheckedState((prevState) => (
            { ...prevState, [key]: value }
        )

        )
    }
    const handleRadioInput = (e) => {
        const { name, value } = e.target

        setRadioState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // //////////////////////////////////////////////// SUBMIT INPUT

    const submitFeedback = async (e) => {
        e.preventDefault();

        const submit = { ...radioState, ...checkedState, 'trail': id };

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

        handleClose();

    }

    // ////////////////////////////////////////////////CREATE MODAL HTML


    const checkboxHtml = FEEDBACK_CHECKBOX_OPTIONS.map((option, index) => {
        let displayValue = option.replaceAll('_', ' ')
        return (
            <div className='checkbox' key={index} >
                <input onClick={handleFeedback} type="checkbox" id={option} name={option} checked={checkedState.option} />
                <label htmlFor={option}>{displayValue}</label>
            </div>
        );
});

    const printButtons = (obj, index) => {

        let data = [];

        for (const [key, value] of Object.entries(obj)) {
            let button = <div className='set' key={key}>
                <label htmlFor={value}>{value}</label>
                <input type='radio' name={radioKey[index]} value={key} id={value} onChange={handleRadioInput} />
            </div>
            data.push(button);
        }

        return data;
    }

    const radioHtml = radioValues.map((obj, index) => (
        <div className='radio-buttons' key={index}>
            {printButtons(obj, index)}
        </div>
    ));

    return(

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>Select any that apply</Modal.Header>
        <Modal.Body>
            <Form onSubmit={submitFeedback}>
                    <div className='checkboxes'>
                        {checkboxHtml}
                    </div>
                    {radioHtml}
                <button className='feedback-button' type='submit'>Submit</button>
            </Form>
        </Modal.Body>
        <button className='close-modal' type='button' onClick={handleClose}>Close</button>

        </Modal>
    )

};

export default FeedbackModal;