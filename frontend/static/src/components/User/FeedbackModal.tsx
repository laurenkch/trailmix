import { handleError } from "../../util";
import Cookies from "js-cookie";
import { Dispatch, useState, ChangeEvent } from "react";
import Modal from "react-bootstrap/Modal";

import Form from "react-bootstrap/Form";
import ImageForm from "../ImageForm";
import React from "react";
import { FormEvent } from "react";
import { FEEDBACK_CHECKBOX_OPTIONS, RADIO_OPTIONS } from "../../constants";
import { toString } from "lodash";

function FeedbackModal({
  id,
  show,
  setShow,
}: {
  id: string;
  show: boolean;
  setShow: Dispatch<boolean>;
}) {
  const handleClose = () => {
    setShow(false);
  };
  const [image, setImage] = useState<Maybe<File>>(null);
  const [preview, setPreview] = useState<Maybe<string>>(null);

  const initialFeedback = FEEDBACK_CHECKBOX_OPTIONS.reduce(
    (prevValue, currentValue) => ({ ...prevValue, [currentValue]: false }),
    {},
  );

  const radioKey = Object.keys(RADIO_OPTIONS);
  const radioValues = Object.values(RADIO_OPTIONS);

  const initialRadioOptions = radioKey.reduce(
    (prevValue, currentValue) => ({ ...prevValue, [currentValue]: "" }),
    {},
  );

  const [checkedState, setCheckedState] =
    useState<Record<string, boolean>>(initialFeedback);
  const [radioState, setRadioState] = useState(initialRadioOptions);

  const handleFeedback = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target?.name;
    const value = e.target?.checked;
    setCheckedState((prevState) => ({ ...prevState, [key]: value }));
  };
  const handleRadioInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRadioState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const previewImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file!);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file!);
  };

  const submitFeedback = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = Cookies.get("csrftoken");

    const submit = { ...radioState, ...checkedState, trail: id };

    const options = {
      method: "POST",
      headers: {
        "X-CSRFToken": token!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submit),
    };

    const response = await fetch("/api/v1/trails/feedback/", options).catch(
      handleError,
    );

    if (!response?.ok) {
      throw new Error("Network response not ok");
    }

    if (image && response) {
      const formData = new FormData();
      formData.append("trail", toString(id));
      formData.append("image", image);

      const options2 = {
        method: "POST",
        headers: {
          "X-CSRFToken": token!,
        },
        body: formData,
      };

      const response2 = await fetch("/api/v1/trails/photos/", options2).catch(
        handleError,
      );

      if (!response2?.ok) {
        throw new Error("Network response not ok");
      }

      setPreview(null);
      setImage(null);
    }
    handleClose();
  };

  const checkboxHtml = FEEDBACK_CHECKBOX_OPTIONS.map((option, index) => {
    let displayValue = option.replaceAll("_", " ");
    return (
      <div className="checkbox" key={index}>
        <input
          onClick={(e) =>
            handleFeedback(e as unknown as ChangeEvent<HTMLInputElement>)
          }
          className="checkbox"
          type="checkbox"
          id={option}
          name={option}
          checked={checkedState.option}
        />
        <label htmlFor={option}>{displayValue}</label>
      </div>
    );
  });

  const printButtons = (obj: Record<string, any>, index: number) => {
    let data = [];

    for (const [key, value] of Object.entries(obj)) {
      let button = (
        <div className="set" key={key}>
          <input
            type="radio"
            name={radioKey[index]}
            value={key}
            id={value}
            onChange={handleRadioInput}
          />
          <label htmlFor={value}>{value}</label>
        </div>
      );
      data.push(button);
    }

    return data;
  };

  function formatRadioHeader(title: string) {
    if (title === "pet_stance") {
      return "Pets";
    } else {
      let formattedTitle = title[0].toUpperCase() + title.slice(1);
      return formattedTitle.replace("_", " ");
    }
  }

  const radioHtml = radioValues.map((obj, index) => (
    <div className="set-wrapper" key={index}>
      <h3>{formatRadioHeader(radioKey[index])}</h3>
      <div className="radio-buttons">{printButtons(obj, index)}</div>
    </div>
  ));

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <p>
          Any feedback or photos you'd like to provide helps other hikers know
          what to expect.
        </p>
        <Form onSubmit={submitFeedback}>
          <h2>Select any that apply</h2>
          <div className="checkboxes">{checkboxHtml}</div>
          {radioHtml}
          <h3 className="">Share a photo of the trail</h3>
          <div className="feedback-form-image-input">
            <ImageForm previewImage={previewImage} />
          </div>
          {preview && (
            <div className="image-wrapper">
              <img src={preview} alt="preview" />
            </div>
          )}
          <button className="feedback-button" type="submit">
            Submit
          </button>
        </Form>
      </Modal.Body>

      <button className="close-modal" type="button" onClick={handleClose}>
        Close
      </button>
    </Modal>
  );
}

export default FeedbackModal;
