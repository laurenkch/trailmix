import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSun, faCloudShowersHeavy, faCloud, faSun, faSmog, faSnowflake, faWind } from '@fortawesome/free-solid-svg-icons';

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
    'muddy',
    'rocky',
    'steep',
    'shaded',
    'river_crossing',
    'kid_friendly',
    'paved',
    'wheelchair_accessible',
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
    if (formState && formState.time != null) {
        const oldTime = formState.time

        INITIAL_VALUE.hr = oldTime.slice(0, 2);
        INITIAL_VALUE.min = oldTime.slice(3, 5);
        INITIAL_VALUE.amPm = oldTime.slice(6, 8);
    }

    const [state, setState] = useState(INITIAL_VALUE)

    const handleInput = (e) => {

        const newTime = { ...state, [e.target.name]: e.target.value }
        setState(newTime);
        setFormState((prevState) => ({ ...prevState, 'time': newTime.hr + ':' + newTime.min + " " + newTime.amPm }));
    }

    return (
        <div>
            <label htmlFor="hour"></label>
            <select className='time-select form-control' name="hr" id="hour" onChange={handleInput} value={state.hr}>
                <option value="--">--</option>
                <option value="01">1</option>
                <option value="02">2</option>
                <option value="03">3</option>
                <option value="04">4</option>
                <option value="05">5</option>
                <option value="06">6</option>
                <option value="07">7</option>
                <option value="08">8</option>
                <option value="09">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
            </select>
            <label htmlFor="minute"></label>
            <select className='time-select form-control' name="min" id="minute" onChange={handleInput} value={state.min}>
                <option value="--">--</option>
                <option value="00">00</option>
                <option value="30">30</option>
            </select>
            <label htmlFor="Am/Pm"></label>
            <select className='time-select form-control' name="amPm" id="Am/Pm" onChange={handleInput} value={state.amPm}>
                <option value="--">--</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
            <span className='optional'>optional</span>
        </div>
    )
}


export const convertWindDegrees = (x) => {
    if (348.75 < x || x < 11.25)
        return 'N'
    if (11.25 < x && x < 33.75)
        return 'NNE'
    if (33.75 < x && x < 56.25)
        return 'NE'
    if (56.25 < x && x < 78.75)
        return 'ENE'
    if (78.75 < x && x < 101.25)
        return 'E'
    if (101.25 < x && x < 123.75)
        return 'ESE'
    if (123.75 < x && x < 146.25)
        return 'SE'
    if (146.25 < x && x < 168.75)
        return 'SSE'
    if (168.75 < x && x < 191.25)
        return 'S'
    if (191.25 < x && x < 213.75)
        return 'SSW'
    if (213.75 < x && x < 236.25)
        return 'SW'
    if (236.25 < x && x < 258.75)
        return 'WSW'
    if (258.75 < x && x < 281.25)
        return 'W'
    if (281.25 < x && x < 303.75)
        return 'WNW'
    if (303.75 < x && x < 326.25)
        return 'NW'
    if (326.25 < x && x < 348.75)
        return 'NNW'
    else
        return 'incorrect value';
}


export function convertDateFormat(date) {

    let data = new Date(date);
    let formattedDate = data.toLocaleDateString(undefined, {
        weekday: 'long', month: 'long',
        day: 'numeric'
    });
    return formattedDate
}

export function convertDateFormatWithYear(date) {

    let data = new Date(date);
    let formattedDate = data.toLocaleDateString(undefined, {
        weekday: 'long', month: 'long',
        day: 'numeric', year: 'numeric'
    });
    return formattedDate
}

export function convertTimeFormat(time) {
    if (time && time[0] === '0') {
        let newTime = time.slice(1)
        return newTime
    } else
        return time
}

export function getWeatherIcons(description) {
    if (description.includes('overcast clouds')) {
        return <FontAwesomeIcon icon={faCloud} />
    } else if (description.includes('scattered clouds')) {
        return <FontAwesomeIcon icon={faCloudSun} />
    } else if (description.includes('rain')) {
        return <FontAwesomeIcon icon={faCloudShowersHeavy} />
    } else if (description.includes('windy')) {
        return <FontAwesomeIcon icon={faWind} />
    } else if (description.includes('snow')) {
        return <FontAwesomeIcon icon={faSnowflake} />
    } else if (description.includes('fog')) {
        return <FontAwesomeIcon icon={faSmog} />
    } else {
        return <FontAwesomeIcon icon={faSun} />
    }

}