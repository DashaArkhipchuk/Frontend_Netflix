import React, { useEffect, useState } from 'react';
import style from './style.module.scss';

const CarouselGenres = ({ selectedGenres, onGenreChange, itemsToShow = 10 }) => {
    const [genres, setGenres] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch genres from API or localStorage
    useEffect(() => {
        const cachedGenres = localStorage.getItem('genres');
        if (cachedGenres) {
            setGenres(JSON.parse(cachedGenres));
        } else {
            const fetchGenres = async () => {
                try {
                    const response = await fetch(`https://localhost:7118/api/Genre/GetAll`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({}),
                    });
                    const data = await response.json();
                    if (Array.isArray(data.content)) {
                        setGenres(data.content);
                        localStorage.setItem('genres', JSON.stringify(data.content));
                    }
                } catch (error) {
                    console.error('Error fetching genres:', error);
                }
            };
            fetchGenres();
        }
    }, []);

    const nextSlide = () => {
        if (currentIndex < genres.length - itemsToShow) setCurrentIndex(currentIndex + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const toggleGenre = (genreName) => {
        const updated = selectedGenres.includes(genreName)
            ? selectedGenres.filter((g) => g !== genreName)
            : [...selectedGenres, genreName];
        onGenreChange(updated);
        sessionStorage.setItem('selectedGenres', JSON.stringify(updated)); // persist
    };

    return (
        <div className={style.carouselContainer}>
            <button onClick={prevSlide} disabled={currentIndex === 0} className={style.arrow}>
                &lt;
            </button>
            <div className={style.carousel}>
                {genres.slice(currentIndex, currentIndex + itemsToShow).map((genre) => (
                    <div
                        key={genre.id}
                        className={`${style.carouselItem} ${
                            selectedGenres.includes(genre.genreName) ? style.selected : ''
                        }`}
                        onClick={() => toggleGenre(genre.genreName)}
                    >
                        <p className={style.carouselItemTitle}>{genre.genreName}</p>
                    </div>
                ))}
            </div>
            <button
                onClick={nextSlide}
                disabled={currentIndex >= genres.length - itemsToShow}
                className={style.arrow}
            >
                &gt;
            </button>
        </div>
    );
};

export default CarouselGenres;
