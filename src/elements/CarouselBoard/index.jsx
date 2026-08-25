import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { Link } from 'react-router-dom';
import style from './style.module.scss'

const CarouselBoard = () => {
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  const [films, setFilms] = useState([]);
  const [minutes, setMinutes] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const ids = [
        'C20E4AEC-35A1-411D-9934-FCDF9D19657D',
        'BDE0F922-04E1-47AE-9006-64F3189E46C5',
        'ECDA35F7-E2F0-4C9B-B19A-5D32ED261B47',
      ];

      try {
        const filmPromises = ids.map(id =>
          fetch(`https://localhost:7118/api/Series/${id}`).then(response => response.json())
        );

        const filmsData = await Promise.all(filmPromises);
        setFilms(filmsData);

        const durations = filmsData.map(film => film.duration);
        setMinutes(durations.map(convertToMinutes));
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  const convertToMinutes = (time) => {
    if (!time || typeof time !== "string") {
      return 0;
    }
    const timeParts = time.split(":").map(Number);
    let totalMinutes = 0;

    if (timeParts.length === 3) {
      const [hours, mins] = timeParts;
      totalMinutes = (hours * 60) + mins;
    } else if (timeParts.length === 2) {
      const [mins] = timeParts;
      totalMinutes = mins;
    }
    return totalMinutes;
  };

  return (
    <Carousel afterChange={onChange}>
      {films.map((film, index) => (
        <div key={index}>
          <div style={{ backgroundImage: `url(${film.pictureUrl})` }} className={style.contentArea}>
            <div className={style.contentInfo}>
            <p className={style.filmDuration}>Duration: {minutes[index]}m</p>
            <h1 className={style.filmTitle}>{film.name}</h1>
            <div className={style.filmInfo}>
              <div className={`${style.rating}`}>
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5245 0.463526C10.6741 0.00287056 11.3259 0.00287008 11.4755 0.463525L13.5819 6.9463C13.6488 7.15232 13.8408 7.2918 14.0574 7.2918H20.8738C21.3582 7.2918 21.5596 7.9116 21.1677 8.1963L15.6531 12.2029C15.4779 12.3302 15.4046 12.5559 15.4715 12.7619L17.5779 19.2447C17.7276 19.7053 17.2003 20.0884 16.8085 19.8037L11.2939 15.7971C11.1186 15.6698 10.8814 15.6698 10.7061 15.7971L5.19153 19.8037C4.79967 20.0884 4.27243 19.7053 4.42211 19.2447L6.52849 12.7619C6.59543 12.5559 6.5221 12.3302 6.34685 12.2029L0.832272 8.1963C0.440415 7.9116 0.641802 7.2918 1.12616 7.2918H7.94256C8.15917 7.2918 8.35115 7.15232 8.41809 6.9463L10.5245 0.463526Z" fill="#F9F1E4" />
                </svg>
                <p>{film.rating}</p>
              </div>
              <p>&#8226; Season {film.seasonCount}</p>
              <p>&#8226; Episodes {film.episodeCount}</p>
              <p>&#8226; {film.genres[0]}</p>
            </div>
            <p className={style.filmContext}>{film.about}</p>
            <div className={style.buttons}>
              <Link to={`/Series/${film.id}`} key={film.id}>
                <button className={style.buttonWatch}>
                  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 6.63397C14.1667 7.01887 14.1667 7.98112 13.5 8.36602L2.25 14.8612C1.58333 15.2461 0.749999 14.765 0.749999 13.9952L0.75 1.00481C0.75 0.23501 1.58333 -0.246117 2.25 0.138783L13.5 6.63397Z" fill="#262425" />
                  </svg>
                  <p>Watch</p>
                </button>
              </Link>
              <button className={style.buttonAddList}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.125 5.625H9.375V1.875C9.375 1.37772 9.17746 0.900805 8.82583 0.549175C8.47419 0.197544 7.99728 0 7.5 0C7.00272 0 6.52581 0.197544 6.17417 0.549175C5.82254 0.900805 5.625 1.37772 5.625 1.875V5.625H1.875C1.37772 5.625 0.900805 5.82254 0.549175 6.17417C0.197544 6.52581 0 7.00272 0 7.5C0 7.99728 0.197544 8.47419 0.549175 8.82583C0.900805 9.17746 1.37772 9.375 1.875 9.375H5.625V13.125C5.625 13.6223 5.82254 14.0992 6.17417 14.4508C6.52581 14.8025 7.00272 15 7.5 15C7.99728 15 8.47419 14.8025 8.82583 14.4508C9.17746 14.0992 9.375 13.6223 9.375 13.125V9.375H13.125C13.6223 9.375 14.0992 9.17746 14.4508 8.82583C14.8025 8.47419 15 7.99728 15 7.5C15 7.00272 14.8025 6.52581 14.4508 6.17417C14.0992 5.82254 13.6223 5.625 13.125 5.625Z" fill="#F9F1E4" />
                </svg>
                <p>Add List</p>
              </button>
            </div>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselBoard;