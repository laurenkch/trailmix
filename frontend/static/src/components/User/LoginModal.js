import { handleError, handleInput } from './../../util';
import Cookies from 'js-cookie';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function LoginModal({ trailId, show, setShow, setAdmin, setAuth, navigate, setShowRegister}) {

        const INITIAL_STATE = {
            username: '',
            password: '',

        }
    
    
    const [error, setError] = useState(false)

    const [state, setState] = useState(INITIAL_STATE);

    const handleClose = () => { setShow(false) };

    const switchView = () => {
        setShow(false);
        setShowRegister(true);
    }

    const handleSubmit = async (e) => {
            e.preventDefault();

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify(state),
            };

            const response = await fetch("/rest-auth/login/", options).catch(
                handleError
            );

        if (!response.ok) {
            const message = await response.json()
            if (message.non_field_errors) {
                setError(message.non_field_errors[0]);
            }
                throw new Error("Network response not ok");
            } else {
                const data = await response.json();
                Cookies.set("Authorization", `Token ${data.key}`);
                if (data.is_superuser) {
                    setAdmin(true);
                }
                setAuth(true);

            }
        navigate(`/plan/${trailId}`)
        }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                Login to save your trip details for later!
            </Modal.Header>
            <Modal.Body>
                {error && <div className='error-message'>{error}</div>}
            <Form className='modal-form' onSubmit={handleSubmit}>
                <Form.Label htmlFor='username'>
                    Username
                </Form.Label>
                <Form.Control
                    id='username'
                    required
                    autoComplete="off"
                    name='username'
                    value={state.username}
                    onChange={(e) => handleInput(e, setState)}
                />
                <Form.Label htmlFor='password'>
                    Password
                </Form.Label>
                <Form.Control
                    type='password'
                    id='password'
                    required
                    autoComplete="off"
                    name='password'
                    value={state.password}
                    onChange={(e) => handleInput(e, setState)}
                />
                <button className='trail-list-button form-submit' type='submit'>Sign in</button>
            </Form>
            </Modal.Body>

            <button type="button" value="registration" onClick={() => switchView()} className="verification-redirect">I need to make an account</button>
        </Modal>
    )
}

export default LoginModal