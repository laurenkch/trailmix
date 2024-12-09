import Cookies from "js-cookie";
import { NavLink, Link, NavigateFunction } from "react-router-dom";
import { handleError } from "../util";
import Accordion from "react-bootstrap/Accordion";
import React, { Dispatch, MouseEvent } from "react";

function Header({
  auth,
  setAuth,
  navigate,
  admin,
  setAdmin,
}: {
  auth: boolean;
  setAuth: Dispatch<boolean>;
  navigate: NavigateFunction;
  admin: boolean;
  setAdmin: Dispatch<boolean>;
}) {
  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken")!,
      },
    };

    const response = await fetch("/rest-auth/logout/", options).catch(
      handleError,
    );

    if (!response?.ok) {
      throw new Error("Network response not ok");
    } else {
      Cookies.remove("Authorization");
      setAuth(false);
      setAdmin(false);
    }
    navigate("/");
  };

  return (
    <div className="header">
      <Accordion className="mobile forest-green header">
        <Accordion.Header>
          <Link className="background-color-font nav-button" to="/">
            <h1>TrailMix</h1>
          </Link>
        </Accordion.Header>
        <Accordion.Body>
          <ul>
            {auth && !admin && (
              <li>
                <NavLink
                  className="btn toggle-btn background-color-font nav-button"
                  to="/trips"
                >
                  My Trips
                </NavLink>
              </li>
            )}
            {admin && (
              <li>
                <NavLink
                  className="btn toggle-btn background-color-font nav-button"
                  to="administrator/addtrail"
                >
                  Add New Trail
                </NavLink>
              </li>
            )}
            {auth ? (
              <li>
                <button
                  type="button"
                  className="btn toggle-btn background-color-font nav-button"
                  onClick={handleLogout}
                  value={"logout"}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <NavLink
                  className="background-color-font nav-button"
                  to="login"
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </Accordion.Body>
      </Accordion>
      <nav className="forest-green desktop">
        <ul>
          <div className="left-header">
            <Link className="background-color-font" to="/">
              <h1>TrailMix</h1>
            </Link>
            <div className="nav-links">
              {admin && (
                <li>
                  <NavLink
                    className="btn toggle-btn background-color-font"
                    to="administrator/addtrail"
                  >
                    Add New Trail
                  </NavLink>
                </li>
              )}
              {!admin && auth && (
                <li>
                  <NavLink
                    className="btn toggle-btn background-color-font desktop-nav-button"
                    to="/trips"
                  >
                    My Trips
                  </NavLink>
                </li>
              )}
            </div>
          </div>
          <div className="login-logout-button">
            {auth ? (
              <li>
                <button
                  type="button"
                  className="btn toggle-btn background-color-font"
                  onClick={handleLogout}
                  value={"logout"}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <NavLink className="background-color-font" to="login">
                  Login
                </NavLink>
              </li>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
