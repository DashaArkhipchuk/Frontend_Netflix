import style from './style.module.scss'

const TopNewsItem = ({title, author, publishedDate, imageURL}) => {
    const formatDateToShort = (isoDateString) => {
        const date = new Date(isoDateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };

    return (
        <>
            <div className={style.topNewsItem}>
                <div className={style.itemInfo}>
                    <p className={style.itemTitle}>{title}</p>
                    <div className={style.itemPublishingInfo}>
                        <p className={style.itemDateOfPublishing}>{formatDateToShort(publishedDate)}</p>
                        <p className={style.itemAuthor}>By {author}</p>
                    </div>
                    <button className={style.itemReadMoreButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5625 5.25L19.3125 12L12.5625 18.75M18.375 12L4.6875 12" stroke="#f9f1e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Read more
                    </button>
                </div>
                <img src={imageURL} alt={title} className={style.newsImg} />
            </div>
        </>
    )
}

export default TopNewsItem