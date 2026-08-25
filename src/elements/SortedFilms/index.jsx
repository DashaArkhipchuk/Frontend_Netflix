import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import Card from '../Card';
import { Link } from 'react-router-dom';
import { ConfigProvider, Pagination } from 'antd';

const SortedFilms = ({ films, selectedGenres, sortType, sortYear, rating }) => {
    const [theContent, setTheContent] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const take = 20;

    const fetchFilms = async (page) => {
        const genreArray = selectedGenres.length > 0 ? selectedGenres : [];
        const skip = (page - 1) * take;

        // const cacheKey = `${films}_${selectedGenres.join('_')}_${sortType || 'none'}_${sortYear || 'none'}_${rating || 0}_page_${page}`;
        // const cachedData = localStorage.getItem(cacheKey);

        // if (cachedData) {
        //     const parsed = JSON.parse(cachedData);
        //     setTheContent(parsed.items);
        //     setTotalItems(parsed.totalItems);
        //     console.log("Loaded from cache:", cacheKey);
        //     return;
        // }

        try {
            const body = {
                genre: genreArray,
                sortByLatest: sortType === "latest" ? true : false,
                year: sortType === "year" ? sortYear : null,
                minimumRating: rating || 0
            };

            const rawResponse = await fetch(`https://localhost:7118/api/${films}/GetAll?take=${take}&skip=${skip}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const text = await rawResponse.text();
            const data = JSON.parse(text);
            const fetchedFilms = data.items;
            const total = data.totalCount ?? 100;

            //localStorage.setItem(cacheKey, JSON.stringify({ items: fetchedFilms, totalItems: total }));

            setTheContent(fetchedFilms);
            setTotalItems(total);

        } catch (error) {
            console.error("Error fetching or parsing data:", error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchFilms(1);
    }, [films, selectedGenres, sortType, sortYear, rating]); // <-- listen to all filters

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchFilms(page);
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Pagination: {
                            itemBg: '#262425',
                            itemActiveBg: '#800020',
                            colorBorder: '#800020',
                            colorText: '#F9F1E4',
                            colorTextHover: '#F9F1E4',
                            colorTextActive: '#F9F1E4',
                            itemHoverBg: '#800020',
                        },
                    },
                }}
            >
                <div className={style.container}>
                    {theContent.map((item) => (
                        <Link to={`/${films}/${item.id}`} key={item.id} className={style.link}>
                            <Card
                                films={films}
                                title={item.name}
                                picture={item.pictureUrl}
                                year={item.releaseYear}
                                rating={item.rating}
                            />
                        </Link>
                    ))}
                </div>
                <Pagination
                    pageSize={take}
                    current={currentPage}
                    total={totalItems}
                    onChange={handlePageChange}
                    showQuickJumper
                    showSizeChanger={false}
                    className={style.pagination}
                />
            </ConfigProvider>
        </>
    );
};

export default SortedFilms;
