import style from './style.module.scss'

const NewsCard = ({ title, content, picture }) => {
    return (
        <>
            <div className={style.container}>
                <div className={style.flexContainer}>
                    <img src={picture} alt={title} className={style.img} />
                    <div className={style.cardDetails}>
                        <p className={style.title}>{title}</p>
                        <p className={style.content}>{content}</p>
                        <button className={style.moreButton}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.5625 5.25L19.3125 12L12.5625 18.75M18.375 12L4.6875 12" stroke="#800020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Read More
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewsCard;