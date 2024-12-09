import { render, unmountComponentAtNode } from "react-dom";
import Home from "../Home";
import ReactTestUtils from "react-dom/test-utils";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  MemoryRouter,
} from "react-router-dom";
import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
// import App from './../App/App';

// const mockedUsedNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockedUsedNavigate,
// }));

// These tests do not currently work, as I was unable to simulate a fetch request. Keeping here to revisit in the future. Working tests are in the TripForm.test.js file.

describe.skip("Home", () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  // describe('ButtonLogin', () => {
  //     test('should pass', () => {
  //         const history = createMemoryHistory({ initialEntries: ['/home'] });
  //         const { getByText } = render(
  //             <Router history={history}>
  //                 <ButtonLogin />
  //             </Router>
  //         );
  //         expect(history.location.pathname).toBe('/home');
  //         fireEvent.click(getByText('Iniciar sesión'));
  //         expect(history.location.pathname).toBe('/login');
  //     });
  // });

  it.skip("has an input type text", () => {
    const history = createMemoryHistory();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Route path="/" />
        <Home />
      </MemoryRouter>,
      container,
    );
    const formField = container.querySelector("input");
    expect(formField).toEqual("INPUT");
    expect(formField.type).toEqual("text");
  });

  // it('renders with fetch data', () => {
  // //     jest.spyOn(global, 'fetch').mockImplementation(() => {
  // //         Promise.resolve({
  // //             json: () => Promise.resolve(fakeData),
  // //         })
  // //     });
  // //     render(
  // //         <BrowserRouter>
  // //             <Routes>
  // //                 <Route path='trip/:tripId' element={<TripDetail />}/>
  // //         </Routes>
  // //         </BrowserRouter>, container);

  // //     const details = container.querySelector(".trail-detail");

  // //     expect(details).toBe(fakeData.notes);
  //     // expect(container.textContent).toContain(fakeData.date.toLocaleDateString({ year: 'numeric', month: 'numeric', day: 'numeric'}));
  // // });
});
