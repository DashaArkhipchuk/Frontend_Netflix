import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { ConfigProvider, Pagination } from 'antd';
import BurgerMenu from '../../elements/BurgerMenu';
import UserModal from '../../elements/UserModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CastingCard from '../../elements/CastingCard';
import CastingTabs from '../../elements/CastingTabs';
import CastingFilters from '../../elements/CastingFilters';
import useRequireRole from '../../tools/useRequireRole';
import { handleApiError } from '../../tools/handleApiError';
import { useError } from '../../tools/errorContext';

const CastingDirectorPage = () => {
    useRequireRole({ requireDirectorProfile: true });
    const { addError } = useError();

    const navigate = useNavigate();

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
                        return { name: region, subLocations: locations };
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
            locations: locs = selectedLocations,
            ageRanges: ages = selectedAgeRanges,
            projectTypes: projTypes = selectedProjectTypes,
            roleTypes: rolTypes = selectedRoleTypes,
        } = filters;

        try {
            const response = await axios.post(
                `https://localhost:7118/api/CastingCalls/GetCastingCallsByAuthenticatedCastingDirectorId?take=${take}&skip=${skip}`,
                {
                    locations: locs,
                    playableAgeRanges: ages.length === ageRanges.length ? [] : ages,
                    projectTypes: projTypes,
                    roleTypes: rolTypes,
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
            checked ? [...prev, value] : prev.filter(loc => loc !== value)
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
            checked ? [...prev, value] : prev.filter(pt => pt !== value)
        );
    };

    const handleRoleTypeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedRoleTypes((prev) =>
            checked ? [...prev, value] : prev.filter(rt => rt !== value)
        );
    };

    return (
        <div className={style.pageWrapper}>
            <BurgerMenu />

            <div className={style.mainContent}>
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

                <section className={style.content}>
                    <header className={style.header}>
                        <CastingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        <UserModal />
                    </header>

                    <div className={style.whiteBlock}>
                        <div className={style.headerBlock}>
                            <button
                                type="button"
                                onClick={() => navigate('/create-casting')}
                                className={style.btnSubmit}
                            >
                                CREATE
                            </button>
                        </div>

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
                            {castingCalls.length > 0 ? (
                                castingCalls.map((card) => (
                                    <CastingCard key={card.id} card={card} activeTab={2} />
                                ))
                            ) : (
                                <p>Loading or no casting calls available</p>
                            )}

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
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CastingDirectorPage;