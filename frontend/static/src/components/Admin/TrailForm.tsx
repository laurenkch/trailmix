import ParkForm from "./ParkForm";
import ImageForm from "../ImageForm";

import Form from "react-bootstrap/Form";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Cookies from "js-cookie";
import { handleError, handleInput } from "../../util";
import React from "react";
import { Park } from "../../types";

function TrailForm() {
  const [parks, setParks] = useState<Park[]>([]);

  useEffect(() => {
    const getParkList = async () => {
      const response = await fetch("/api/v1/trails/admin/parks/").catch(
        handleError,
      );
      if (!response?.ok) {
        throw new Error("Network response not ok");
      } else {
        const data = await response.json();
        setParks(data);
      }
    };
    if (!parks) {
      getParkList();
    }
  }, [parks]);

  const INITIAL_STATE = {
    park: "",
    name: "",
    elevation_gain: "",
    length: 0,
    description: "",
    trail_type: "",
  };

  const [state, setState] = useState(INITIAL_STATE);
  const [isAddingPark, setIsAddingPark] = useState<boolean>(false);
  const [image, setImage] = useState<Maybe<Blob>>(null);
  const [preview, setPreview] = useState<Maybe<string>>(null);
  const [isAddingImage, setIsAddingImage] = useState<boolean>(false);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "newPark") {
      setIsAddingPark(true);
    } else {
      setState((prevState) => ({
        ...prevState,
        park: e.target.value,
      }));
    }
  };

  const submitTrail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    };

    const response = await fetch("/api/v1/trails/admin/", options).catch(
      handleError,
    );

    if (!response?.ok) {
      throw new Error("Network response not ok");
    }

    const submittedTrail = await response.json();

    if (image && response) {
      const formData = new FormData();
      formData.append("trail", submittedTrail.id);
      formData.append("image", image);

      const options2 = {
        method: "POST",
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken")!,
        },
        body: formData,
      };

      const response2 = await fetch("/api/v1/trails/photos/", options2).catch(
        handleError,
      );

      if (!response2?.ok) {
        throw new Error("Network response not ok");
      }
    }

    const trailTypeSelect = document.querySelector(".trail-type");

    if (trailTypeSelect) {
      // trailTypeSelect.querySelectorAll("option")[0].selected = "selected";
      trailTypeSelect.querySelectorAll("option")[0].selected = true;
    }

    const parkSelect = document.querySelector(".park-input");
    if (parkSelect) {
      // parkSelect.querySelectorAll("option")[0].selected = "selected";
      parkSelect.querySelectorAll("option")[0].selected = true;
    }

    setState(INITIAL_STATE);
    setPreview(null);
    setIsAddingImage(false);
    setImage(null);
  };

  const previewImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!parks) {
    return <div>Loading...</div>;
  }

  const parkOptionsHTML = parks.map((park) => (
    <option key={park.id} value={park.id}>
      {park.name}
    </option>
  ));

  return (
    <div>
      {isAddingPark && (
        <ParkForm setParks={setParks} setIsAddingPark={setIsAddingPark} />
      )}
      <Form onSubmit={submitTrail}>
        <select
          id="park"
          className="park-input form-control"
          onChange={handleSelect}
        >
          <option defaultValue="">Select a park...</option>
          {parkOptionsHTML}
          <option value="newPark">Add new park</option>
        </select>
        <Form.Label htmlFor="trail name">Trail Name</Form.Label>
        <Form.Control
          id="trail name"
          type="text"
          name="name"
          autoComplete="off"
          required
          value={state.name}
          onChange={(e) =>
            handleInput(e as unknown as ChangeEvent<HTMLInputElement>, setState)
          }
        />
        <Form.Label htmlFor="elevation gain">Elevation Gain</Form.Label>
        <Form.Control
          id="elevation gain"
          type="number"
          name="elevation_gain"
          autoComplete="off"
          value={state.elevation_gain}
          onChange={(e) =>
            handleInput(e as unknown as ChangeEvent<HTMLInputElement>, setState)
          }
        />
        <Form.Label htmlFor="length">Length</Form.Label>
        <Form.Control
          id="length"
          type="number"
          step="0.1"
          min="0"
          name="length"
          autoComplete="off"
          required
          value={state.length}
          onChange={(e) =>
            handleInput(e as unknown as ChangeEvent<HTMLInputElement>, setState)
          }
        />
        <Form.Label htmlFor="description">Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          id="description"
          name="description"
          autoComplete="off"
          value={state.description}
          onChange={(e) =>
            handleInput(e as unknown as ChangeEvent<HTMLInputElement>, setState)
          }
        />
        <Form.Label htmlFor="trail type">Trail Type</Form.Label>
        <select
          className="trail-type form-control"
          id="trail-type"
          name="trail_type"
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              trail_type: e.target.value,
            }))
          }
        >
          <option defaultValue="">--</option>
          <option value="oab">Out and Back</option>
          <option value="loop">Loop</option>
          <option value="seg">Point to point segment</option>
        </select>
        {!isAddingImage && (
          <button
            className="trail-list-button"
            type="button"
            onClick={() => setIsAddingImage(true)}
          >
            Add Image
          </button>
        )}
        {isAddingImage && <ImageForm previewImage={previewImage} />}
        {preview && isAddingImage && (
          <div className="preview">
            <img src={preview} alt="preview" />
          </div>
        )}
        <button className="trail-list-button" type="submit">
          Save
        </button>
      </Form>
    </div>
  );
}

export default TrailForm;
