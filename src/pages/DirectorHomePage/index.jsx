import React, { useState } from 'react'
import style from './style.module.scss'
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../../elements/Header';
import CastingDirectorStaterBanner from '../../elements/CastingDirectorStarterBanner';
import { useNavigate } from 'react-router-dom';
import useRequireRole from '../../tools/useRequireRole';


const DirectorHomePage = () => {
     useRequireRole({ requireDirector: true });

    const navigate = useNavigate();
    const handleToLogin = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <div className={` d-flex`}>
                <div>
                    <Header />
                </div>
                <div className={` ${style.content}`}>
                    <CastingDirectorStaterBanner />
                </div>
            </div>
    );
}

export default DirectorHomePage;