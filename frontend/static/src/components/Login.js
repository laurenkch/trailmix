import Form from 'react-bootstrap/Form'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import handleError from './../utils';

function Login() {
    
    const INITIAL_STATE = {
        username: '',
        password: '',

    }

    const [state, setState] = useState(INITIAL_STATE);

    const handleInput = (e) => {

        const {name, value} = e.target
        setState((prevState) => (
            {...prevState, 
            [name]:value,
        })

        )
    }

    const handleSubmit = (e) => {
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
            throw new Error("Network response not ok");
        } else {
            const data = await response.json();
            Cookies.set("Authorization", `Token ${data.key}`);
        //     if (data.is_superuser) {
        //         setSuperUser(true);
        //     }
        //     setAuth(true);

        // }
        // navigate('/');
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
                <Form.Label hmtlFor='password'>
                    Password
                </Form.Label>
                <Form.Control
                    id='password'
                    required
                    autoComplete="off"
                    name='password'
                    value={state.password}
                    onChange={handleInput}
                />
                <button type='submit'>Sign in</button>
            </Form>

            <Link >Register account</Link>
        </div>
    )
}

export default Login