import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {

    const [navigate, auth, setAuth, admin, setAdmin] = useOutletContext();

    useEffect(() => {


        if (admin) {
            navigate('/administrator')

        }
        
    }, [admin, navigate])

    return (
        <div>Home</div>
    )
}

export default Home