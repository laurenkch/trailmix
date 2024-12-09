import {
  useParams,
  useNavigate,
  useOutletContext,
  Link,
} from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { handleError, handleInput } from "../../util";
import Cookies from "js-cookie";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import React from "react";
import { AdminOutletContext } from "./Admin";
import { TRAIL_TYPES } from "../../constants";
import { Park, Trail } from "../../types";
import { toString } from "lodash";

function AdminParkDetail() {
  const params = useParams();
  const navigate = useNavigate();

  const { parks, setParks, trails, setTrails } =
    useOutletContext<AdminOutletContext>();

  const [state, setState] = useState<Maybe<Park & { trails: Trail[] }>>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getPark = async () => {
      const options = {
        method: "GET",
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken")!,
        },
      };

      const response = await fetch(
        `/api/v1/trails/edit/park/${params.parkId}/`,
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

  const editPark = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const options = {
      method: "PUT",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    };

    const response = await fetch(
      `/api/v1/trails/edit/park/${state?.id}/`,
      options,
    ).catch(handleError);

    if (!response?.ok) {
      throw new Error("Network response not ok");
    }

    setIsEditing(false);
  };

  const deletePark = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const options = {
      method: "DELETE",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken")!,
      },
    };

    const response = await fetch(
      `/api/v1/trails/edit/park/${state?.id}/`,
      options,
    ).catch(handleError);

    if (!response?.ok) {
      throw new Error("Network response not ok");
    }

    setIsEditing(false);

    const newParkList = parks?.filter((park) => park.id !== state?.id);
    setParks(newParkList);

    const newTrailList = trails.filter((trail) => trail.park.id !== state?.id);
    setTrails(newTrailList);
    navigate("/administrator");
  };

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
          <Link
            className="trail-list-button"
            to={`/administrator/trail/${trail.id}`}
          >
            Go to Trail
          </Link>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  ));

  return (
    <div>
      {isEditing && (
        <div>
          <Form onSubmit={editPark}>
            <Form.Label htmlFor="park name">Park Name</Form.Label>
            <Form.Control
              id="park name"
              name="name"
              type="text"
              onChange={(e) =>
                handleInput(
                  e as unknown as ChangeEvent<HTMLInputElement>,
                  setState,
                )
              }
              value={state.name}
              required
              autoComplete="off"
            />
            <Form.Label htmlFor="latitude">Latitude</Form.Label>
            <Form.Control
              id="latitude"
              name="latitude"
              type="text"
              onChange={(e) =>
                handleInput(
                  e as unknown as ChangeEvent<HTMLInputElement>,
                  setState,
                )
              }
              value={state.latitude}
              required
              autoComplete="off"
            />
            <Form.Label htmlFor="longitude">Longitude</Form.Label>
            <Form.Control
              id="longitude"
              name="longitude"
              type="text"
              onChange={(e) =>
                handleInput(
                  e as unknown as ChangeEvent<HTMLInputElement>,
                  setState,
                )
              }
              value={state.longitude}
              required
              autoComplete="off"
            />
            <Form.Label htmlFor="fee">Fee</Form.Label>
            <Form.Control
              id="fee"
              name="fee"
              type="text"
              onChange={(e) =>
                handleInput(
                  e as unknown as ChangeEvent<HTMLInputElement>,
                  setState,
                )
              }
              value={state.fee}
              autoComplete="off"
            />
            <Form.Label htmlFor="park_code">Park Code</Form.Label>
            <Form.Control
              id="park code"
              name="park_code"
              type="text"
              onChange={(e) =>
                handleInput(
                  e as unknown as ChangeEvent<HTMLInputElement>,
                  setState,
                )
              }
              value={state.park_code ?? undefined}
              autoComplete="off"
            />
            <Form.Label htmlFor="hours">Hours</Form.Label>
            <Form.Control
              id="hours"
              name="hours"
              type="text"
              onChange={(e) =>
                handleInput(
                  e as unknown as ChangeEvent<HTMLInputElement>,
                  setState,
                )
              }
              value={state.hours}
              required
              autoComplete="off"
            />
            <Form.Label htmlFor="Address">Address</Form.Label>
            <Form.Control
              id="Address"
              name="address"
              type="address"
              onChange={(e) =>
                handleInput(
                  e as unknown as ChangeEvent<HTMLInputElement>,
                  setState,
                )
              }
              value={state.address}
              required
              autoComplete="off"
            />
            <Form.Label htmlFor="Activities">Activities</Form.Label>
            <Form.Control
              id="Activities"
              name="activities"
              type="text"
              onChange={(e) =>
                handleInput(
                  e as unknown as ChangeEvent<HTMLInputElement>,
                  setState,
                )
              }
              value={state.activities ?? undefined}
              autoComplete="off"
            />
            <button className="trail-list-button" type="submit">
              Save changes
            </button>
          </Form>
        </div>
      )}

      {!isEditing && (
        <div>
          <h2>{state.name}</h2>
          <ul>
            <li>Address: {state.address}</li>
            <li>Fee: {state.fee}</li>
            <li>Hours: {state.hours}</li>
            <li>Latitude: {state.latitude}</li>
            <li>Longitude: {state.longitude}</li>
            <li>Park code:{state.parkcode}</li>
            <li>Activities: {state.activities}</li>
          </ul>
          <button
            className="trail-list-button"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit Park
          </button>
          <button
            className="trail-list-button"
            type="button"
            onClick={deletePark}
          >
            Delete Park
          </button>
        </div>
      )}
      <Accordion>{trailHtml}</Accordion>
    </div>
  );
}

export default AdminParkDetail;
