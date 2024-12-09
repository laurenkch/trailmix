import { useState, useEffect } from "react";
import {
  handleError,
  convertDateFormat,
  convertTimeFormat,
  convertDateFormatWithYear,
} from "../../util";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import React from "react";
import { Trip } from "../../types";

function Trips() {
  const [trips, setTrips] = useState<Maybe<Trip[]>>(null);

  useEffect(() => {
    const getTrips = async () => {
      const response = await fetch("/api/v1/trails/trips/").catch(handleError);
      if (!response?.ok) {
        throw new Error("Network response not ok");
      } else {
        const data = await response.json();
        setTrips(data);
      }
    };
    if (!trips) {
      getTrips();
    }
  }, [trips]);

  if (!trips) {
    return <div>Loading...</div>;
  }
  const currentTime = new Date();

  if (trips.length < 1) {
    return <div>No trips planned</div>;
  }

  const upcomingTripsHtml = trips
    .filter((trip) => new Date(trip.date) > currentTime)
    .map((trip, index) => (
      <div key={trip.id}>
        <Link className="trip-link" to={`/trip/${trip.id}`}>
          <h3>{trip.trailname}</h3>
        </Link>
        <div>
          <div>{convertDateFormat(trip.date)}</div>
          <div>{convertTimeFormat(trip.time)}</div>
        </div>
      </div>
    ));

  const pastTripsHtml = trips
    .filter((trip) => new Date(trip.date) < currentTime)
    .sort(
      (item1, item2) =>
        new Date(item2.date).setHours(0, 0, 0, 0) -
        new Date(item1.date).setHours(0, 0, 0, 0),
    )
    .map((trip, index) => (
      <li key={trip.id}>
        <h3>{trip.trailname}</h3>
        <div>{convertDateFormatWithYear(trip.date)}</div>
      </li>
    ));

  return (
    <div className="wrapper">
      <h2>Upcoming Trips</h2>
      <ul>
        {upcomingTripsHtml.length > 0 ? upcomingTripsHtml : "No upcoming trips"}
      </ul>
      <div className="past-trips">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Past Trips</Accordion.Header>
            <Accordion.Body>
              <ul>
                {pastTripsHtml.length > 0 ? pastTripsHtml : "No past trips"}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

export default Trips;
