import { render, unmountComponentAtNode } from 'react-dom';
import TripDetail from './TripDetail';
import ReactTestUtils from 'react-dom/test-utils';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// const mockedUsedNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockedUsedNavigate,
// }));

describe.skip('TripDetail', () => {

    let container = null;
    let date = new Date(new Date() + 1)
    const fakeDate = { date: date }
    const fakeTime = { time: '8:00 AM' }
    const fakeNotes = { notes: 'This is a test' }
    const fakeData = {
        id: 1,
        date: date,
        time: '8:00 AM',
        notes: 'This is a test note.'
    }
    
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it.skip('renders with fetch data', () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => {
            Promise.resolve({
                json: () => Promise.resolve(fakeData),
            })
        });
        render(
            <BrowserRouter>
                <Routes>
                    <Route path='trip/:tripId' element={<TripDetail />}/>
            </Routes>
            </BrowserRouter>, container);

        const details = container.querySelector(".trail-detail");
        
        expect.skip(details).toBe(fakeData.notes);
        expect.skip(container.textContent).toContain(fakeData.date.toLocaleDateString({ year: 'numeric', month: 'numeric', day: 'numeric'}));
    });

}) 