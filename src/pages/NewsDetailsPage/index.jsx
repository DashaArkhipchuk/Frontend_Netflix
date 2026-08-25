import style from './style.module.scss';
import Header from '../../elements/Header';
import TopNewsItem from '../../elements/TopNewsItem';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoIosArrowDropleftCircle } from 'react-icons/io';
import { Spin, Alert, Button } from 'antd';

const API_BASE = 'https://localhost:7118/api/News';
const RELATED_PAGE_SIZE = 5;

const NewsDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- main article ---
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- related news (paginated) ---
    const [related, setRelated] = useState([]);
    const [relatedTotal, setRelatedTotal] = useState(0);
    const [relatedSkip, setRelatedSkip] = useState(0);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [relatedLoadingMore, setRelatedLoadingMore] = useState(false);
    const [relatedError, setRelatedError] = useState(null);

    // Fetch the article itself whenever the id changes.
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        axios.get(`${API_BASE}/${id}`, { signal: controller.signal })
            .then(res => setNewsItem(res.data))
            .catch(err => {
                if (axios.isCancel(err)) return;
                if (err.response) setError(err.response.data);
                else if (err.request) setError('No response received from the server.');
                else setError(err.message);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [id]);

    const fetchRelated = useCallback(async (skipValue, append) => {
        append ? setRelatedLoadingMore(true) : setRelatedLoading(true);
        setRelatedError(null);

        try {
            const res = await axios.get(`${API_BASE}/${id}/Related`, {
                params: { skip: skipValue, take: RELATED_PAGE_SIZE },
            });
            const { items, totalCount } = res.data;
            setRelated(prev => (append ? [...prev, ...(items ?? [])] : (items ?? [])));
            setRelatedTotal(totalCount ?? 0);
        } catch (err) {
            if (err.response) setRelatedError(err.response.data);
            else if (err.request) setRelatedError('No response received from the server.');
            else setRelatedError(err.message);
        } finally {
            setRelatedLoading(false);
            setRelatedLoadingMore(false);
        }
    }, [id]);

    // Reset and refetch related news whenever we navigate to a different article.
    useEffect(() => {
        setRelated([]);
        setRelatedSkip(0);
        fetchRelated(0, false);
        window.scrollTo({ top: 0 });
    }, [id, fetchRelated]);

    const handleLoadMoreRelated = () => {
        const nextSkip = relatedSkip + RELATED_PAGE_SIZE;
        setRelatedSkip(nextSkip);
        fetchRelated(nextSkip, true);
    };

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    };

    const handleBack = () => {
        navigate('/news');
    };

    if (loading) {
        return (
            <div className="d-flex">
                <Header />
                <div className={style.content}>
                    <div className={style.loadingWrap}>
                        <Spin size="large" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !newsItem) {
        return (
            <div className="d-flex">
                <Header />
                <div className={style.content}>
                    <IoIosArrowDropleftCircle className={style.arrowBack} onClick={handleBack} />
                    <Alert
                        type="error"
                        message="Failed to load article"
                        description={typeof error === 'string' ? error : JSON.stringify(error) || 'Article not found.'}
                        style={{ margin: '2rem 3rem' }}
                    />
                </div>
            </div>
        );
    }

    const hasMoreRelated = related.length < relatedTotal;

    return (
        <div className="d-flex">
            <Header />
            <div className={style.content}>
                <IoIosArrowDropleftCircle
                    className={style.arrowBack}
                    onClick={handleBack}
                />
                <div className={style.container}>
                    <div className={style.newsDetails}>
                        <h1 className={style.title}>{newsItem.title}</h1>
                        <div className={style.publishingInfo}>
                            <p className={style.author}>
                                By {newsItem.authors?.length ? newsItem.authors.join(', ') : 'Unknown'}
                            </p>
                            <p className={style.dateOfPublishing}>
                                Published on {formatDate(newsItem.publishedDate)}
                            </p>
                        </div>
                        <img src={newsItem.imageURL} alt={newsItem.title} className={style.img} />
                        <div className={style.articleText}>
                            {newsItem.articleText
                                ?.split(/\n+/)
                                .filter(paragraph => paragraph.trim().length > 0)
                                .map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                        </div>
                    </div>

                    <div className={style.topNewsContainer}>
                        <h2>Top News</h2>

                        {relatedError && (
                            <Alert
                                type="error"
                                message="Failed to load related news"
                                description={typeof relatedError === 'string' ? relatedError : JSON.stringify(relatedError)}
                                style={{ marginBottom: '16px' }}
                            />
                        )}

                        {relatedLoading ? (
                            <Spin style={{ display: 'block', margin: '16px auto' }} />
                        ) : (
                            <>
                                <div className={style.topNews}>
                                    {related.map((item) => (
                                        <div
                                            key={item.id}
                                            className={style.topNewsLink}
                                            onClick={() => navigate(`/news-details/${item.id}`)}
                                        >
                                            <TopNewsItem
                                                title={item.title}
                                                author={item.authors?.length ? item.authors.join(', ') : 'Unknown'}
                                                publishedDate={formatDate(item.publishedDate)}
                                                imageURL={item.imageURL}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {related.length === 0 && !relatedError && (
                                    <p className={style.noRelated}>No related news found.</p>
                                )}

                                {hasMoreRelated && (
                                    <Button
                                        type="default"
                                        loading={relatedLoadingMore}
                                        onClick={handleLoadMoreRelated}
                                        className={style.loadMoreBtn}
                                    >
                                        Load more ({related.length} of {relatedTotal})
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailsPage;