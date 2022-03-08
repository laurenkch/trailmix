import { useState } from 'react';
import { handleError, handleInput } from '../../util';
import Form from 'react-bootstrap/Form';
import Cookies from 'js-cookie';


function NewParkForm({ setParks, setIsAddingPark}) {

    const INITIAL_STATE = {
        park_name: '',
        latitude: '',
        longitude: '',
        fee: '',
        park_code: '',
        hours: '',
        activities: '',
        address: '',
    }

    const [state, setState] = useState(INITIAL_STATE)
    
    const addNewPark = async (e) => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state),
        }

        const response = await fetch('/api/v1/trails/admin/parks/', options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const submittedPark = await response.json()

        setParks((parks) => ([ ...parks, submittedPark]));
        setIsAddingPark(false);
    }

    return (
        <div>
            <Form onSubmit={addNewPark}>
                <Form.Label htmlFor='park name'>Park Name</Form.Label>
                <Form.Control
                    id='park name'
                    name='park_name'
                    type='text'
                    onChange={(e) => handleInput(e, setState)}
                    value={state.park_name}
                    required
                    autoComplete='off'
                />
                <Form.Label htmlFor='latitude'>Latitude</Form.Label>
                <Form.Control
                    id='latitude'
                    name='latitude'
                    type='text'
                    onChange={(e) => handleInput(e, setState)}
                    value={state.latitude}
                    required
                    autoComplete='off'
                />
                <Form.Label htmlFor='longitude'>Longitude</Form.Label>
                <Form.Control
                    id='longitude'
                    name='longitude'
                    type='text'
                    onChange={(e) => handleInput(e, setState)}
                    value={state.longitude}
                    required
                    autoComplete='off'
                />
                <Form.Label htmlFor='fee'>Fee</Form.Label>
                <Form.Control
                    id='fee'
                    name='fee'
                    type='text'
                    onChange={(e) => handleInput(e, setState)}
                    value={state.fee}
                    autoComplete='off'
                />
                <Form.Label htmlFor='park_code'>Park Code</Form.Label>
                <Form.Control
                    id='park code'
                    name='park_code'
                    type='text'
                    onChange={(e) => handleInput(e, setState)}
                    value={state.park_code}
                    autoComplete='off'
                />
                <Form.Label htmlFor='hours'>Hours</Form.Label>
                <Form.Control
                    id='hours'
                    name='hours'
                    type='text'
                    onChange={(e) => handleInput(e, setState)}
                    value={state.hours}
                    required
                    autoComplete='off'
                />
                <Form.Label htmlFor='Address'>Address</Form.Label>
                <Form.Control
                    id='Address'
                    name='address'
                    type='address'
                    onChange={(e) => handleInput(e, setState)}
                    value={state.address}
                    required
                    autoComplete='off'
                />
                <Form.Label htmlFor='Activities'>Activities</Form.Label>
                <Form.Control
                    id='Activities'
                    name='activities'
                    type='text'
                    onChange={(e) => handleInput(e, setState)}
                    value={state.activities}
                    autoComplete='off'
                />
                <button type='submit'>Add park</button>
            </Form>
        </div>
    )
}

export default NewParkForm