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

    ///////////////////////////////////////////////// DATA FETCHING

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

    ///////////////////////////////////////////////// EDIT TRAIL

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

///////////////////////////////////////////////// DELETE TRAIL

    const deleteTrail = async (e) => {

        e.preventDefault();

        const options = {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }

        const response = await fetch(`/api/v1/trails/edit/${state.id}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        setIsEditing(false);

        // eslint-disable-next-line
        const newTrailList = trails.filter((trail) => (trail.id != state.id));

        setTrails(newTrailList);
        navigate('/administrator')
    };

    ///////////////////////////////////////////////////ADD IMAGE

    const addImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('trail', state.id)
        formData.append('image', image);

        const options = {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: formData,
        }

        const response = await fetch('/api/v1/trails/photos/', options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const data = await response.json();
    
        setImageList((prevlist) => [...prevlist, data])

    setPreview(null);
    setIsAddingImage(false);
    setImage(null);
    }

///////////////////////////////////////////////// DELETE IMAGE
    
    const deleteImage = async e => {
        e.preventDefault();

        const options = {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }

        const response = await fetch(`/api/v1/trails/photos/${e.target.value}/`, options).catch(handleError);

        if (!response.ok) {
            throw new Error("Network response not ok");
        }

        // eslint-disable-next-line
        const newImageList = imagelist.filter((image)=> image.id != e.target.value)
        setImageList(newImageList)
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

///////////////////////////////////////////////// DISPLAY LOGIC

    if (!state||!parks||!imagelist) {
        return 'Loading...'
    };

    const imageHTML = imagelist.map((image) => (
        <div key={image.id}>
            <div className='image-wrapper'>
                <img src={image.image} alt='trail' />
            </div>
            <button type='button' className='trail-list-button'  value={image.id} onClick={deleteImage}>Delete Image</button>
        </div>
    ));

    ////////////////////////////////////////////EDITING PARK ASSOCIATED WITH TRIAL

    // at the moment, I'm skipping this as it would require more serializer steps to make work. 

    // const handleSelect = (e) => {
    //     setState((prevState) => ({
    //         ...prevState,
    //         park: e.target.value,
    //     }))
    // };

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
                        <Form.Label htmlFor='trail type'>Trail Type</Form.Label>
                        <select className='trail-type form-control' id="trail-type" value={state.trail_type} name="trail_type" onChange={((e) => setState((prevState) => ({
                            ...prevState,
                            trail_type: e.target.value,
                        })))}>
                            <option defaultValue>--</option>
                            <option value="oab">Out and Back</option>
                            <option value="loop">Loop</option>
                            <option value="seg">Point to point segment</option>
                        </select>
                        <button className='trail-list-button' type='submit'>Save</button>
                    </Form>
                </div>
            }
            {!isEditing &&
                <div>
                    <h2>{state.name}</h2>
                    <button className='trail-list-button' type='button' onClick={() => setIsEditing(true)}>Edit Trail</button>
                    {!isAddingImage &&
                        <button className='trail-list-button' type='button' onClick={() => setIsAddingImage(true)}>Add Image
                        </button>
                    }
                    {isAddingImage &&
                        <Form onSubmit={addImage}>
                        <ImageForm
                            previewImage={previewImage}
                        
                            />
                            <button className='trail-list-button' type='submit'>Save</button>
                        </Form>
                    }
                    {preview && isAddingImage && <div className='image-wrapper'><img src={preview} alt='preview' /></div>}
                    <ul className='whitespace'>
                        <li className='park-attributes'>
                            <h3>
                                Elevation Gain
                            </h3>
                            <div>
                                {state.elevation_gain}ft
                            </div>
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
                    <button className='trail-list-button'  type='button' onClick={deleteTrail}>Delete Trail</button>
                    {imageHTML}
                </div>
            }
        </div>
    )
};

export default AdminTrailDetail;