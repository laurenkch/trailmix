import Form from "react-bootstrap/Form";
import React, { ChangeEvent } from "react";

function ImageForm({
  previewImage,
}: {
  previewImage: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Form.Label htmlFor="image">Upload image</Form.Label>
      <Form.Control
        type="file"
        name="image"
        id="image"
        onChange={previewImage}
      />
    </div>
  );
}

export default ImageForm;
