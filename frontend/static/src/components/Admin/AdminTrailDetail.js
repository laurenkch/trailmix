import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from 'react';
import { handleError, handleInput, TRAIL_TYPES } from './../../util';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';
import ImageForm from './../ImageForm';

function AdminTrailDetail() {
    const params = useParams();
    const navigate = useNavigate();

    // eslint-disable-next-line
    const [parks, setParks, trails, setTrails] = useOutletContext();

    const [state, setState] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [imagelist, setImageList] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isAddingImage, setIsAddingImage] = useState(null);

        const getParkList = async () => {

            const response = await fetch('/api/v1/trails/admin/parks/').catch(handleError);
            if (!response.ok) {
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                setParks(data);
            }
        }
    
    if (!parks) {
        getParkList();
    }

    const getImages = async (trail) => {

        const options = {
            method: 'GET',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
        };

        const response = await fetch(`/api/v1/trails/photos/trailId/${trail.id}/`, options).catch(handleError);

        console.log(response);

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

            const response = await fetch(`/api/v1/trails/edit/${params.trailId}/`, options).catch(handleError);

            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            const trail = await response.json();

            setState(trail);

            if (trail) {
                getImages(trail);
            }
        };
        getTrail();

    }, [params.trailId]);

    const editTrail = async (e) => {  

        e.preventDefault();

        const options = {
            method: 'PUT',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state),
        };

        const response = await fetch(`/api/v1/trails/edit/${state.id}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        // const park = await response.json();

        if (image) {

            const formData = new FormData();
            formData.append('trail', state.id)
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

        setIsEditing(false);

    };

    const deleteTrail = async (e) => {
        e.preventDefault();

        const options = {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }

        const response = await fetch(`/api/v1/trails/edit/park/${state.id}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        // const park = await response.json();

        setIsEditing(false);
        navigate('/administrator')
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

    if (!state||!parks||!imagelist) {
        return 'Loading...'
    };

    console.log(imagelist);

    const imageHTML = imagelist.map((image) => (
        <img src={image.image} alt='trail' key={image.id} />
    ));

    ////////////////////////////////////////////EDITING PARK ASSOCIATED WITH TRIAL

        // const handleSelect = (e) => {
    //     setState((prevState) => ({
    //         ...prevState,
    //         park: e.target.value,
    //     }))
    // };
    
    // at the moment, I'm skipping this as it would require more serializer steps to make work. 

    // console.log(parks);
    // console.log(state.park);
    // parks.forEach((park) => (console.log(park.name)));
    // parks.forEach((park) => (console.log(park.name === state.park)));
    // const parkOptionsHTML = parks
    //     .map((park) => (park.name === state.park ?
    //         <option key={park.id} value={park.id}>{park.name}</option> : <option key={park.id} value={park.id}>{park.name}</option>)
    //     );

    return (
        <div> 
            {isEditing &&
                <div>
                    <Form onSubmit={editTrail}>
                        {/* <select id="park" className="park-input" onChange={handleSelect}>
                            {parkOptionsHTML}
                        </select> */}
                        <Form.Label htmlFor="trail name">Trail Name</Form.Label>
                        <Form.Control
                            id='trail name'
                            type='text'
                            name='name'
                            autoComplete='off'
                            required
                            value={state.name}
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
            }
            {!isEditing &&
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
                    <button type='button' onClick={() => setIsEditing(true)}>Edit Trail</button>
                    <button type='button' onClick={deleteTrail}>Delete Trail</button>
                    {imageHTML}
                </div>
            }
        </div>
    )
};

export default AdminTrailDetail;