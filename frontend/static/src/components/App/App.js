import { useState, useEffect } from 'react';
import Header from './../Header';
import Cookies from 'js-cookie';
import Login from './../Login';
import Register from './../Register';
import { Outlet, useNavigate, } from 'react-router-dom';
import { handleError } from './../../util';

function App() {

    const navigate = useNavigate()

    const [auth, setAuth] = useState(!!Cookies.get('Authorization'))
    const [admin, setAdmin] = useState(null);

    useEffect(() => {

        const getAdminStatus = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                }
            };
            const response = await fetch('rest-auth/user/', options).catch(handleError);
            if (!response.ok) {
                throw new Error("Network response not ok");
            } else {
                const data = await response.json();
                if (data.is_superuser) {
                    setAdmin(true);
                }
            }
        }

        if (auth) {
            getAdminStatus();
        }

    }, [auth]);

    return (

        <div className="App conatiner-fluid">



            <Header auth={auth} setAuth={setAuth} navigate={navigate} admin={admin} setAdmin={setAdmin} />
            <main>
                <Outlet context={[navigate, auth, setAuth, admin, setAdmin]} />
            </main>

        </div>
        
    )
}

export default App