import Form from 'react-bootstrap/Form'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import handleError from './../utils';
import Cookies from 'js-cookie';

function Register() {

        const INITIAL_STATE = {
            username: '',
            email: '',
            password1: '',
            password2: '',
        }

    const [state, setState] = useState(INITIAL_STATE)
    
    const handleInput = (e) => {

        const { name, value } = e.target
        setState((prevState) => (
            {
                ...prevState,
                [name]: value,
            })

        )
    }

    const handleSubmit = (e) => {
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
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                Cookies.set("Authorization", `Token ${data.key}`);
                // setAuth(true);
                // navigate('/');
            }
        } else {
            alert('passwords must match');
        }
    }
    }


        return (
            <div>
                <Form>
                    <Form.Label hmtlFor='username'>
                        Username
                    </Form.Label>
                    <Form.Control
                        id='username'
                        required
                        autoComplete="off"
                        name='username'
                        value={state.username}
                        onChange={handleInput}
                    />
                    <Form.Label hmtlFor='email'>
                        Email
                    </Form.Label>
                    <Form.Control
                        id='email'
                        required
                        name='email'
                        value={state.email}
                        onChange={handleInput}
                    />
                    <Form.Label hmtlFor='password'>
                        Password
                    </Form.Label>
                    <Form.Control
                        id='password'
                        required
                        autoComplete="off"
                        name='password1'
                        value={state.password1}
                        onChange={handleInput}
                    />
                    <Form.Label hmtlFor='password'>
                        Password
                    </Form.Label>
                    <Form.Control
                        id='password'
                        required
                        autoComplete="off"
                        name='password2'
                        value={state.password2}
                        onChange={handleInput}
                        
                    />
                    <button type='submit'>Sign in</button>
                </Form>

                <Link >Login to existing account</Link>
            </div>
        )
    }

export default Register