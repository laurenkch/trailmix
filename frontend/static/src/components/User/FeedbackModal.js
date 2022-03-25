import { handleError, FEEDBACK_CHECKBOX_OPTIONS, RADIO_OPTIONS } from './../../util';
import Cookies from 'js-cookie';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ImageForm from './../ImageForm';

function FeedbackModal({ id, show, setShow }) {

    const handleClose = () => { setShow(false) };
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

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

    ///////////////////////////////////////////////// HANDLE IMAGE FILE


    const previewImage = e => {
        const file = e.target.files[0];
        setImage(file)

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

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

        if (image && response) {

            const formData = new FormData();
            formData.append('trail', id)
            formData.append('image', image);

            const options2 = {
                method: 'POST',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: formData,
            }

            const response2 = await fetch('/api/v1/trails/photos/', options2).catch(handleError);

            if (!response2.ok) {
                throw new Error("Network response not ok");
            }

            setPreview(null);
            setImage(null);
        }
        handleClose();
    }


    // ////////////////////////////////////////////////CREATE MODAL HTML


    const checkboxHtml = FEEDBACK_CHECKBOX_OPTIONS.map((option, index) => {
        let displayValue = option.replaceAll('_', ' ')
        return (
            <div className='checkbox' key={index} >
                <input onClick={handleFeedback} className='checkbox' type="checkbox" id={option} name={option} checked={checkedState.option} />
                <label htmlFor={option}>{displayValue}</label>
            </div>
        );
    });

    const printButtons = (obj, index) => {

        let data = [];

        for (const [key, value] of Object.entries(obj)) {
            let button = <div className='set' key={key}>
                <input type='radio' name={radioKey[index]} value={key} id={value} onChange={handleRadioInput} />
                <label htmlFor={value}>{value}</label>
            </div>
            data.push(button);
        }

        return data;
    }

    function formatRadioHeader(title) {
        if (title === 'pet_stance') {
            return 'Pets'
        } else {
            let formattedTitle = title[0].toUpperCase() + title.slice(1);
            return formattedTitle.replace('_', ' ')
        }
    }

    const radioHtml = radioValues.map((obj, index) => (
        <div className='set-wrapper' key={index}>
            <h3>{formatRadioHeader(radioKey[index])}</h3>
            <div className='radio-buttons'>
                {printButtons(obj, index)}
            </div>
        </div>
    ));

    return (

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <p>Any feedback or photos you'd like to provide helps other hikers know what to expect.</p>
                <Form onSubmit={submitFeedback}>
                    <h2>Select any that apply</h2>
                    <div className='checkboxes'>
                        {checkboxHtml}
                    </div>
                    {radioHtml}
                    <h3 className=''>Share a photo of the trail</h3>
                    <div className='feedback-form-image-input'>
                        <ImageForm
                            previewImage={previewImage}
                        />
                    </div>
                    {preview && <div className='image-wrapper'><img src={preview} alt='preview' /></div>}
                    <button className='feedback-button' type='submit'>Submit</button>
                </Form>
            </Modal.Body>

            <button className='close-modal' type='button' onClick={handleClose}>Close</button>

        </Modal>
    )

};

export default FeedbackModal