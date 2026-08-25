import React from 'react'
import style from './style.module.scss'
import { useNavigate, useParams } from 'react-router-dom';

const GetStartedPage = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const isDirector = type === 'director';
    const isActor = type === 'actor';

    const handleClick = () => {
        if (isDirector) {
            navigate('/director-profile');
        } else {
            navigate('/actor-profile');
        }
    };

    return (
        <div className={style.container}>
            <svg width="366" height="156" viewBox="0 0 366 156" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M42.1016 109V60.9531H42.8828L55.8711 81.8516V109H42.1016ZM42.1016 49.625V40.6406H53.332L85.5586 92.5938V109H79.0156L42.1016 49.625ZM71.7891 60.3672V40.6406H85.5586V81.2656H84.7773L71.7891 60.3672ZM93.7617 109V40.6406H129.309V54.3125H107.531V68.1797H120.129V81.9492H107.531V95.2305H129.309V109H93.7617ZM134.484 54.1172V40.6406H176.77V54.1172H162.512V109H148.742V54.1172H134.484ZM182.336 108.902V40.6406H217.883V54.3125H196.105V68.1797H208.703V81.9492H196.105V108.902H182.336ZM224.523 109V40.6406H238.293V95.3281H261.242V109H224.523ZM266.809 109V40.6406H280.578V109H266.809ZM286.145 109L299.426 73.7461L287.316 40.6406H300.695L306.262 55.4844L311.828 40.6406H325.207L313.098 73.7461L326.379 109H312.219L306.262 92.6914L300.305 109H286.145Z" fill="#800020"/>
<ellipse cx="183" cy="22" rx="183" ry="22" fill="#262425"/>
<ellipse cx="183" cy="126" rx="183" ry="22" fill="#262425"/>
</svg>


            <h1 className={style.title}> 
                We are excited to meet you!
            </h1>

            <p className={style.text}>
                {isDirector && "Build your next cast. Discover actors who bring your vision to life."}
                {isActor && "Show the world your talent. Create your profile and get discovered for your next role."}
            </p>

            <div className={style.buttonContainer}>
                <button onClick={handleClick} className={style.button}>
                    {isDirector && "Start Casting"}
                    {isActor && "Create Profile"}
                </button>
            </div>
        </div>
    );
}

export default GetStartedPage;