import { useParams, Link, useOutletContext } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { handleError } from "../../util";
import Accordion from "react-bootstrap/Accordion";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import React from "react";
import { OutletContext } from "../App/App";
import { toString } from "lodash";
import { LatLngTuple } from "leaflet";
import { Park } from "../../types";
import { TRAIL_TYPES } from "../../constants";
import { toNumber } from "lodash";

function ParkDetail() {
  const params = useParams();

  const { navigate, auth, setAuth, setAdmin } =
    useOutletContext<OutletContext>();

  const [state, setState] = useState<Maybe<Park>>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [trailId, setTrailId] = useState<Maybe<string>>(null);

  const handleOpenLogin = (e: ChangeEvent<HTMLButtonElement>) => {
    setTrailId(e.target?.value);
    setShowLogin(true);
  };

  useEffect(() => {
    const getPark = async () => {
      const options = {
        method: "GET",
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken")!,
        },
      };

      const response = await fetch(
        `/api/v1/trails/park/${params.parkId}/`,
        options,
      ).catch(handleError);

      if (!response?.ok) {
        throw new Error("Network response not ok");
      }
      const park = await response.json();
      setState(park);
    };
    getPark();
  }, [params.parkId]);

  if (!state) {
    return <div>Loading...</div>;
  }

  const trailHtml = state.trails.map((trail, index) => (
    <Accordion.Item eventKey={toString(index)} key={index}>
      <Accordion.Header>{trail.name}</Accordion.Header>
      <Accordion.Body>
        <ul>
          <li>
            <h4>Length</h4>
            {trail.length.slice(-1) === "0"
              ? trail.length.slice(0, -1)
              : trail.length}{" "}
            miles
          </li>
          <li>
            <h4>Elevation gain</h4>
            {trail.elevation_gain} feet
          </li>
          <li>
            <h4>Trail type</h4>
            {TRAIL_TYPES[trail.trail_type]}
          </li>
        </ul>
        <div className="trail-list-buttons">
          <Link className="trail-list-button" to={`/trail/${trail.id}`}>
            See More
          </Link>
          {auth && (
            <Link className="trail-list-button" to={`/plan/${trail.id}`}>
              Plan a trip
            </Link>
          )}
          {!auth && (
            <button
              className="trail-list-button"
              type="button"
              value={trail.id}
              onClick={(e) =>
                handleOpenLogin(e as unknown as ChangeEvent<HTMLButtonElement>)
              }
            >
              Plan a trip
            </button>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  ));

  const position: LatLngTuple = [
    toNumber(state.latitude),
    toNumber(state.longitude),
  ];

  return (
    <div className="wrapper park">
      <h2>{state.name}</h2>
      <MapContainer center={position} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{state.name}</Popup>
        </Marker>
      </MapContainer>
      <ul>
        <li className="park-attributes">
          <h3>Address</h3>
          <div>{state.address}</div>
        </li>
        {state.hours && (
          <li className="park-attributes">
            <h3>Hours</h3>
            <div>{state.hours.replaceAll(";", "\n")}</div>
          </li>
        )}
        {state.fee && (
          <li className="park-attributes">
            <h3>Fees</h3>
            <div>{state.fee.replaceAll(";", "\n").replaceAll("/", " ")}</div>
          </li>
        )}
        {state.activities && (
          <li className="park-attributes">
            <h3>Activites</h3>
            <div>{state.activities}</div>
          </li>
        )}
      </ul>
      <h3>Trails</h3>
      <Accordion>{trailHtml}</Accordion>
      <LoginModal
        trailId={trailId}
        show={showLogin}
        setShow={setShowLogin}
        navigate={navigate}
        setAuth={setAuth}
        setAdmin={setAdmin}
        setShowRegister={setShowRegister}
      />
      <RegisterModal
        trailId={trailId}
        show={showRegister}
        setShow={setShowRegister}
        navigate={navigate}
        setAuth={setAuth}
        setShowLogin={setShowLogin}
      />
    </div>
  );
}

export default ParkDetail;
