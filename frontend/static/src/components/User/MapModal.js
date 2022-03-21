import {
    MapContainer,
    TileLayer,
    Marker
} from 'react-leaflet';
import Modal from 'react-bootstrap/Modal';
import html2canvas from 'html2canvas';

function Map({latitude, longitude, show, setShow }) {

    const handleClose = () => { setShow(false) };
    

    const downloadMap = async (e) => {
        e.preventDefault();
        const canvas = await html2canvas(document.querySelector("#capture"), { useCORS: true });
        const url = canvas.toDataURL();
       
        function download(url) {
            let link = document.createElement('a');
            link.href = url
            link.download = 'map.png'

            console.log(link);

            document.body.appendChild(link);

            link.click();
            
            document.body.removeChild(link);

        }

        download(url);

    }

    const popupHtml =
        <Marker position={[latitude, longitude]}></Marker>

    return (

        <Modal dialogClassName="modal-90w" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <button id='download-link' className='download-button' onClick={(e) => downloadMap(e)}>
                    Download Map
                </button>
            </Modal.Header>
            <Modal.Body id='capture'>
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