import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App/App';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin/Admin';
import NewParkForm from './components/Admin/NewParkForm';
import Home from './components/Home';
import AdminParkDetail from './components/Admin/AdminParkDetail';
import AdminTrailDetail from './components/Admin/AdminTrailDetail';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} >
          <Route index element={< Home/>}/>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='administrator' element={<Admin />}/>
          <Route path='administrator/park/:parkId' element={<AdminParkDetail />}/>
          <Route path='administrator/trail/:trailId' element={<AdminTrailDetail />} />
          <Route path='addtrail' element={<NewParkForm />} />
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
