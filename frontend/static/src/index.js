import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App/App';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin/Admin';
import TrailForm from './components/Admin/TrailForm';
import Home from './components/User/Home';
import AdminParkDetail from './components/Admin/AdminParkDetail';
import AdminTrailDetail from './components/Admin/AdminTrailDetail';
import AdminList from './components/Admin/AdminList';
import TrailDetail from './components/User/TrailDetail';
import ParkDetail from './components/User/ParkDetail';
import TripForm from './components/User/TripForm';
import Trips from './components/User/Trips';
import TripDetail from './components/User/TripDetail';

import 'bootstrap/dist/css/bootstrap.min.css';



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={< Home/>}/>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='trail/:trailId' element={<TrailDetail />} />
          <Route path='park/:parkId' element={<ParkDetail />} />
          <Route path='plan/:trailId' element={<TripForm />} />
          <Route path='trips/' element={<Trips />} />
          <Route path='trip/:tripId' element={<TripDetail />}/>
          <Route path='administrator' element={<Admin />}>
            <Route index element={<AdminList />} />
            <Route path='park/:parkId' element={<AdminParkDetail />} />
            <Route path='trail/:trailId' element={<AdminTrailDetail />} />
            <Route path='addtrail' element={<TrailForm />} />
          </Route>
          <Route path='*' element={
            <main style={{ padding: '1 rem' }}>
              <p>There's nothing here!</p>
            </main>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
