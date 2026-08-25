import React from 'react'
import NetflixTitle from './elements/NetflixTitle';
import LoginPage from './pages/LoginPage';
import SignInPage from './pages/SignInPage';
import PlanPage from './pages/PlanPage';
import style from './style.module.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyButtonThx from './elements/BuyButtonThx';
import ChooseDevicePage from './pages/ChooseDevicePage';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import AuthProvider from './elements/AuthProvider';
import TheRoutes from './elements/TheRoutes';
import {ErrorProvider} from './tools/errorContext';




const App = () => {

  return (
    // <div className={style.container}>
    <ErrorProvider>
      <AuthProvider>
        <TheRoutes />
      </AuthProvider>
    </ErrorProvider>


      /* <Router>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PlanPage />} />
          <Route path="/device" element={<ChooseDevicePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/:type/:id" element={<MoviePage />} />
        </Routes>

      </Router> */
    // </div>
  );
}

export default App;
