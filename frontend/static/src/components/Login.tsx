import Form from "react-bootstrap/Form";
import { ChangeEvent, FormEvent, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { handleError, handleInput } from "../util";
import Cookies from "js-cookie";
import React from "react";
import { OutletContext } from "./App/App";

function Login() {
  const { navigate, setAuth, setAdmin } = useOutletContext<OutletContext>();

  const INITIAL_STATE = {
    username: "",
    password: "",
  };

  const [state, setState] = useState(INITIAL_STATE);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")!,
      },
      body: JSON.stringify(state),
    };

    const response = await fetch("/rest-auth/login/", options).catch(
      handleError,
    );

    if (!response?.ok) {
      const message = await response?.json();
      if (message.non_field_errors) {
        setError(message.non_field_errors[0]);
      }
      throw new Error("Network response not ok");
    } else {
      const data = await response.json();
      Cookies.set("Authorization", `Token ${data.key}`);
      if (data.is_superuser) {
        setAdmin(true);
      }
      setAuth(true);
    }
    navigate("/");
  };

  return (
    <div className="wrapper form-wrapper">
      <Form className="form-styles" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          id="username"
          required
          autoComplete="off"
          name="username"
          value={state.username}
          onChange={(e) =>
            handleInput(e as unknown as ChangeEvent<HTMLInputElement>, setState)
          }
        />
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          id="password"
          required
          autoComplete="off"
          name="password"
          value={state.password}
          onChange={(e) =>
            handleInput(e as unknown as ChangeEvent<HTMLInputElement>, setState)
          }
        />
        <div className="button-wrapper">
          <button className="submit-button fade-button" type="submit">
            Log in
          </button>
        </div>
      </Form>

      <div className="button-wrapper footnote">
        <button
          type="button"
          value="registration"
          onClick={() => navigate("register/")}
          className="verification-redirect"
        >
          I need to make an account
        </button>
      </div>
    </div>
  );
}

export default Login;
