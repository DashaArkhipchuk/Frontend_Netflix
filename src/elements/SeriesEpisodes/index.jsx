import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import Header from '../../elements/Header';
import { LoadingOutlined } from '@ant-design/icons';
import { ConfigProvider, Select, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;

const SeriesEpisodes = ({ id }) => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchMovieData = async () => {
        try {
            const response = await axios.get(`https://localhost:7118/api/Series/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            const data = response.data;
            setMovie(data);
            setSelectedSeason(data.seriesEpisodes[0]?.seasonNumber);
            setSelectedEpisode(data.seriesEpisodes[0]);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovieData();
    }, [id]);

    useEffect(() => {
        if (movie && movie.seriesEpisodes.length > 0) {
            if (selectedSeason === null) {
                setSelectedSeason(movie.seriesEpisodes[0].seasonNumber);
            }
            const firstEpisodeInSeason = movie.seriesEpisodes.find(episode => episode.seasonNumber === selectedSeason);
            setSelectedEpisode(firstEpisodeInSeason);
        }
    }, [movie, selectedSeason]);

    if (loading) return <Spin indicator={<LoadingOutlined spin />} size="large" />;
    if (error) return <p>{error}</p>;

    const formatReleaseDate = (releaseDate) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(releaseDate).toLocaleDateString('en-US', options);
    };

    if (!movie || !movie.seriesEpisodes || movie.seriesEpisodes.length === 0) {
        return <p>Loading...</p>;
    }

    const seasons = [...new Set(movie.seriesEpisodes.map(episode => episode.seasonNumber))];

    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber);

        const firstEpisodeInSeason = movie.seriesEpisodes.find(episode => episode.seasonNumber === seasonNumber);
        setSelectedEpisode(firstEpisodeInSeason || null);

        // console.log("Selected Season:", seasonNumber);
    };

    const handleEpisodeChange = (episodeId) => {
        const episode = movie.seriesEpisodes.find(ep => ep.episodeId === episodeId);
        setSelectedEpisode(episode);

        // console.log("Selected Episode ID:", episodeId);
    };

    const filteredEpisodes = movie.seriesEpisodes.filter(episode => episode.seasonNumber === selectedSeason);
    // console.log("Selected Episode Video URL: ", selectedEpisode?.videoURL);
    return (
        <>

            <div className={style.episodeSelector}>
                <h2 className={style.episodesTitle}>Episodes</h2>

                <ConfigProvider theme={{
                    token: {
                        colorPrimary: '#800020',
                        colorBgBase: '#1f1f1f',
                        colorTextBase: '#ffffff',
                    },
                }}>
                    <div className={style.selectContainer}>
                        <Select
                            onChange={handleSeasonChange}
                            value={selectedSeason || undefined}
                            placeholder="Select Season"
                            style={{ width: '100%', margin: '16px' }}
                        >
                            {seasons.map(season => (
                                <Option key={season} value={season}>
                                    Season {season}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            onChange={handleEpisodeChange}
                            value={selectedEpisode?.episodeId || undefined}
                            placeholder="Select Episode"
                            style={{ width: '100%', margin: '16px' }}
                        >
                            {filteredEpisodes.map(episode => (
                                <Option key={episode.episodeId} value={episode.episodeId}>
                                    {/* {episode.episodeName} (S{episode.seasonNumber}E {episode.episodeNumberInSeason}) */}
                                    Episode {episode.episodeNumberInSeason}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </ConfigProvider>

                <div className={style.episodeDetailsContainer}>
                    {selectedEpisode && (
                        <div className={style.episodeDetails}>
                            <img src={selectedEpisode.pictureURL} alt={selectedEpisode.episodeName} className={style.episodeImage} />
                        </div>
                    )}
                    <div className={style.videoContainer}>
                        <h3>{selectedEpisode.episodeName}</h3>
                        <video key={selectedEpisode?.episodeId} className={style.videoPlayer} controls>
                            <source src={selectedEpisode.videoURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SeriesEpisodes;
