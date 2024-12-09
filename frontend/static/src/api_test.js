import Cookies from "js-cookie";
import handleError from "./util";
import NPS_API_KEY from "./NPS.js";

function ApiTest() {
  const getWeather = async () => {
    const USER_AGENT =
      "(https://trailmix-lkoch.herokuapp.com/, lkoch879@gmail.com)";
    const BASE_URL = "https://api.weather.gov/points/";

    let lat = "34.503441";
    let long = "-82.650131";

    const options = {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
      },
    };

    const response = await fetch(`${BASE_URL}${lat},${long}`, options).catch(
      handleError,
    );

    if (!response.ok) {
      throw new Error("Network response not ok");
    } else {
      const data = await response.json();
      const newURL = data.properties.forecast;

      const response2 = await fetch(`${newURL}`, options).catch(handleError);

      if (!response2.ok) {
        throw new Error("Network response not ok");
      } else {
        const data2 = await response2.json();
      }
    }
  };
  getWeather();

  const getNationalParkAlerts = async () => {
    const BASE_URL = "https://developer.nps.gov/api/v1/";
    const SC_PARKS = "parks?stateCode=sc";
    const ALERTS = "alerts?parkCode=chpi";
    const SC_NATIONAL_PARK_CODES = [
      "chpi",
      "cong",
      "cowp",
      "fosu",
      "kimo",
      "nisi",
      "ovvi",
      "reer",
    ];

    let parkCode = "";

    const options = {
      method: "GET",
      headers: {
        "X-Api-Key": `${NPS_API_KEY}`,
      },
    };

    const response = await fetch(`${BASE_URL}${ALERTS}`, options).catch(
      handleError,
    );

    if (!response.ok) {
      throw new Error("Network response not ok");
    } else {
      const data = await response.json();
      console.log(data);
    }
  };
  getNationalParkAlerts();
  return <div></div>;
}

export default ApiTest;
