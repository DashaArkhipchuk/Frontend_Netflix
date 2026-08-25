import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useRequireRole from '../../tools/useRequireRole';
import { useError } from '../../tools/errorContext';
import { handleApiError } from '../../tools/handleApiError';

const DirectorProfilePage = () => {
    useRequireRole({ requireDirector: true });
    const { addError } = useError();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        typeId: '',
        companyName: '',
        website: '',
        address: '',
        regionName: '',
        phoneNumberWithCountryCode: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'radio') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const token = localStorage.getItem('token'); // Get token from localStorage

            const response = await axios.post(
                'https://localhost:7118/api/CastingDirectorProfile/CreateProfile',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                console.log('Profile created successfully:', response.data);
                navigate('/casting'); // Navigate to the home page after successful profile creation
            } else {
                console.error('Error creating profile:', response.data);
                addError('An error occurred while creating your profile.');
                if (response.status === 400) {
                    addError(response.data.detail);
                }
            }
        } catch (error) {
            handleApiError(error, addError);
        }
    };

    const [locations, setLocations] = useState([]);
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://localhost:7118/api/Location/GetAllRegionNames');
                setLocations(response.data);
            } catch (error) {
                handleApiError(error, addError);
            }
        };
        fetchLocations();
    }, []);

    console.log(locations);

    const [profileTypes, setProfileTypes] = useState([]);
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://localhost:7118/api/CastingDirectorProfileType/GetAll');
                setProfileTypes(response.data);
            } catch (error) {
                handleApiError(error, addError);
            }
        };
        fetchLocations();
    }, []);

    console.log(profileTypes);

    return (
        <div className={style.container}>
            <header>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png" alt="Netflix Logo" className={style.logo} />
            </header>
            <div className={style.createLine}></div>
            <main>
                <form onSubmit={handleSubmit}> {/* Call handleSubmit on form submission */}
                    <div className={style.formGroup}>
                        <label htmlFor="full-name">1. Can we get your first and last name?*</label>
                        <input
                            type="text"
                            id="full-name"
                            name="fullName"
                            placeholder="Type your answer here..."
                            value={formData.fullName} // Bind input value to state
                            onChange={handleChange} // Handle input changes
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="type-id">2. Thanks! What type of user are you?*</label>
                        <div className={style.radioGroup}>
                            {profileTypes.map((profileType) => (
                                <label key={profileType.id}>
                                    <input
                                        type="radio"
                                        name="typeId"
                                        value={profileType.id}
                                        checked={formData.typeId === profileType.id}
                                        onChange={handleChange} // Handle radio button change
                                    />
                                    {profileType.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="company-name">3. What is the name of your company?*</label>
                        <input
                            type="text"
                            id="company-name"
                            name="companyName"
                            placeholder="Type your answer here..."
                            value={formData.companyName} // Bind input value to state
                            onChange={handleChange} // Handle input changes
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="website">4. If you have a website, please enter it here</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            placeholder="https://"
                            value={formData.website} // Bind input value to state
                            onChange={handleChange} // Handle input changes
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="address">5. What is your company's address (including city and state)?*</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Type your answer here..."
                            value={formData.address} // Bind input value to state
                            onChange={handleChange} // Handle input changes
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="regionName">6. I want to release/submit to projects in:*</label>
                        <select
                            id="regionName"
                            name="regionName"
                            value={formData.regionName} // Bind select value to state
                            onChange={handleChange} // Handle select changes
                        >
                            {locations.map((location) => (
                                <option key={location} className={style.selectOption} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="phone-number">7. What is your phone number?*</label>
                        <input
                            type="tel"
                            id="phone-number"
                            name="phoneNumberWithCountryCode"
                            placeholder="(201) 555-0123"
                            value={formData.phoneNumberWithCountryCode} // Bind input value to state
                            onChange={handleChange} // Handle input changes
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="email">8. What is your email?*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@gmail.com"
                            value={formData.email} // Bind input value to state
                            onChange={handleChange} // Handle input changes
                        />
                    </div>

                    <div className={style.formButton}>
                        <button type="submit" className={style.submitBtn}>Get Started</button> {/* Change to type="submit" */}
                    </div>
                </form>
            </main>
        </div>
    );
};

export default DirectorProfilePage;
