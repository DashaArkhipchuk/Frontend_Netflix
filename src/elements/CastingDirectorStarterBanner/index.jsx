import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';


const CastingDirectorStarterBanner = () => {
    const navigate = useNavigate();
    const { directorProfileExists } = useAuth();

    const handleGetCast = () => {
        console.log('directorProfileExists:', directorProfileExists); // Debug log
        navigate(directorProfileExists ? '/casting' : '/casting-director');
    };

    return (
        <div
            className={style.contentArea}
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/castingdirectors-home-banner.jpg)` }}
        >
            <div className={style.contentInfo}>
                <h1 className={style.contentInfoTitle}>FIND THE RIGHT CAST</h1>
                <p>
                    Every story begins with the right faces. Discover talent that brings scripts to life,
                    captures emotion in a glance, and turns vision into unforgettable performances.
                </p>
                <button className={style.buttonGet} onClick={handleGetCast}>
                    <p>Get cast</p>
                </button>
            </div>
        </div>
    );
};

export default CastingDirectorStarterBanner;