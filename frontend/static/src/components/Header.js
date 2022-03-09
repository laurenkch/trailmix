import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { handleError } from './../util';

function Header({ auth, setAuth, navigate, admin, setAdmin }) {

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
                    setAuth(false);
                    setAdmin(false);
                }
                navigate('/');
            }

            return (
                <nav>
                    <ul>
                        <div className='nav-links'>
                            <li>
                                <NavLink className='btn toggle-btn' to='/'>Home</NavLink>
                            </li>
                            {/* {auth && !admin &&
                                <li>
                                    <NavLink className='btn toggle-btn' to='/profile'>
                                        Profile
                                    </NavLink>
                                </li>
                            } */}
                            {admin &&
                                <li>
                                    <NavLink className='btn toggle-btn' to='administrator/addtrail'>
                                        Add New Trail
                                    </NavLink>
                                </li>
                            }
                        </div>
                        <div className='login-logout-button'>
                            {auth ?
                                <li>
                                    <button type='button' className='btn toggle-btn' onClick={handleLogout} value={'logout'}>
                                        Logout
                                    </button>
                                </li> :
                                <li>
                                    <NavLink to='login'>Login</NavLink>
                                </li>
                            }
                        </div>
                    </ul>
                </nav>
            )
        }
    



        export default Header;