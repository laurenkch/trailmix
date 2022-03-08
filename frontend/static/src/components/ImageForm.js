import Form from 'react-bootstrap/Form'

function ImageForm({ previewImage }) {

    return (
        <div>
            <Form.Label htmlFor='image'>Upload image</Form.Label>
            <Form.Control
                type='file'
                name='image'
                id='image'
                onChange={previewImage}
            />
        </div>
    )
}

export default ImageForm;