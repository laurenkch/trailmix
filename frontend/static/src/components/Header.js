import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { handleError } from './utility';

function Header() {

    const handleLogout = async e => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        };

        const response = await fetch("/rest-auth/logout/", options).catch(
            handleError
        );

        if (!response.ok) {
            throw new Error("Network response not ok");
        } else {
            Cookies.remove("Authorization");
            //         setAuth(false);
            //         setSuperUser(false);
            //     }
            //     navigate('/');
            // }
        }

            return (
                <div>header</div>
            )
        }
    



        export default Header;