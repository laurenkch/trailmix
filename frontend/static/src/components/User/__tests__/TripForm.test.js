import { render, unmountComponentAtNode } from "react-dom";
import TripForm from "../TripForm";
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

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("TripForm", () => {
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

  it("will not load without a trail", () => {
    render(
      <MemoryRouter initialEntries={["/plan/1/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="plan/:trailId" element={<TripForm />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      container,
    );

    expect(container.textContent).toContain("Loading...");
  });

  it('the first link on the page says "TrailMix"', () => {
    render(
      <MemoryRouter initialEntries={["/plan/1/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="plan/:trailId" element={<TripForm />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      container,
    );

    const link = container.querySelector("a");
    expect(link.textContent).toBe("TrailMix");
  });

  it("renders Login if you are not currently logged in", () => {
    render(
      <MemoryRouter initialEntries={["/plan/1/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="plan/:trailId" element={<TripForm />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      container,
    );

    const link = container.querySelectorAll("a");
    expect(link[1].textContent).toBe("Login");
  });
});
