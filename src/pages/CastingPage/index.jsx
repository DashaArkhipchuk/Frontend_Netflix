import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { Checkbox, ConfigProvider, Tabs, Pagination } from 'antd';
import BurgerMenu from '../../elements/BurgerMenu';
import UserModal from '../../elements/UserModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CastingCard from '../../elements/CastingCard';
import CastingTabs from '../../elements/CastingTabs';
import CastingFilters from '../../elements/CastingFilters';
import useRequireRole from '../../tools/useRequireRole';
import { useAuth } from '../../elements/AuthProvider';
import { handleApiError } from '../../tools/handleApiError';
import { useError } from '../../tools/errorContext';

const CastingPage = () => {
    useRequireRole({ requireActorOrDirector: true });
    const { addError } = useError();

    const navigate = useNavigate();
    const handleToLogin = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const [activeTab, setActiveTab] = useState('1');
    const [castingCalls, setCastingCalls] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const take = 10;

    const [locations, setLocations] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [roleTypes, setRoleTypes] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
    const [selectedProjectTypes, setSelectedProjectTypes] = useState([]);
    const [selectedRoleTypes, setSelectedRoleTypes] = useState([]);

    const { isActor, isDirector } = useAuth();
    const [actorSubmissions, setActorSubmissions] = useState([]);
    const [actorSubmissionsTotal, setActorSubmissionsTotal] = useState(0);
    const [directorCastings, setDirectorCastings] = useState([]);
    const [directorCastingsTotal, setDirectorCastingsTotal] = useState(0);
    const [tab2Page, setTab2Page] = useState(1);

    // Fetch actor submissions (tab 2, actor)
    const fetchActorSubmissions = async (page = 1) => {
        const skip = (page - 1) * take;
        try {
            const response = await axios.post(
                `https://localhost:7118/api/CastingCalls/GetCastingCallsWithSubmissionsByAuthenticatedActorId?Skip=${skip}&Take=${take}`,
                {
                    locations: selectedLocations,
                    playableAgeRanges: selectedAgeRanges.length === ageRanges.length ? [] : selectedAgeRanges,
                    projectTypes: selectedProjectTypes,
                    roleTypes: selectedRoleTypes,
                }
            );
            setActorSubmissions(response.data.items);
            setActorSubmissionsTotal(response.data.totalCount);
        } catch (error) {
            handleApiError(error, addError);
        }
    };

    // Fetch director's own castings (tab 2, director)
    const fetchDirectorCastings = async (page = 1, filters = {}) => {
        const skip = (page - 1) * take;
        const {
            locations: locs = selectedLocations,
            ageRanges: ages = selectedAgeRanges,
            projectTypes: pts = selectedProjectTypes,
            roleTypes: rts = selectedRoleTypes,
        } = filters;

        try {
            const response = await axios.post(
                `https://localhost:7118/api/CastingCalls/GetCastingCallsByAuthenticatedCastingDirectorId?take=${take}&skip=${skip}`,
                {
                    locations: locs,
                    playableAgeRanges: ages.length === ageRanges.length ? [] : ages,
                    projectTypes: pts,
                    roleTypes: rts,
                }
            );
            setDirectorCastings(response.data.items);
            setDirectorCastingsTotal(response.data.totalCount);
        } catch (error) {
            handleApiError(error, addError);
        }
    };

    // Trigger tab 2 fetch when switching tabs
    useEffect(() => {
        if (activeTab === '2' && isActor) {
        setTab2Page(1);
        fetchActorSubmissions(1);
    }
    if (activeTab === '3' && isDirector) {
        setTab2Page(1);
        fetchDirectorCastings(1);
    }
}, [activeTab]);

    // Re-fetch director tab 2 when filters change
    useEffect(() => {
        if (activeTab === '3' && isDirector) {
            setTab2Page(1);
            fetchDirectorCastings(1);
        }
    }, [selectedLocations, selectedAgeRanges, selectedProjectTypes, selectedRoleTypes]);

    const handleTab2PageChange = (page) => {
        setTab2Page(page);
        if (activeTab === '2' && isActor) fetchActorSubmissions(page);
    if (activeTab === '3' && isDirector) fetchDirectorCastings(page);
    };

    const ageRanges = ['Under 18', '18-25', '26-32', '33-54', '55-64', '65+'];

    useEffect(() => {
        const fetchRegionsAndLocations = async () => {
            try {
                const regionsResponse = await axios.get(
                    'https://localhost:7118/api/Location/GetAllRegionNames'
                );
                const regions = regionsResponse.data;

                const regionData = await Promise.all(
                    regions.map(async (region) => {
                        const locationsResponse = await axios.post(
                            `https://localhost:7118/api/Location/GetLocations/${encodeURIComponent(region)}`
                        );
                        const locations = locationsResponse.data.map(
                            (loc) => `${loc.locationName}, ${region}`
                        );

                        return {
                            name: region,
                            subLocations: locations,
                        };
                    })
                );

                setLocations(regionData);
            } catch (error) {
                handleApiError(error, addError);
            }
        };

        fetchRegionsAndLocations();
    }, []);

    useEffect(() => {
        const fetchProjectTypes = async () => {
            try {
                const response = await axios.get('https://localhost:7118/api/ProjectType/GetAll');
                setProjectTypes(response.data);
            } catch (error) {
                handleApiError(error, addError);
            }
        };
        fetchProjectTypes();
    }, []);

    useEffect(() => {
        const fetchRoleTypes = async () => {
            try {
                const response = await axios.get('https://localhost:7118/api/RoleType/GetAll');
                setRoleTypes(response.data);
            } catch (error) {
                handleApiError(error, addError);
            }
        };
        fetchRoleTypes();
    }, []);

    const fetchData = async (page, filters = {}) => {
        const skip = (page - 1) * take;
        const {
            locations = selectedLocations,
            ageRanges: ages = selectedAgeRanges,
            projectTypes = selectedProjectTypes,
            roleTypes = selectedRoleTypes,
        } = filters;

        try {
            const response = await axios.post(
                `https://localhost:7118/api/CastingCalls/GetAll?take=${take}&skip=${skip}`,
                {
                    locations,
                    playableAgeRanges: ages.length === ageRanges.length ? [] : ages,
                    projectTypes,
                    roleTypes,
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );
            setCastingCalls(response.data.items);
            setTotalItems(response.data.totalCount);
        } catch (error) {
            handleApiError(error, addError);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchData(1, {
            locations: selectedLocations,
            ageRanges: selectedAgeRanges,
            projectTypes: selectedProjectTypes,
            roleTypes: selectedRoleTypes,
        });
    }, [selectedLocations, selectedAgeRanges, selectedProjectTypes, selectedRoleTypes]);



    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, {
            locations: selectedLocations,
            ageRanges: selectedAgeRanges,
            projectTypes: selectedProjectTypes,
            roleTypes: selectedRoleTypes,
        });
    };

    const handleLocationChange = (e) => {
        const { value, checked } = e.target;
        setSelectedLocations((prev) =>
            checked ? [...prev, value] : prev.filter(location => location !== value)
        );
    };

    const handleAgeRangeChange = (value, checked) => {
        setSelectedAgeRanges((prev) =>
            checked ? [...prev, value] : prev.filter((age) => age !== value)
        );
    };

    const handleAgeRangeSelectAll = (checked) => {
        setSelectedAgeRanges(checked ? ageRanges : []);
    };

    const handleProjectTypeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedProjectTypes((prev) =>
            checked ? [...prev, value] : prev.filter(projectType => projectType !== value)
        );
    };

    const handleRoleTypeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedRoleTypes((prev) =>
            checked ? [...prev, value] : prev.filter(roleType => roleType !== value)
        );
    };

    return (
        <div className={style.pageWrapper}>
            <BurgerMenu />

            <div className={style.mainContent}>
                {/* Left Sidebar */}
                <aside className={style.sidebar}>
                    <p className={style.filterTitle}>Filters</p>
                    <CastingFilters
                        locations={locations}
                        projectTypes={projectTypes}
                        roleTypes={roleTypes}
                        ageRanges={ageRanges}
                        selectedLocations={selectedLocations}
                        selectedProjectTypes={selectedProjectTypes}
                        selectedRoleTypes={selectedRoleTypes}
                        onLocationChange={handleLocationChange}
                        onProjectTypeChange={handleProjectTypeChange}
                        onRoleTypeChange={handleRoleTypeChange}
                        selectedAgeRanges={selectedAgeRanges}
                        onAgeRangeChange={handleAgeRangeChange}
                        onAgeRangeSelectAll={handleAgeRangeSelectAll}
                    />
                </aside>

                {/* Right content */}
                <section className={style.content}>
                    <header className={style.header}>
                        <CastingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        <UserModal />
                    </header>

                    <div className={style.whiteBlock}>
                        {activeTab === '1' && (
                            <p className={style.textBlock1}>
                                Search results for{" "}
                                <b>
                                    {selectedLocations.length === 0 &&
                                        selectedProjectTypes.length === 0 &&
                                        selectedRoleTypes.length === 0
                                        ? "All Locations" : ""}
                                </b>
                                {(selectedLocations.length > 0 ||
                                    selectedProjectTypes.length > 0 ||
                                    selectedRoleTypes.length > 0) && (
                                        <b>
                                            {selectedLocations.length > 0 && ` Locations: ${selectedLocations.join(", ")}`}
                                            {selectedLocations.length > 0 && (selectedProjectTypes.length > 0 || selectedRoleTypes.length > 0) && ", "}
                                            {selectedProjectTypes.length > 0 && ` Project Types: ${selectedProjectTypes.join(", ")}`}
                                            {selectedProjectTypes.length > 0 && selectedRoleTypes.length > 0 && ", "}
                                            {selectedRoleTypes.length > 0 && ` Role Types: ${selectedRoleTypes.join(", ")}`}
                                        </b>
                                    )}
                            </p>
                        )}

                        <ConfigProvider theme={{
                            components: {
                                Pagination: {
                                    itemBg: '#262425', itemActiveBg: '#800020', colorBorder: '#800020',
                                    colorText: '#F9F1E4', colorTextHover: '#F9F1E4', colorTextActive: '#F9F1E4',
                                    itemHoverBg: '#800020',
                                }
                            }
                        }}>

                            {/* TAB 1 — all casting calls */}
                            {activeTab === '1' && (
                                <>
                                    {castingCalls.length > 0
                                        ? castingCalls.map((card) => (
                                            <CastingCard key={card.id} card={card} activeTab={activeTab} />
                                        ))
                                        : <p>No casting calls available</p>
                                    }
                                    <Pagination
                                        pageSize={take} current={currentPage} total={totalItems}
                                        onChange={handlePageChange} showQuickJumper showSizeChanger={false}
                                        className={style.pagination}
                                    />
                                </>
                            )}

                            {/* TAB 2 — actor: castings they submitted to */}
                            {activeTab === '2' && isActor && (
                                <>
                                    {actorSubmissions.length > 0
                                        ? actorSubmissions.map((card) => (
                                            <CastingCard key={card.id} card={card} activeTab="2" />
                                        ))
                                        : <p>No submissions yet</p>
                                    }
                                    <Pagination
                                        pageSize={take} current={tab2Page} total={actorSubmissionsTotal}
                                        onChange={handleTab2PageChange} showQuickJumper showSizeChanger={false}
                                        className={style.pagination}
                                    />
                                </>
                            )}

                            {/* TAB 3 — director: their own castings */}
                            {activeTab === '3' && isDirector && (
                                <>
                                    <div className={style.headerBlock}>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/create-casting')}
                                            className={style.btnSubmit}
                                        >
                                            CREATE
                                        </button>
                                    </div>
                                    {directorCastings.length > 0
                                        ? directorCastings.map((card) => (
                                            <CastingCard key={card.id} card={card} activeTab={activeTab} />
                                        ))
                                        : <p>No castings found</p>
                                    }
                                    <Pagination
                                        pageSize={take} current={tab2Page} total={directorCastingsTotal}
                                        onChange={handleTab2PageChange} showQuickJumper showSizeChanger={false}
                                        className={style.pagination}
                                    />
                                </>
                            )}

                        </ConfigProvider>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CastingPage;
