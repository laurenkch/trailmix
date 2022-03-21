import {
    MapContainer,
    TileLayer,
    Marker
} from 'react-leaflet';
import Modal from 'react-bootstrap/Modal';

function Map({ latitude, longitude, show, setShow }) {

    const handleClose = () => { setShow(false) };

    const popupHtml =
        <Marker position={[latitude, longitude]}></Marker>

    return (

        <Modal dialogClassName="modal-90w" show={show} onHide={handleClose}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <MapContainer center={[latitude, longitude]} zoom={14}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {popupHtml}
                </MapContainer>
            </Modal.Body>
            <button className='close-modal' type='button' onClick={handleClose}>Close</button>

        </Modal >
    )
}
export default Map