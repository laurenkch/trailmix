function Weather() {

    const getWeather = () => {

        const USER_AGENT = '(https://trailmix-lkoch.herokuapp.com/, lkoch879@gmail.com)';
        const BASE_URL = 'https://api.weather.gov/points/';

        let lat = '34.503441';
        let long = '-82.650131';

        fetch(`${BASE_URL}/${lat},${long} api_key=${API_KEY}`)
            .then((response) => response.json())
            .then(console.log(data))

    };

    return (
        <div></div>
    )
}

export default Weather