import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import { Form, Input, DatePicker, Select, Checkbox, Button, Space, Divider, message } from 'antd';
import moment from 'moment';
import { IoIosArrowDropleftCircle } from 'react-icons/io';
import useRequireRole from '../../tools/useRequireRole';
import { handleApiError } from '../../tools/handleApiError';
import { useError } from '../../tools/errorContext';
import AuditionManager from '../../elements/AuditionManager/AuditionManager';

const { Option } = Select;

const CreateCastingPage = () => {
    useRequireRole({ requireDirectorProfile: true });
    const { addError } = useError();

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [castingData, setCastingData] = useState({
        title: '',
        submissionDue: '',
        workingDateFrom: '',
        workingDateTo: '',
        projectTypeId: '',
        roleTypeId: '',
        playableAgeFrom: 0,
        playableAgeTo: 0,
        payment: '',
        unionDetails: '',
        roleDescription: '',
        rateDetails: '',
        workRequirements: '',
        workInformation: '',
        requestedMedia: '',
        instructionsForSubmissionNote: '',
        requestingSubmissionsFrom: '',
        isAnyEthnicAppearanceAccepted: false,
        isAnyGenderAccepted: false,
        locationIds: [],
        genderIds: [],
        ethnicAppearanceIds: [],
    });

    const [projectTypes, setProjectTypes] = useState([]);
    const [roleTypes, setRoleTypes] = useState([]);
    const [ethnicAppearances, setEthnicAppearances] = useState([]);
    const [genders, setGenders] = useState([]);
    const [regions, setRegions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [allLoadedLocations, setAllLoadedLocations] = useState(new Map());

    // Audition state
    const [auditions, setAuditions] = useState([]);
    const [castingId, setCastingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    projectTypesResponse,
                    roleTypesResponse,
                    ethnicAppearancesResponse,
                    gendersResponse,
                    regionsResponse,
                ] = await Promise.all([
                    axios.get('https://localhost:7118/api/ProjectType/GetAll'),
                    axios.get('https://localhost:7118/api/RoleType/GetAll'),
                    axios.get('https://localhost:7118/api/EthnicAppearance/GetAll'),
                    axios.get('https://localhost:7118/api/Gender/GetAll'),
                    axios.get('https://localhost:7118/api/Location/GetAllRegionNames'),
                ]);

                setProjectTypes(projectTypesResponse.data);
                setRoleTypes(roleTypesResponse.data);
                setEthnicAppearances(ethnicAppearancesResponse.data);
                setGenders(gendersResponse.data);
                setRegions(regionsResponse.data);
            } catch (error) {
                handleApiError(error, addError);
            }
        };

        fetchData();
    }, []);

    const handleRegionChange = async (regionName) => {
        setSelectedRegion(regionName);

        try {
            const response = await axios.post(
                `https://localhost:7118/api/Location/GetLocations/${regionName}`,
                { regionName }
            );
            setLocations(response.data);

            // Add these locations to our map
            const updatedMap = new Map(allLoadedLocations);
            response.data.forEach(loc => {
                updatedMap.set(loc.id, loc);
            });
            setAllLoadedLocations(updatedMap);
        } catch (error) {
            console.error('Error fetching locations:', error);
            handleApiError(error, addError);
        }
    };

    const handleLocationChange = (locationIds) => {
        setCastingData((prevData) => ({
            ...prevData,
            locationIds,
        }));
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            setCastingData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setCastingData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }

        if (name === 'genderIds') {
            setCastingData((prevData) => {
                const currentValues = Array.isArray(prevData.genderIds)
                    ? prevData.genderIds
                    : [];
                if (currentValues.includes(value)) {
                    return {
                        ...prevData,
                        genderIds: currentValues.filter((id) => id !== value),
                    };
                } else {
                    return {
                        ...prevData,
                        genderIds: [...currentValues, value],
                    };
                }
            });
        }

        if (name === 'ethnicAppearanceIds') {
            setCastingData((prevData) => {
                const currentValues = Array.isArray(prevData.ethnicAppearanceIds)
                    ? prevData.ethnicAppearanceIds
                    : [];
                if (currentValues.includes(value)) {
                    return {
                        ...prevData,
                        ethnicAppearanceIds: currentValues.filter((id) => id !== value),
                    };
                } else {
                    return {
                        ...prevData,
                        ethnicAppearanceIds: [...currentValues, value],
                    };
                }
            });
        }
    };

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post(
                'https://localhost:7118/api/CastingCalls/Create',
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                setCastingId(response.data.id);
                message.success('Casting created successfully. Now you can add auditions.');
            }
        } catch (error) {
            console.error('Error creating casting:', error);
            handleApiError(error, addError);
        }
    };

    const handleFinishAuditions = () => {
        navigate('/casting');
    };

    return (
        <div className={style.container}>
            <IoIosArrowDropleftCircle
                className={style.arrowBack}
                onClick={() => navigate('/casting')}
            />
            <h2>Create Casting Call</h2>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#800020',
                        colorBgBase: '#1f1f1f',
                        colorTextBase: '#ffffff',
                    },
                }}
            >
                {!castingId ? (
                    <Form
                        className={style.form}
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true }]}
                        >
                            <Input
                                className={style.input}
                                value={castingData.title}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Submission Due"
                            name="submissionDue"
                            rules={[{ required: true }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                showTime
                                value={
                                    castingData.submissionDue
                                        ? moment(castingData.submissionDue)
                                        : null
                                }
                                onChange={(date) =>
                                    handleChange({
                                        target: {
                                            name: 'submissionDue',
                                            value: date,
                                        },
                                    })
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Working Date From"
                            name="workingDateFrom"
                            rules={[{ required: true }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                showTime
                                value={
                                    castingData.workingDateFrom
                                        ? moment(castingData.workingDateFrom)
                                        : null
                                }
                                onChange={(date) =>
                                    handleChange({
                                        target: {
                                            name: 'workingDateFrom',
                                            value: date,
                                        },
                                    })
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Working Date To"
                            name="workingDateTo"
                            rules={[{ required: true }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                showTime
                                value={
                                    castingData.workingDateTo
                                        ? moment(castingData.workingDateTo)
                                        : null
                                }
                                onChange={(date) =>
                                    handleChange({
                                        target: {
                                            name: 'workingDateTo',
                                            value: date,
                                        },
                                    })
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Project Type"
                            name="projectTypeId"
                            rules={[{ required: true }]}
                        >
                            <Select
                                value={castingData.projectTypeId}
                                onChange={(value) =>
                                    handleChange({
                                        target: { name: 'projectTypeId', value },
                                    })
                                }
                            >
                                <Option value="">Select Project Type</Option>
                                {projectTypes.map((type) => (
                                    <Option key={type.id} value={type.id}>
                                        {type.projectTypeName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Role Type"
                            name="roleTypeId"
                            rules={[{ required: true }]}
                        >
                            <Select
                                value={castingData.roleTypeId}
                                onChange={(value) =>
                                    handleChange({
                                        target: { name: 'roleTypeId', value },
                                    })
                                }
                            >
                                <Option value="">Select Role Type</Option>
                                {roleTypes.map((type) => (
                                    <Option key={type.id} value={type.id}>
                                        {type.roleTypeName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Playable Age From"
                            name="playableAgeFrom"
                            rules={[{ required: true }]}
                        >
                            <Input
                                className={style.input}
                                type="number"
                                value={castingData.playableAgeFrom}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Playable Age To"
                            name="playableAgeTo"
                            rules={[{ required: true }]}
                        >
                            <Input
                                className={style.input}
                                type="number"
                                value={castingData.playableAgeTo}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Payment"
                            name="payment"
                            rules={[{ required: true }]}
                        >
                            <Input
                                className={style.input}
                                value={castingData.payment}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Union Details"
                            name="unionDetails"
                            rules={[{ required: true }]}
                        >
                            <Input
                                className={style.input}
                                value={castingData.unionDetails}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Role Description"
                            name="roleDescription"
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea
                                value={castingData.roleDescription}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Rate Details"
                            name="rateDetails"
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea
                                value={castingData.rateDetails}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Work Requirements"
                            name="workRequirements"
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea
                                value={castingData.workRequirements}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Work Information"
                            name="workInformation"
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea
                                value={castingData.workInformation}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Requested Media"
                            name="requestedMedia"
                            rules={[{ required: true }]}
                        >
                            <Input
                                className={style.input}
                                value={castingData.requestedMedia}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Instructions for Submission Note"
                            name="instructionsForSubmissionNote"
                            rules={[{ required: true }]}
                        >
                            <Input
                                className={style.input}
                                value={castingData.instructionsForSubmissionNote}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Requesting Submissions From"
                            name="requestingSubmissionsFrom"
                            rules={[{ required: true }]}
                        >
                            <Input
                                className={style.input}
                                value={castingData.requestingSubmissionsFrom}
                                onChange={handleChange}
                            />
                        </Form.Item>

                        <Form.Item
                            name="isAnyEthnicAppearanceAccepted"
                            valuePropName="checked"
                        >
                            <Checkbox
                                checked={
                                    castingData.isAnyEthnicAppearanceAccepted
                                }
                                onChange={handleChange}
                            >
                                Is Any Ethnic Appearance Accepted
                            </Checkbox>
                        </Form.Item>

                        <Form.Item
                            name="isAnyGenderAccepted"
                            valuePropName="checked"
                        >
                            <Checkbox
                                checked={castingData.isAnyGenderAccepted}
                                onChange={handleChange}
                            >
                                Is Any Gender Accepted
                            </Checkbox>
                        </Form.Item>

                        <Form.Item
                            label="Region"
                            name="region"
                            rules={[{ required: true }]}
                        >
                            <Select value={selectedRegion} onChange={handleRegionChange}>
                                <Option value="">Select Region</Option>
                                {regions.map((region) => (
                                    <Option key={region} value={region}>
                                        {region}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Locations"
                            name="locationIds"
                            rules={[{ required: true }]}
                        >
                            <Select
                                mode="multiple"
                                value={castingData.locationIds}
                                onChange={(values) =>
                                    handleLocationChange(values)
                                }
                            >
                                {locations.map((location) => (
                                    <Option key={location.id} value={location.id}>
                                        {location.locationName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Genders" name="genderIds">
                            <Select
                                mode="multiple"
                                value={castingData.genderIds}
                                onChange={(values) =>
                                    handleChange({
                                        target: { name: 'genderIds', value: values },
                                    })
                                }
                            >
                                {genders.map((gender) => (
                                    <Option key={gender.id} value={gender.id}>
                                        {gender.genderName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Ethnic Appearances"
                            name="ethnicAppearanceIds"
                        >
                            <Select
                                mode="multiple"
                                value={castingData.ethnicAppearanceIds}
                                onChange={(values) =>
                                    handleChange({
                                        target: {
                                            name: 'ethnicAppearanceIds',
                                            value: values,
                                        },
                                    })
                                }
                            >
                                {ethnicAppearances.map((ethnicAppearance) => (
                                    <Option
                                        key={ethnicAppearance.id}
                                        value={ethnicAppearance.id}
                                    >
                                        {ethnicAppearance.ethnicAppearanceName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Casting Call
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <>
                        <AuditionManager
                            castingId={castingId}
                            locationIds={castingData.locationIds}
                            allLoadedLocations={allLoadedLocations}
                            auditions={auditions}
                            onAuditionsChange={setAuditions}
                            isCreating={true}
                        />

                        <Divider style={{ marginTop: '32px' }} />
                        <Space style={{ marginTop: '24px' }}>
                            <Button onClick={handleFinishAuditions}>
                                Finish & Go to Casting Calls
                            </Button>
                        </Space>
                    </>
                )}
            </ConfigProvider>
        </div>
    );
};

export default CreateCastingPage;