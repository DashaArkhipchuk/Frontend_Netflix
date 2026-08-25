import React, { act, useState, useEffect } from 'react';
import { ConfigProvider, Tabs } from 'antd';
import style from './style.module.scss';
import SortedFilms from '../SortedFilms';
import CarouselGenres from '../CarouselGenres';
import FilmsFilterControls from '../FilmsFilterControls';
import { useNavigate, useParams } from 'react-router-dom';

const MovieIcon = () => (
    <svg className={style.icon} width="17" height="17" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.0282 1.125H21.375C22.0736 1.125 22.7419 1.25325 23.3595 1.48725L16.9718 7.875H12.2782L19.0282 1.125ZM27 7.875V6.75C27 5.175 26.3486 3.7485 25.3013 2.727L20.1532 7.875H27ZM11.8373 1.125L4.99275 7.875H9.09675L15.8468 1.125H11.8373ZM1.78875 7.875L8.63325 1.125H5.625C2.52338 1.125 0 3.64838 0 6.75V7.875H1.78875ZM27 10.125V20.25C27 23.3516 24.4766 25.875 21.375 25.875H5.625C2.52338 25.875 0 23.3516 0 20.25V10.125H27ZM16.9279 17.1L11.7146 14.31C11.0149 13.8904 10.125 14.3944 10.125 15.21V20.7911C10.125 21.6068 11.0149 22.1108 11.7146 21.6911L16.9279 18.9011C17.6074 18.4939 17.6074 17.5084 16.9279 17.1011V17.1Z" fill="#F9F1E4" />
    </svg>
);

