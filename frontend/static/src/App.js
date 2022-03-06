import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';
import handleError from './util';

function App() {

  const getWeather = async () => {

    const USER_AGENT = '(https://trailmix-lkoch.herokuapp.com/, lkoch879@gmail.com)';
    const BASE_URL = 'https://api.weather.gov/points/';

    let lat = '34.503441';
    let long = '-82.650131';

    const options = {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
      }
    };

    const response = await fetch(`${BASE_URL}${lat},${long}`, options).catch(
      handleError
    );

    if (!response.ok) {
      throw new Error("Network response not ok");
    } else {
      const data = await response.json();
      const newURL = data.properties.forecast
      console.log(newURL);

      const response2 = await fetch(`${newURL}`, options).catch(
        handleError
      );

      if (!response2.ok) {
        throw new Error("Network response not ok");
      } else {
        const data2 = await response2.json();
        console.log(data2.properties.periods);

      }
    }


  }
    getWeather();
    
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
