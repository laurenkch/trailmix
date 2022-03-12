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

export const RADIO_OPTIONS = {
        pet_stance: {
            df: 'Dog friendly',
            npa: 'No pets allowed',
        }
    , 
        parking: {
            lpark: 'Limited parking',
            apark: 'Ample parking',
        }
    , 
        cell_strength: {
            ncell: 'No cell service',
            wcell: 'Weak signal',
            scell: 'Strong signal'
        }
    , 
        bathrooms: {
            nbath: 'No bathrooms',
            cbath: 'Clean bathrooms',
            dbath: 'Dirty bathrooms',
        }
}

// export const DOG_OPTIONS = {
//     df: 'Dog friendly',
//     npa: 'No pets allowed',
// };

// export const PARKING_OPTIONS = {
//     lpark: 'Limited parking',
//     apark: 'Ample parking',
// };

// export const CELL_OPTIONS = {
//     ncell: 'No cell service',
//     wcell: 'Weak signal',
//     scell: 'Strong signal'
// };

// export const BATHROOM_OPTIONS = {
//     nbath: 'No bathrooms',
//     cbath: 'Clean bathrooms',
//     dbath: 'Dirty bathrooms',
// };

export const FEEDBACK_CHECKBOX_OPTIONS = [
    'Muddy',
    'Rocky',
    'Steep',
    'Shaded',
    'River crossing',
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

