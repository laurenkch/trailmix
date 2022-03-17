import Form from 'react-bootstrap/Form'
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { handleError, handleInput } from './../util';
import Cookies from 'js-cookie';

function Register() {

    // eslint-disable-next-line
    const [navigate, auth, setAuth, admin, setAdmin] = useOutletContext();

        const INITIAL_STATE = {
            username: '',
            email: '',
            password1: '',
            password2: '',
        }

    const [state, setState] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({
        email: false,
        password1: false,
        password2: false,
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (state.password1 === state.password2) {

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify(state),
            };

            const response = await fetch("/rest-auth/registration/", options).catch(
                handleError
            );

            if (!response.ok) {
                const message = await response.json();
                for (const [key, value] of Object.entries(message)) {
                    setErrors((prevState) => ({ ...prevState, [key]: value[0] }));
                }
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                Cookies.set("Authorization", `Token ${data.key}`);
                setAuth(true);
                navigate('/');
            }
        } else {
            alert('passwords must match');
        }
    };

        return (
            <div className='wrapper'>
                <Form className='form-styles' onSubmit={handleSubmit}>
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
                    <Form.Label htmlFor='email'>
                        Email
                    </Form.Label>
                    {errors.email && <div className='error-label'>{ errors.email}</div>}
                    <Form.Control
                        className={errors.email ? "error" : ""}
                        id='email'
                        required
                        name='email'
                        value={state.email}
                        onChange={(e) => handleInput(e, setState)}
                    />
                    <Form.Label htmlFor='password1'>
                        Password
                    </Form.Label>
                    {errors.password1 && <div className='error-label'>{errors.password1}</div>}
                    <Form.Control
                        className={errors.password1 ? "error" : ""}
                        id='password1'
                        required
                        autoComplete="off"
                        name='password1'
                        value={state.password1}
                        onChange={(e) => handleInput(e, setState)}
                        type='password'
                    />
                    <Form.Label htmlFor='password2'>
                        Password
                    </Form.Label>
                    {errors.password2 && <div className='error-label'>{errors.password2}</div>}
                    <Form.Control
                        className={errors.password2 ? "error" : ""}
                        id='password2'
                        required
                        autoComplete="off"
                        name='password2'
                        value={state.password2}
                        onChange={(e) => handleInput(e, setState)}
                        type='password'
                        
                    />
                    <div className='button-wrapper'>
                        <button className='submit-button invert-color' type='submit'>Register</button>
                    </div>
                </Form>

                <div className='button-wrapper'>
                    <button type="button" value="login" onClick={() => navigate('login/')} className="verification-redirect">Login to exisiting account</button>
                </div>
            </div>
        )
    }

export default Register