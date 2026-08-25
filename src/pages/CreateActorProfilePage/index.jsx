import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Імпортуємо axios
import styles from './style.module.scss';
import ThankButton from '../../elements/ThankButton'; // Імпортуємо ThankButton
import { useParams } from 'react-router-dom';
import useRequireRole from '../../tools/useRequireRole'; // Імпортуємо кастомний хук для перевірки ролі
import { useError } from '../../tools/errorContext'; // Імпортуємо контекст для помилок
import { handleApiError } from '../../tools/handleApiError';

const CreateActorProfilePage = () => {
    useRequireRole({ requireActor: true });
    const {addError} = useError();

    const { castingId } = useParams();
    const [formData, setFormData] = useState({
        stageName: '',
        workingLocation: '',
        ageFrom: '',
        ageTo: '',
        ethnicAppearance: '',
        roles: [],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                roles: checked
                    ? [...prevData.roles, value]
                    : prevData.roles.filter((role) => role !== value),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token'); // Припустимо, токен зберігається в localStorage

            const response = await axios.post(
                'https://localhost:7118/api/ActorProfile/CreateProfile',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                console.log('Profile created successfully:', response.data);
                return true;
            } else {
                console.error('Error creating profile:', response.data);
                addError('Failed to create profile. Please try again.');
                return false;
                
            }
        } catch (error) {
            console.error('Error occurred during profile creation:', error);
            handleApiError(error, addError);
            return false;
        }
    };

    const [locations, setLocations] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7118/api/Location/GetAllRegionNames', {}, {
                });
                setLocations(response.data);
            } catch (error) {
                handleApiError(error, addError);
            }
        };
        fetchData();
    }, []);

    const [ethnicAppearance, setEthnicAppearance] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7118/api/EthnicAppearance/GetAll', {}, {
                });
                setEthnicAppearance(response.data);
            } catch (error) {
                handleApiError(error, addError);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
                    alt="Netflix Logo"
                    className={styles.logo}
                />
            </div>
            <div className={styles.createLine}></div>
            <div>
                <h1>Your Profile</h1>
                <h2>Basic info</h2>
                <p className={styles.description}>
                    You are creating a personal profile. Please contact your agent/manager for an invitation to create a
                    represented profile – you will be able to access all of your profiles from one account.
                </p>

                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor="stage-name">Stage Name*</label>
                        <input
                            type="text"
                            id="stage-name"
                            name="stageName"
                            value={formData.stageName}
                            onChange={handleChange}
                            placeholder="Kondratenko Victoria"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="working-location">Primary Working Location*</label>
                        <select
                            className={styles.select}
                            id="working-location"
                            name="workingLocation"
                            value={formData.workingLocation}
                            onChange={handleChange}
                        >
                            {locations.map((location) => (
                                <option value={location} key={location}>{location}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.ageComplex}`}>
                        <label htmlFor="age-range">Playable Age Range*</label>
                        <div className={styles.ageRanges}>
                            <input
                                type="number"
                                id="age-from"
                                name="ageFrom"
                                value={formData.ageFrom}
                                onChange={handleChange}
                                placeholder="18"
                            />
                            <span>to</span>
                            <input
                                type="number"
                                id="age-to"
                                name="ageTo"
                                value={formData.ageTo}
                                onChange={handleChange}
                                placeholder="22"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="ethnic-appearance">Primary Ethnic Appearance*</label>
                        <select
                            className={styles.select}
                            id="ethnic-appearance"
                            name="ethnicAppearance"
                            value={formData.ethnicAppearance}
                            onChange={handleChange}
                        >
                            {ethnicAppearance.map((ethnic) => (
                                <option value={ethnic.ethnicAppearanceName} key={ethnic.id}>{ethnic.ethnicAppearanceName}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Talent is Interested in Roles Portraying*</label>
                        <div className={styles.checkboxGroup}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value="man"
                                    checked={formData.roles.includes('man')}
                                    onChange={handleChange}
                                /> Man
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value="woman"
                                    checked={formData.roles.includes('woman')}
                                    onChange={handleChange}
                                /> Woman
                            </label>
                        </div>
                    </div>

                    <div className={styles.formButton}>
                        {/* Передаємо handleSubmit як пропс onSubmit */}
                        <ThankButton
                            theStyle="submitBtn"
                            route="casting-billboard"
                            castingId={castingId}
                            isCastingIdNeeded={true}
                            text="Create Profile"
                            onSubmit={handleSubmit}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateActorProfilePage;
