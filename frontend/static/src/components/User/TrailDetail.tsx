import { useParams, Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { convertWindDegrees, getWeatherIcons } from "../../util";
import FeedbackModal from "./FeedbackModal";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faMap } from "@fortawesome/free-solid-svg-icons";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import Accordion from "react-bootstrap/Accordion";
import MapModal from "./MapModal";
import React from "react";
import { OutletContext } from "../App/App";
import { fetchWrapper } from "./../../fetch";
import { Trail, Image, Park, Weather } from "../../types";
import {
  DIFFICULTY_KEY,
  FEEDBACK_CHECKBOX_OPTIONS,
  RADIO_OPTIONS,
  TRAIL_TYPES,
} from "../../constants";
import { toNumber } from "lodash";

type State = Trail & {
  park: Park;
  weather: Weather;
};

function TrailDetail() {
  const { navigate, auth, setAuth, setAdmin } =
    useOutletContext<OutletContext>();

  const params = useParams();

  const [state, setState] = useState<Maybe<State>>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [imageList, setImageList] = useState<Image[]>([]);

  const handleOpenFeedback = () => {
    setShowFeedback(true);
  };
  const handleOpenLogin = () => {
    setShowLogin(true);
  };
  const handleOpenMap = () => {
    setShowMap(true);
  };

  const getImages = async (id: string) => {
    const url = `/api/v1/trails/photos/trailId/${id}/`;
    const images = await fetchWrapper(url);

    setImageList(images);
  };

  useEffect(() => {
    const getTrail = async () => {
      const url = `/api/v1/trails/${params.trailId}/`;

      const trail = await fetchWrapper(url);

      setState(trail);

      if (trail) {
        getImages(trail.id);
      }
    };
    getTrail();
  }, [params.trailId]);

  if (!state) {
    return <div>Loading...</div>;
  }

  const difficultyMap = DIFFICULTY_KEY.map((entry) => (
    <div key={entry.level}>
      <h3>{`Level ${entry.level}`}</h3>
      {entry.description}
    </div>
  ));

  const difficultyHtml = (
    <div className="levels">
      Difficulty is based on total length and elevation gain.
      {difficultyMap}
    </div>
  );

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      <div className="tip">{difficultyHtml}</div>
    </Tooltip>
  );

  let weatherHtml;

  if (typeof state.weather != typeof "string") {
    weatherHtml = state.weather.daily?.map((day, index) => {
      let date = new Date(day.dt);
      return (
        <div key={index} className="scroll-squares whitespace">
          <h4>
            {date
              .toLocaleDateString(undefined, {
                weekday: "long",
                month: "numeric",
                day: "numeric",
              })
              .replace(",", "\n")}
          </h4>
          <div className="weather-icon">
            {getWeatherIcons(day.weather[0].description)}
          </div>
          <p className="temp">{day.temp.day.toFixed(0)} F</p>
          <p>{day.weather[0].description}</p>
          <p>
            Winds {"\n" + day.wind_speed.toFixed(0)}{" "}
            {convertWindDegrees(day.wind_deg)}
          </p>
        </div>
      );
    });
  }

  let feedbackHtml;

  if (Object.values(state).includes(true)) {
    feedbackHtml = FEEDBACK_CHECKBOX_OPTIONS.filter((option) => state[option])
      .map((option) => option.replaceAll("_", " "))
      .map((option, index) => (
        <div className="feedback-badge" key={index}>
          {option}
        </div>
      ));
  }

  const printRadioFeedback = () => {
    let data = [];

    for (const [key, value] of Object.entries(RADIO_OPTIONS)) {
      let variable = state[key as keyof typeof RADIO_OPTIONS] as string;

      if (variable) {
        //@ts-ignore
        const string = value[variable];

        let displayValue = (
          <div className="feedback-badge" key={key}>
            {string}
          </div>
        );
        data.push(displayValue);
      }
    }
    if (data.length > 0) {
      return data;
    } else {
      return null;
    }
  };

  let imageHtml;
  if (imageList.length > 0) {
    imageHtml = imageList.map((image) => (
      <div className="trail-image-wrapper" key={image.id}>
        <img className="absolute" src={image.image} alt="trail" />
      </div>
    ));
  }

  const radioFeedbackHtml = printRadioFeedback();

  return (
    <div className="trail">
      <h2 className="top-h2">{state.name}</h2>
      <div className="desktop trail-buttons">
        {auth && (
          <Link className="trail-list-button" to={`/plan/${state.id}`}>
            Plan a trip to {state.name}
          </Link>
        )}
        {!auth && (
          <button
            className="trail-list-button"
            type="button"
            onClick={handleOpenLogin}
          >
            Plan a trip to {state.name}
          </button>
        )}
      </div>
      <button
        className="trail-list-button map-button"
        type="button"
        onClick={handleOpenMap}
      >
        Map <FontAwesomeIcon icon={faMap} />
      </button>
      {imageList.length > 0 && (
        <div className="horizontal-scroll-wrapper trail-images">
          {imageHtml}
        </div>
      )}
      <ul>
        <li>
          <h3>Elevation gain</h3>
          {state.elevation_gain} ft
        </li>
        <li>
          <h3>Length</h3>
          {state.length} miles
        </li>
        <li>
          <div className="difficulty-heading">
            <h3>Difficulty</h3>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
              trigger={["hover", "focus"]}
            >
              <Button variant="success">
                <FontAwesomeIcon icon={faCircleQuestion} />
              </Button>
            </OverlayTrigger>
          </div>
          <div>{state.difficulty}</div>
        </li>
        <li>
          <h3>Trail Type</h3>
          {TRAIL_TYPES[state.trail_type]}
        </li>
      </ul>
      <h3 className="park-name-detail">{state.park.name}</h3>
      <ul className="bottom-ul">
        <li>
          <h3>Address</h3>
          {state.park.address}
        </li>
        {state.park.fee && (
          <li className="whitespace">
            <h3>Fees</h3>
            {state.park.fee.replaceAll(";", "\n").replaceAll("/", " ")}
          </li>
        )}
        {state.park.hours && (
          <li className="whitespace">
            <h3>Hours</h3>
            {state.park.hours.replaceAll(";", "\n")}
          </li>
        )}
      </ul>
      <Accordion className="trail-description">
        <Accordion.Header className="trail-description">
          Trail Description
        </Accordion.Header>
        <Accordion.Body>{state.description}</Accordion.Body>
      </Accordion>
      {(feedbackHtml || radioFeedbackHtml) && (
        <h3>Other hikers say this trail...</h3>
      )}
      {(feedbackHtml || radioFeedbackHtml) && (
        <div className="feedback-wrapper">
          {feedbackHtml && feedbackHtml}
          {radioFeedbackHtml && radioFeedbackHtml}
        </div>
      )}
      <div className="mobile plan-trip-container">
        {auth && (
          <div className="plan-trip-link-container">
            <Link to={`/plan/${state.id}`}>Plan a trip to {state.name}</Link>
          </div>
        )}
        {!auth && (
          <button
            type="button"
            className="plan-trip-button"
            onClick={handleOpenLogin}
          >
            Plan a trip to {state.name}
          </button>
        )}
      </div>
      {weatherHtml && (
        <div className="weather trip-form-weather">
          <h3>Weather</h3>
          <div className="horizontal-scroll-wrapper">{weatherHtml}</div>
        </div>
      )}

      {auth && (
        <div className="feedback-prompt-wrapper">
          <div className="question-wrapper">
            <h3>Have you hiked {state.name}?</h3>
          </div>
          <button
            type="button"
            className="feedback-prompt"
            onClick={handleOpenFeedback}
          >
            Let us know how it was!
          </button>
        </div>
      )}

      <MapModal
        latitude={toNumber(state.park.latitude)}
        longitude={toNumber(state.park.longitude)}
        show={showMap}
        setShow={setShowMap}
      />
      <FeedbackModal
        id={state.id}
        show={showFeedback}
        setShow={setShowFeedback}
      />
      <LoginModal
        trailId={state.id}
        show={showLogin}
        setShow={setShowLogin}
        navigate={navigate}
        setAuth={setAuth}
        setAdmin={setAdmin}
        setShowRegister={setShowRegister}
      />
      <RegisterModal
        trailId={state.id}
        show={showRegister}
        setShow={setShowRegister}
        navigate={navigate}
        setAuth={setAuth}
        setShowLogin={setShowLogin}
      />
    </div>
  );
}

export default TrailDetail;
