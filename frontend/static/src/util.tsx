import { ChangeEvent, Dispatch } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudSun,
  faCloudShowersHeavy,
  faCloud,
  faSun,
  faSmog,
  faSnowflake,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const handleError = (err: unknown) => {
  console.warn(err);
};

export const handleInput = (
  e: ChangeEvent<HTMLInputElement>,
  setState: Dispatch<any>,
) => {
  const { name, value } = e.target;

  setState((prevState: Record<string, any>) => ({
    ...prevState,
    [name]: value,
  }));
};

export const getWeather = async (lat: string, long: string) => {
  const USER_AGENT =
    "(https://trailmix-lkoch.herokuapp.com/, lkoch879@gmail.com)";
  const BASE_URL = "https://api.weather.gov/points/";

  let data;
  const options = {
    method: "GET",
    headers: {
      "User-Agent": USER_AGENT,
    },
  };

  const response = await fetch(`${BASE_URL}${lat},${long}`, options).catch(
    handleError,
  );

  if (!response?.ok) {
    throw new Error("Network response not ok");
  } else {
    const data1 = await response.json();
    const newURL = data1.properties.forecast;

    const response2 = await fetch(`${newURL}`, options).catch(handleError);

    if (!response2?.ok) {
      throw new Error("Network response not ok");
    } else {
      data = await response2.json();
    }
  }
  return data.properties.periods;
};

export const convertWindDegrees = (x: number) => {
  if (348.75 < x || x < 11.25) return "N";
  if (11.25 < x && x < 33.75) return "NNE";
  if (33.75 < x && x < 56.25) return "NE";
  if (56.25 < x && x < 78.75) return "ENE";
  if (78.75 < x && x < 101.25) return "E";
  if (101.25 < x && x < 123.75) return "ESE";
  if (123.75 < x && x < 146.25) return "SE";
  if (146.25 < x && x < 168.75) return "SSE";
  if (168.75 < x && x < 191.25) return "S";
  if (191.25 < x && x < 213.75) return "SSW";
  if (213.75 < x && x < 236.25) return "SW";
  if (236.25 < x && x < 258.75) return "WSW";
  if (258.75 < x && x < 281.25) return "W";
  if (281.25 < x && x < 303.75) return "WNW";
  if (303.75 < x && x < 326.25) return "NW";
  if (326.25 < x && x < 348.75) return "NNW";
  else return "incorrect value";
};

export function convertDateFormat(date: string) {
  let data = new Date(date);
  let formattedDate = data.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
}

export function convertDateFormatWithYear(date: string) {
  let data = new Date(date);
  let formattedDate = data.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return formattedDate;
}

export function convertTimeFormat(time: string) {
  if (time && time[0] === "0") {
    let newTime = time.slice(1);
    return newTime;
  } else return time;
}

export function getWeatherIcons(description: string) {
  if (description.includes("overcast clouds")) {
    return <FontAwesomeIcon icon={faCloud} />;
  } else if (description.includes("scattered clouds")) {
    return <FontAwesomeIcon icon={faCloudSun} />;
  } else if (description.includes("rain")) {
    return <FontAwesomeIcon icon={faCloudShowersHeavy} />;
  } else if (description.includes("windy")) {
    return <FontAwesomeIcon icon={faWind} />;
  } else if (description.includes("snow")) {
    return <FontAwesomeIcon icon={faSnowflake} />;
  } else if (description.includes("fog")) {
    return <FontAwesomeIcon icon={faSmog} />;
  } else {
    return <FontAwesomeIcon icon={faSun} />;
  }
}