const SeriesIcon = () => (
    <svg className={style.icon} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_76_1592)">
            <path d="M0.708333 5.66697C0.31875 5.66697 0 5.34822 0 4.95864V3.54197C0 1.58697 1.58667 0.000305988 3.54167 0.000305988H4.95833C5.34792 0.000305988 5.66667 0.319056 5.66667 0.708639C5.66667 1.09822 5.34792 1.41697 4.95833 1.41697H3.54167C2.37292 1.41697 1.41667 2.37322 1.41667 3.54197V4.95864C1.41667 5.34822 1.09792 5.66697 0.708333 5.66697ZM5.66667 16.292C5.66667 15.9024 5.34792 15.5836 4.95833 15.5836H3.54167C2.37292 15.5836 1.41667 14.6274 1.41667 13.4586V12.042C1.41667 11.6524 1.09792 11.3336 0.708333 11.3336C0.31875 11.3336 0 11.6524 0 12.042V13.4586C0 15.4136 1.58667 17.0003 3.54167 17.0003H4.95833C5.34792 17.0003 5.66667 16.6816 5.66667 16.292ZM17 13.4586V12.042C17 11.6524 16.6812 11.3336 16.2917 11.3336C15.9021 11.3336 15.5833 11.6524 15.5833 12.042V13.4586C15.5833 14.6274 14.6271 15.5836 13.4583 15.5836H12.0417C11.6521 15.5836 11.3333 15.9024 11.3333 16.292C11.3333 16.6816 11.6521 17.0003 12.0417 17.0003H13.4583C15.4133 17.0003 17 15.4136 17 13.4586ZM6.74333 12.1766L8.5 11.0007L10.285 12.1624C10.5188 12.3111 10.8162 12.3041 11.0358 12.1341C11.2554 11.9641 11.3404 11.6807 11.2554 11.4186L10.6179 9.48489L12.155 8.23114C12.3604 8.05406 12.4383 7.77072 12.3462 7.50864C12.2542 7.24656 12.0062 7.08364 11.7371 7.08364H9.78917L9.10208 5.23489C9.01 4.97989 8.76208 4.80989 8.49292 4.80989C8.22375 4.80989 7.97583 4.97989 7.88375 5.23489L7.19667 7.08364H5.24875C4.97958 7.08364 4.73167 7.25364 4.63958 7.50864C4.5475 7.76364 4.61833 8.05406 4.83083 8.22406L6.375 9.47781L5.76583 11.4328C5.68083 11.6949 5.77292 11.9853 5.9925 12.1482C6.10583 12.2332 6.2475 12.2757 6.38208 12.2757C6.50958 12.2757 6.63708 12.2403 6.74333 12.1695V12.1766ZM13.8692 4.80989L16.3767 3.55614C16.7663 3.32947 17 2.92572 17 2.47947C17 2.03322 16.7662 1.62947 16.3412 1.38864L13.8975 0.163223C13.5079 -0.0563607 13.0475 -0.0563607 12.6579 0.163223C12.2683 0.389889 12.0417 0.786556 12.0417 1.23989V3.71197C12.0417 4.15822 12.2754 4.56197 12.6579 4.78864C12.8562 4.90197 13.0758 4.95864 13.2883 4.95864C13.5008 4.95864 13.6921 4.90906 13.8621 4.80989H13.8692Z" fill="#B0A9A0" />
        </g>
        <defs>
            <clipPath id="clip0_76_1592">
                <rect width="17" height="17" fill="white" />
            </clipPath>
        </defs>
    </svg>

);
const DoramsIcon = () => (
    <svg className={style.icon} width="17" height="17" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_76_1596)">
            <path d="M14.6513 7.51333C14.4991 5.66729 13.6656 3.94389 12.313 2.67839C10.9604 1.4129 9.18541 0.695823 7.33333 0.666667V0H4C3.46957 0 2.96086 0.210714 2.58579 0.585786C2.21071 0.960859 2 1.46957 2 2V3.33333H4V4.66667H2V6H4V7.33333H2V8.66667H4V10H2V11.3333H4V12.6667H2V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H7.33333V15.3333C8.33627 15.3317 9.32829 15.1251 10.2485 14.7263C11.1687 14.3275 11.9978 13.7448 12.6847 13.014C13.3747 12.2827 13.9057 11.4164 14.2442 10.4697C14.5827 9.52294 14.7213 8.51633 14.6513 7.51333ZM7.33333 10.6667H6.66667V5.33333H7.33333C8.04058 5.33333 8.71885 5.61428 9.21895 6.11438C9.71905 6.61448 10 7.29276 10 8C10 8.70724 9.71905 9.38552 9.21895 9.88562C8.71885 10.3857 8.04058 10.6667 7.33333 10.6667Z" fill="#B0A9A0" />
        </g>
        <defs>
            <clipPath id="clip0_76_1596">
                <rect width="16" height="16" fill="white" />
            </clipPath>
        </defs>
    </svg>
);
const AnimeIcon = () => (
    <svg className={style.icon} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_76_1604)">
            <path d="M8.50033 0C4.59458 0 1.41699 3.17758 1.41699 7.08333V16.2917C1.41699 16.6366 1.66562 16.9313 2.00562 16.9901C2.34491 17.0467 2.67783 16.8527 2.79328 16.5275C2.98028 15.9977 3.61991 15.5833 4.25033 15.5833C4.88074 15.5833 5.52037 15.9977 5.70737 16.5275C5.80724 16.8109 6.07499 17 6.37533 17C6.67566 17 6.94341 16.8109 7.04328 16.5275C7.23028 15.9977 7.86991 15.5833 8.50033 15.5833C9.13074 15.5833 9.77037 15.9977 9.95737 16.5275C10.0572 16.8109 10.325 17 10.6253 17C10.9257 17 11.1934 16.8109 11.2933 16.5275C11.4803 15.9977 12.1199 15.5833 12.7503 15.5833C13.3807 15.5833 14.0204 15.9977 14.2074 16.5275C14.3087 16.8144 14.5792 17 14.8746 17C14.9143 17 14.9547 16.9972 14.9943 16.9901C15.3343 16.9313 15.583 16.6366 15.583 16.2917V7.08333C15.5837 3.17758 12.4061 0 8.50033 0ZM6.02116 8.5C5.43466 8.5 4.95866 8.024 4.95866 7.4375C4.95866 6.851 5.43466 6.375 6.02116 6.375C6.60766 6.375 7.08366 6.851 7.08366 7.4375C7.08366 8.024 6.60766 8.5 6.02116 8.5ZM10.9795 8.5C10.393 8.5 9.91699 8.024 9.91699 7.4375C9.91699 6.851 10.393 6.375 10.9795 6.375C11.566 6.375 12.042 6.851 12.042 7.4375C12.042 8.024 11.566 8.5 10.9795 8.5Z" fill="#B0A9A0" />
        </g>
        <defs>
            <clipPath id="clip0_76_1604">
                <rect width="17" height="17" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const CartoonIcon = () => (
    <svg className={style.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_76_1600)">
            <path d="M14.2573 6.72534L15.986 0.500669C16.0333 0.328003 15.9586 0.144669 15.804 0.0546694C15.6153 -0.0559973 15.3733 0.00733604 15.2626 0.195336L12.134 5.54C11.666 5.406 11.172 5.33467 10.662 5.33467C9.99931 5.33467 9.54464 5.33467 9.53264 5.33534H9.53131C7.38398 5.39067 5.18731 6.68934 3.76131 7.848C3.31931 8.20667 2.65931 7.89267 2.65931 7.32334V7.306C2.65931 7.10067 2.74598 6.90934 2.89864 6.77867C3.28198 6.45134 3.72331 6.18134 4.19864 5.866C4.22064 5.714 4.24398 5.56267 4.26931 5.41134L4.57998 3.568C6.03731 3.19067 7.16598 1.92134 7.33264 0.390003C7.35598 0.174003 7.18198 -0.0139973 6.96464 2.70887e-06C4.48864 0.162003 3.66598 1.85 3.66598 1.85C3.66598 1.85 2.81264 0.154003 0.348643 2.70887e-06C0.148643 -0.012664 -0.0193565 0.156003 0.000643473 0.355336C0.135977 1.716 1.02931 2.876 2.23798 3.392L1.90264 3.89467C0.66131 5.75734 -0.00068986 7.94533 -0.00068986 10.1833C-0.00068986 13.3953 2.60331 16 5.81598 16H10.59C13.5806 16 16.0466 13.5727 16 10.582C15.976 9.05467 15.3086 7.68334 14.258 6.726L14.2573 6.72534ZM11.6666 11.9993C11.1146 11.9993 10.6666 11.5513 10.6666 10.9993C10.6666 10.4473 11.1146 9.99934 11.6666 9.99934C12.2186 9.99934 12.6666 10.4473 12.6666 10.9993C12.6666 11.5513 12.2186 11.9993 11.6666 11.9993Z" fill="#B0A9A0" />
        </g>
        <defs>
            <clipPath id="clip0_76_1600">
                <rect width="16" height="16" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const tabMap = {
    films: { key: 'movie', label: 'Movie', icon: <MovieIcon />, genre: 'Film' },
    series: { key: 'series', label: 'Series', icon: <SeriesIcon />, genre: 'Series' },
    dorams: { key: 'dorams', label: 'Dorams', icon: <DoramsIcon />, genre: 'Dorama' },
    anime: { key: 'anime', label: 'Anime', icon: <AnimeIcon />, genre: 'Anime' },
    cartoons: { key: 'cartoons', label: 'Cartoons', icon: <CartoonIcon />, genre: 'Cartoon' },
};

const GenreTabs = () => {
    const navigate = useNavigate();
    const { tab } = useParams(); // /home/:tab
    const normalizedTab = tab?.toLowerCase() || "movie";

    const [activeTab, setActiveTab] = useState(tab || 'films');

    const [sortType, setSortType] = useState(null);
    const [sortYear, setSortYear] = useState(null);
    const [rating, setRating] = useState(0);
    const [selectedGenres, setSelectedGenres] = useState(() => {
        const saved = sessionStorage.getItem('selectedGenres');
        return saved ? JSON.parse(saved) : [];
    });

    const [initialized, setInitialized] = useState(false);

    
    // Update active tab when URL changes
    useEffect(() => {
        if (normalizedTab && tabMap[normalizedTab]) setActiveTab(normalizedTab);
        localStorage.setItem("lastTab", normalizedTab);
    }, [normalizedTab]);

    // Load filters from sessionStorage on mount
    useEffect(() => {
        const savedFilters = JSON.parse(sessionStorage.getItem('filmFilters'));
        if (savedFilters) {
            setSortType(savedFilters.sortType || null);
            setSortYear(savedFilters.sortYear || null);
            setRating(savedFilters.rating || 0);
            setSelectedGenres(savedFilters.selectedGenres || []);
            setActiveTab(savedFilters.activeTab || '1');
        }
        setInitialized(true); // mark that initial load is complete
    }, []);

    // Save filters to sessionStorage only after initial load
    useEffect(() => {
        if (!initialized) return; // skip the first render
        const filtersToSave = { sortType, sortYear, rating, selectedGenres, activeTab };
        sessionStorage.setItem('filmFilters', JSON.stringify(filtersToSave));
    }, [sortType, sortYear, rating, selectedGenres, activeTab, initialized]);

    const handleTabChange = (key) => {
        setActiveTab(key);
        setSelectedGenres([]);
        setSortType(null);
        setSortYear(null);
        setRating(0);
        navigate(`/home/${key}`); // update URL
    };

    const handleGenreChange = (genres) => {
        setSelectedGenres(genres);
        sessionStorage.setItem('selectedGenres', JSON.stringify(genres));
    };

    console.log("Selected Genres in Tabs: ", selectedGenres);

    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#800020',
                colorBgBase: '#1f1f1f',
            },
        }}>
            <Tabs activeKey={activeTab} tabBarStyle={{ borderBottom: 'none' }} onChange={handleTabChange} className={style.tabsContainer}>
                {Object.values(tabMap).map((tabItem) => (
                    <Tabs.TabPane
                        tab={
                            <span className={activeTab === tabItem.key ? style.activeTab : ''}>
                                <div className={style.tabs}>
                                    {tabItem.icon}
                                    <p>{tabItem.label}</p>
                                </div>
                            </span>
                        }
                        key={tabItem.key}
                    >
                        <CarouselGenres selectedGenres={selectedGenres} onGenreChange={setSelectedGenres} />
                        <FilmsFilterControls sortType={sortType} sortYear={sortYear} rating={rating} onChange={({ sortType, sortYear, rating }) => { setSortType(sortType); setSortYear(sortYear); setRating(rating); }} />
                        <SortedFilms selectedGenres={selectedGenres} films={tabItem.genre} sortType={sortType} sortYear={sortYear} rating={rating} />
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </ConfigProvider>
    );
};

export default GenreTabs;
