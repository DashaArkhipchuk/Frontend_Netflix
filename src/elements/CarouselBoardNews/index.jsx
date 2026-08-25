import React from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';

const CarouselBoard = ({ news1, news2, news3 }) => {
  const navigate = useNavigate();
  const newsItems = [news1, news2, news3].filter(item => item && item.id);

  if (newsItems.length === 0) {
    return <div className={style.noNews}>No featured news available</div>;
  }

  const handleReadMore = (id) => {
    navigate(`/news-details/${id}`);
  };

  return (
    <Carousel autoplay>
      {newsItems.map((item) => (
        <div 
          key={item.id} 
          className={style.slideContainer}
          onClick={() => handleReadMore(item.id)}
          style={{ cursor: 'pointer' }}
        >
          <div className={style.contentArea}>
            <img 
              src={item.imageURL} 
              alt={item.title}
              className={style.newsImage}
              loading="lazy"
            />
            <div className={style.overlay}>
              <h1 className={style.newsTitle}>{item.title}</h1>
              <p className={style.newsContext}>
                {item.description && item.description.length > 150 
                  ? `${item.description.substring(0, 150)}...` 
                  : item.description}
              </p>
              <button 
                className={style.readMore}
                onClick={(e) => {
                  e.stopPropagation(); // Prevents double navigation
                  handleReadMore(item.id);
                }}
              >
                Read More →
              </button>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselBoard;