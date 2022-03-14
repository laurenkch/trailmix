import { useState } from 'react';

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

export const DIFFICULTY_KEY = [
    {
        level: 1,
        description: "< 3 miles and < 500 feet"
    }, {
        level: 2,
        description: '< 5 miles and < 1,000 feet'
    },
    {
        level: 3,
        description: '< 7 miles and < 1,500 feet'
    },
    {
        level: 4,
        description: '< 9 miles and < 2,000 feet'
    }, {
        level: 5,
        description: '< 11 miles and < 2,500 feet'
    }, {
        level: 6,
        description: ' > 11 miles or > 2,5000 feet'
    }
]

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

export function TimeInput({ setFormState, formState }) {

    let INITIAL_VALUE = {
        hr: '--',
        min: '--',
        amPm: '--',
    }
    if (formState) {
        const oldTime = formState.time

        const hour = parseInt(oldTime.slice(0, 2));
        const min = oldTime.slice(3, 5);

        if (hour > 12) {
            INITIAL_VALUE.hr = hour - 12
            INITIAL_VALUE.amPm = 'PM'
        } else {
            INITIAL_VALUE.hr = hour
            INITIAL_VALUE.amPm = 'AM'
        }
        INITIAL_VALUE.min = min

    }


    const [state, setState] = useState(INITIAL_VALUE)

    const handleInput = (e) => {
        let newTime;
        setState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
        newTime = { ...state, [e.target.name]: e.target.value }
        if (newTime.hr === '--' || newTime.min === '--') {
            setFormState((prevState) => ({ ...prevState, time: `` }));
            return
        }

        if (newTime.amPm === 'PM' && newTime.hr !== '12') {
            const hour = parseInt(newTime.hr) + 12
            const data = { ...newTime, hr: hour }
            newTime = data
        }
        setFormState((prevState) => ({ ...prevState, time: `${newTime.hr}:${newTime.min}` }))
    }


    return (
        <div>
            <label htmlFor="hour"></label>
            <select name="hr" id="hour" onChange={handleInput} value={state.hr}>
                <option value="--">--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
            </select>
            <label htmlFor="minute"></label>
            <select name="min" id="minute" onChange={handleInput} value={state.min}>
                <option value="--">--</option>
                <option value="00">00</option>
                <option value="30">30</option>
            </select>
            <label htmlFor="Am/Pm"></label>
            <select name="amPm" id="Am/Pm" onChange={handleInput} value={state.amPm}>
                <option value="--">--</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    )
}

