import 'bootstrap/dist/css/bootstrap.css';
import style from '../NewsPage/style.module.scss';
import NewsCard from '../../elements/NewsCard';
import CarouselBoardNews from '../../elements/CarouselBoardNews';
import Header from '../../elements/Header';
import axios from 'axios';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Spin, Alert, ConfigProvider, Pagination, Badge } from 'antd';

const API_BASE = 'https://localhost:7118/api/News';
const PAGE_SIZE = 10;

const themeTokens = {
    colorPrimary: '#800020',
    colorBgBase: '#1f1f1f',
    colorTextBase: '#ffffff',
};

const NewsPage = () => {
    // --- sidebar categories (NewsType) ---
    const [types, setTypes] = useState([]);
    const [typesLoading, setTypesLoading] = useState(true);
    const [selectedTypeId, setSelectedTypeId] = useState(null); // null = "All"

    // --- main news grid, paginated ---
    const [news, setNews] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1); // antd Pagination is 1-indexed
    const [sortBy, setSortBy] = useState('Latest'); // Latest | MostViewed | TitleAsc
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- carousel: top viewed articles, fetched independently of grid filters ---
    const [featured, setFeatured] = useState([]);
    const [featuredLoading, setFeaturedLoading] = useState(true);

    const fetchAbortRef = useRef(null);

    // Sidebar — loaded once, doesn't depend on any other filter state.
    useEffect(() => {
        const controller = new AbortController();

        axios.get(`${API_BASE}/Types`, { signal: controller.signal })
            .then(res => setTypes(res.data ?? []))
            .catch(err => {
                if (!axios.isCancel(err)) console.error('Failed to load categories', err);
            })
            .finally(() => setTypesLoading(false));

        return () => controller.abort();
    }, []);

    // Carousel — top 3 most-viewed, independent of the grid's own sort/filter/pagination state
    // Copy the exact pattern from fetchNews
    useEffect(() => {
        const controller = new AbortController();

        axios.post(`${API_BASE}/GetAll`, null, {
            params: {
                Skip: 0,
                Take: 3,
                SortBy: 'MostViewed',
            },
            signal: controller.signal,
        })
            .then(res => {
                const items = res.data.items;
                console.log('Featured items:', items);
                setFeatured(items ?? []);
            })
            .catch(err => {
                if (!axios.isCancel(err)) {
                    console.error('Failed to load featured news', err);
                    // Log the full error for debugging
                    if (err.response) {
                        console.error('Error response:', err.response);
                    }
                }
            })
            .finally(() => setFeaturedLoading(false));

        return () => controller.abort();
    }, []);

    // GetAll takes Skip/Take/SortBy/TypeId/Search as QUERY PARAMS, not a JSON body.
    const fetchNews = useCallback(async (pageValue) => {
        if (fetchAbortRef.current) fetchAbortRef.current.abort();
        const controller = new AbortController();
        fetchAbortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE}/GetAll`, null, {
                params: {
                    Skip: (pageValue - 1) * PAGE_SIZE,
                    Take: PAGE_SIZE,
                    SortBy: sortBy,
                    ...(selectedTypeId ? { TypeId: selectedTypeId } : {}),
                },
                signal: controller.signal,
            });

            const { items, totalCount: total } = response.data;
            setNews(items ?? []);
            setTotalCount(total ?? 0);
        } catch (err) {
            if (axios.isCancel(err)) return; // superseded by a newer request — not a real error
            if (err.response) setError(err.response.data);
            else if (err.request) setError('No response received from the server.');
            else setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [sortBy, selectedTypeId]);

    // Category or sort changed — reset to page 1.
    useEffect(() => {
        setPage(1);
    }, [sortBy, selectedTypeId]);

    // Page (or the filters that reset it) changed — fetch.
    useEffect(() => {
        fetchNews(page);
        // scroll grid back into view when paging
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page, fetchNews]);

    const handlePageChange = (nextPage) => {
        setPage(nextPage);
    };

    return (
        <ConfigProvider theme={{ token: themeTokens }}>
            <div className="d-flex">
                <Header />
                <div className={style.content}>
                    {featuredLoading ? (
                        <Spin />
                    ) : (
                        <CarouselBoardNews
                            news1={featured[0]}
                            news2={featured[1]}
                            news3={featured[2]}
                        />
                    )}

                    <div className={style.body}>
                        {/* --- Category sidebar, mapped to NewsType from the backend --- */}
                        <aside className={style.sidebar}>
                            {typesLoading ? (
                                <Spin style={{ display: 'block', margin: '16px auto' }} />
                            ) : (
                                <ul className={style.typeList}>
                                    <li
                                        onClick={() => setSelectedTypeId(null)}
                                        className={`${style.typeItem} ${selectedTypeId === null ? style.typeItemActive : ''}`}
                                    >
                                        All News
                                    </li>
                                    {types.map(t => (
                                        <li
                                            key={t.id}
                                            onClick={() => setSelectedTypeId(t.id)}
                                            className={`${style.typeItem} ${selectedTypeId === t.id ? style.typeItemActive : ''}`}
                                        >
                                            <span>{t.name}</span>
                                            <Badge count={t.articleCount} style={{ backgroundColor: '#800020' }} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </aside>

                        {/* --- Main list --- */}
                        <div className={style.contentBlock}>
                            <div className={style.headerRow}>
                                <h1 className={style.newsTitle}>
                                    {selectedTypeId
                                        ? types.find(t => t.id === selectedTypeId)?.name ?? 'News'
                                        : 'News'}
                                </h1>

                                <Radio.Group
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Radio.Button value="Latest">Latest</Radio.Button>
                                    <Radio.Button value="MostViewed">Most Viewed</Radio.Button>
                                    <Radio.Button value="TitleAsc">Title A–Z</Radio.Button>
                                </Radio.Group>
                            </div>

                            {error && (
                                <Alert
                                    type="error"
                                    message="Failed to load news"
                                    description={typeof error === 'string' ? error : JSON.stringify(error)}
                                    style={{ marginBottom: '16px' }}
                                />
                            )}

                            {loading ? (
                                <div className={style.loadingWrap}>
                                    <Spin size="large" />
                                </div>
                            ) : (
                                <>
                                    <div className={style.newsList}>
                                        {news.map(item => (
                                            <Link to={`/news-details/${item.id}`} key={item.id} className={style.link}>
                                                <NewsCard
                                                    hoverable
                                                    picture={item.imageURL}
                                                    content={item.description}
                                                    title={item.title}
                                                >
                                                    <p>{item.description}</p>
                                                </NewsCard>
                                            </Link>
                                        ))}
                                    </div>

                                    {news.length === 0 && !error && (
                                        <Alert type="info" message="No articles found for this category." />
                                    )}

                                    {totalCount > 0 && (
                                        <div className={style.paginationWrap}>
                                            <Pagination
                                                pageSize={PAGE_SIZE}
                                                current={page}
                                                total={totalCount}
                                                onChange={handlePageChange}
                                                showQuickJumper
                                                showSizeChanger={false}
                                                className={style.pagination}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default NewsPage;