import React, { ChangeEvent, useState } from "react";

export function TimeInput({
  setFormState,
  formState,
}: {
  setFormState: any;
  formState: Maybe<{
    time: Maybe<string>;
  }>;
}) {
  let INITIAL_VALUE = {
    hr: "--",
    min: "--",
    amPm: "--",
  };
  if (formState && formState.time != null) {
    const oldTime = formState.time;

    INITIAL_VALUE.hr = oldTime.slice(0, 2);
    INITIAL_VALUE.min = oldTime.slice(3, 5);
    INITIAL_VALUE.amPm = oldTime.slice(6, 8);
  }

  const [state, setState] = useState<{ hr: string; min: string; amPm: string }>(
    INITIAL_VALUE,
  );

  const handleInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const newTime = { ...state, [e.target.name]: e.target.value };
    setState(newTime);
    setFormState((prevState: typeof INITIAL_VALUE) => ({
      ...prevState,
      time: newTime.hr + ":" + newTime.min + " " + newTime.amPm,
    }));
  };

  return (
    <div>
      <label htmlFor="hour"></label>
      <select
        className="time-select form-control"
        name="hr"
        id="hour"
        onChange={handleInput}
        value={state.hr}
      >
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
      <select
        className="time-select form-control"
        name="min"
        id="minute"
        onChange={handleInput}
        value={state.min}
      >
        <option value="--">--</option>
        <option value="00">00</option>
        <option value="30">30</option>
      </select>
      <label htmlFor="Am/Pm"></label>
      <select
        className="time-select form-control"
        name="amPm"
        id="Am/Pm"
        onChange={handleInput}
        value={state.amPm}
      >
        <option value="--">--</option>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
      <span className="optional">optional</span>
    </div>
  );
}
