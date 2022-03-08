import NewParkForm from './NewParkForm';
import ImageForm from './ImageForm';

import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { handleError, handleInput } from './../util';

function NewTrailForm({ parks, setParks }) {


    const INITIAL_STATE = {

        park: '',
        trail_name: '',
        elevation_gain: '',
        length: 0,
        description: '',
        trail_type: '',

    }

    const [state, setState] = useState(INITIAL_STATE);
    const [isAddingPark, setIsAddingPark] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isAddingImage, setIsAddingImage] = useState(null);

    const handleSelect = (e) => {
        if (e.target.value === 'newPark') {
            setIsAddingPark(true);
        } else {
            setState((prevState) => ({
                ...prevState,
                trail_type: e.target.value,
            }))
        }
    };

    // const trailTypeSelect = document.querySelector('.trail-type');
    // console.log(trailTypeSelect)

    const submitNewTrail = async (e) => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state),
        }

        const response = await fetch('/api/v1/trails/admin/', options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        const submittedTrail = await response.json()

        if (image && response) {

            const formData = new FormData();
            formData.append('trail', submittedTrail.id)
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

        }

        const trailTypeSelect = document.querySelector('.trail-type');
        trailTypeSelect.querySelectorAll('option')[0].selected = 'selected';

        const parkSelect = document.querySelector('.park-input');
        parkSelect.querySelectorAll('option')[0].selected = 'selected';

        setState(INITIAL_STATE);
        setPreview(null);
        setIsAddingImage(false);

    };


    const previewImage = e => {
        const file = e.target.files[0];
        setImage(file)

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    if (!parks) {
        return ('Loading...'
        )
    }

    const parkOptionsHTML = parks.map((park) => (<option key={park.id} value='park.id'>{park.park_name}</option>))



    return (
        <div>
            {isAddingPark && <NewParkForm setParks={setParks} setIsAddingPark={setIsAddingPark}/>}
            <Form onSubmit={submitNewTrail}>
                <select id="park" className="park-input" onChange={handleSelect}>
                    <option defaultValue>Select a park...</option>
                    {parkOptionsHTML}
                    <option value='newPark'>Add new park</option>
                </select>
                <Form.Label htmlFor="trail name">Trail Name</Form.Label>
                <Form.Control
                    id='trail name'
                    type='text'
                    name='trail_name'
                    autoComplete='off'
                    required
                    value={state.trail_name}
                    onChange={(e) => handleInput(e, setState)}
                />
                <Form.Label htmlFor="elevation gain">Elevation Gain</Form.Label>
                <Form.Control
                    id='elevation gain'
                    type='number'
                    min='0'
                    name='elevation_gain'
                    autoComplete='off'
                    value={state.elevation_gain}
                    onChange={(e) => handleInput(e, setState)}
                />
                <Form.Label htmlFor="length">Length</Form.Label>
                <Form.Control
                    id='length'
                    type='number'
                    step='0.1'
                    min='0'
                    name='length'
                    autoComplete='off'
                    required
                    value={state.length}
                    onChange={(e) => handleInput(e, setState)}
                />
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                    as='textarea'
                    rows={5}
                    id='description'
                    name='description'
                    autoComplete='off'
                    value={state.description}
                    onChange={(e) => handleInput(e, setState)}
                />
                <select className='trail-type' id="trail-type" name="trail_type" onChange={((e) => setState((prevState) => ({
                    ...prevState,
                    trail_type: e.target.value,
                })))}>
                    <option defaultValue>Trail Type</option>
                    <option value="oab">Out and Back</option>
                    <option value="loop">Loop</option>
                    <option value="seg">Point to point segment</option>
                </select>
                {!isAddingImage &&
                    <button type='button' onClick={() => setIsAddingImage(true)}>Add Image
                    </button>
                }
                {isAddingImage &&
                    <ImageForm
                    previewImage={previewImage}
                    
                />
                }
                {preview && isAddingImage && <div><img src={preview} alt='preview' /></div>}
                <button type='submit'>Save</button>
            </Form>
        </div>
    )
    
}

export default NewTrailForm;