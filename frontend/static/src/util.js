export const handleError = (err) => {
    console.warn(err);
}

export const handleInput = (e, setState) => {
    const { name, value } = e.target

    setState((prevState) => ({
        ...prevState,
        [name]: value,
    }));
};

export const TRAIL_TYPES = {
    oab: 'Out and back',
    loop: 'Loop',
    seg: 'Trail segment',
};


export const TRAIL_FEEDBACK = [
    'Dog friendly',
    'No pets allowed',
    'Muddy',
    'Rocky',
    'Steep',
    'Shaded',
    'River crossing',
    'Limited parking',
    'Ample parking',
    'Clean bathrooms',
    'No bathrooms',
    'Dirty bathrooms',
    'No cell service',
    'Strong cell signal',
    'Weak cell signal',
    'Kid friendly',
    'Paved',
    'Wheelchair accessible',
]


export const getWeather = async (lat, long) => {

    const USER_AGENT = '(https://trailmix-lkoch.herokuapp.com/, lkoch879@gmail.com)';
    const BASE_URL = 'https://api.weather.gov/points/';

    let data;
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
        const data1 = await response.json();
        const newURL = data1.properties.forecast

        const response2 = await fetch(`${newURL}`, options).catch(
            handleError
        );

        if (!response2.ok) {
            throw new Error("Network response not ok");
        } else {
            data = await response2.json();
        }
    }
    return data.properties.periods
};

