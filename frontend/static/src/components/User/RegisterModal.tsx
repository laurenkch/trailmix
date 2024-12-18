import { handleError, handleInput } from "../../util";
import Cookies from "js-cookie";
import { ChangeEvent, Dispatch, FormEvent, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import React from "react";
import { NavigateFunction } from "react-router";

function RegisterModal({
  trailId,
  show,
  setShow,
  setAuth,
  navigate,
  setShowLogin,
}: {
  trailId: Maybe<string>;
  show: boolean;
  setShow: Dispatch<boolean>;
  setAuth: Dispatch<boolean>;
  navigate: NavigateFunction;
  setShowLogin: Dispatch<boolean>;
}) {
  const INITIAL_STATE = {
    username: "",
    email: "",
    password1: "",
    password2: "",
  };

  const [state, setState] = useState(INITIAL_STATE);

  const handleClose = () => {
    setShow(false);
  };

  const switchView = () => {
    setShow(false);
    setShowLogin(true);
  };

  const [errors, setErrors] = useState({
    email: false,
    password1: false,
    password2: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.password1 === state.password2) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken")!,
        },
        body: JSON.stringify(state),
      };

      const response = await fetch("/rest-auth/registration/", options).catch(
        handleError,
      );

      if (!response?.ok) {
        const message = await response?.json();
        for (const [key, value] of Object.entries(message)) {
          setErrors((prevState) => ({
            ...prevState,
            [key]: (value as string[])[0],
          }));
        }
      } else {
        const data = await response.json();
        Cookies.set("Authorization", `Token ${data.key}`);
        setAuth(true);
        navigate(`/plan/${trailId}`);
      }
    } else {
      alert("passwords must match");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>Create an account</Modal.Header>
      <Modal.Body>
        <Form className="modal-form" onSubmit={handleSubmit}>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            id="username"
            required
            autoComplete="off"
            name="username"
            value={state.username}
            onChange={(e) =>
              handleInput(
                e as unknown as ChangeEvent<HTMLInputElement>,
                setState,
              )
            }
          />
          <Form.Label htmlFor="email">Email</Form.Label>
          {errors.email && <div className="error-label">{errors.email}</div>}
          <Form.Control
            className={errors.email ? "error" : ""}
            id="email"
            required
            name="email"
            value={state.email}
            onChange={(e) =>
              handleInput(
                e as unknown as ChangeEvent<HTMLInputElement>,
                setState,
              )
            }
          />
          <Form.Label htmlFor="password1">Password</Form.Label>
          {errors.password1 && (
            <div className="error-label">{errors.password1}</div>
          )}
          <Form.Control
            className={errors.password1 ? "error" : ""}
            id="password1"
            required
            autoComplete="off"
            name="password1"
            value={state.password1}
            onChange={(e) =>
              handleInput(
                e as unknown as ChangeEvent<HTMLInputElement>,
                setState,
              )
            }
            type="password"
          />
          <Form.Label htmlFor="password2">Password</Form.Label>
          {errors.password2 && (
            <div className="error-label">{errors.password2}</div>
          )}
          <Form.Control
            className={errors.password2 ? "error" : ""}
            id="password2"
            required
            autoComplete="off"
            name="password2"
            value={state.password2}
            onChange={(e) =>
              handleInput(
                e as unknown as ChangeEvent<HTMLInputElement>,
                setState,
              )
            }
            type="password"
          />
          <button className="trail-list-button form-submit" type="submit">
            Register
          </button>
        </Form>
      </Modal.Body>
      <button
        type="button"
        value="login"
        onClick={() => switchView()}
        className="verification-redirect-modal"
      >
        Login to exisiting account
      </button>
    </Modal>
  );
}

export default RegisterModal;
