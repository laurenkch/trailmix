import NewTrailForm from './NewTrailForm';
import { useEffect, useState } from 'react';
import { handleError } from './../util';


function Admin() {

    const [parks, setParks] = useState(null);

    useEffect(() => {
        const getParkList = async () => {

            const response = await fetch('/api/v1/trails/admin/parks/').catch(handleError);
            if (!response.ok) {
                throw new Error('Network response not ok');
            } else {
                const data = await response.json();
                setParks(data);
            }
        }
        getParkList();
    }, [])

    return (
        <div>
            <NewTrailForm parks={parks} setParks={setParks}/>

        </div>
    )
}

export default Admin