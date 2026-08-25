import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';

const ThankButton = ({ route, text, theStyle, onSubmit, castingId, isCastingIdNeeded=false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault(); // Зупиняємо стандартну поведінку форми

        const isSuccess = await onSubmit(); // Викликаємо функцію, передану з компоненти форми
        if (isSuccess) {
            setIsModalOpen(true); // Відкриваємо модальне вікно тільки при успіху
        }
    };

    useEffect(() => {
        let timer;
        if (isModalOpen) {
            timer = setTimeout(() => {
                if (isCastingIdNeeded) {
                    navigate(`/${route}/${castingId}`);
                } else {
                    navigate(`/${route}`);
                }
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [isModalOpen, navigate]);

    return (
        <>
            <button type="button" className={theStyle === "submitBtn" ? style.submitBtn : style.sendSubmissionButton} onClick={handleClick}>
                {text}
            </button>
   {console.log('rendering, isModalOpen:', isModalOpen)}


            {isModalOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <h2 className={style.title}>THANK YOU!</h2>
                    </div>
                </div>
            )}
        </>
    );
};

export default ThankButton;
