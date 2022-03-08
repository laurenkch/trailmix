import { useParams } from "react-router-dom";

function AdminParkDetail() {
    let params = useParams();
    console.log(params)

    return (
        <div> Park {params.parkId}</div>
    )
}

export default AdminParkDetail