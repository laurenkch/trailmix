import { render, unmountComponentAtNode } from "react-dom";
import TripDetail from "../TripDetail";
import ReactTestUtils from "react-dom/test-utils";
import { BrowserRouter, Routes, Route, MemoryRouter } from "react-router-dom";
import App from "../../App/App";
import {
  handleError,
  TRAIL_TYPES,
  handleInput,
  TimeInput,
  convertWindDegrees,
  getWeatherIcons,
  convertTimeFormat,
} from "../../../util";

// These tests do not currently work, as I was unable to simulate a fetch request. Keeping here to revisit in the future. Working tests are in the TripForm.test.js file.

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe.skip("TripDetail", () => {
  let container = null;
  let date = new Date(new Date() + 1);
  const fakeDate = { date: date };
  const fakeTime = { time: "8:00 AM" };
  const fakeNotes = { notes: "This is a test" };
  const fakeData = {
    id: 1,
    date: date,
    time: "8:00 AM",
    notes: "This is a test note.",
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it.skip("renders with fetch data", () => {
    jest.spyOn(global, "fetch").mockImplementation(() => {
      Promise.resolve({
        json: () => Promise.resolve(fakeData),
      });
      Promise.catch(handleError);
    });
    render(
      <MemoryRouter initialEntries={["/trip/10000"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="trip/:tripId" element={<TripDetail />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      container,
    );
    // <BrowserRouter>
    //     <Routes>
    //         <Route path='trip/:tripId' element={<TripDetail />}/>
    // </Routes>
    // </BrowserRouter>, container);

    const details = container.querySelector(".trail-detail");

    expect.skip(details).toBe(fakeData.notes);
    expect.skip(container.textContent).toContain(
      fakeData.date.toLocaleDateString({
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
    );
  });
});
