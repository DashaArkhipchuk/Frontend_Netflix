import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Table, Space, Divider, Card, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { handleApiError } from '../../tools/handleApiError';
import { useError } from '../../tools/errorContext';

const { Option } = Select;

/**
 * AuditionManager Component
 * 
 * Reusable component for managing auditions in both Create and Edit casting pages.
 * 
 * Props:
 * - castingId: The casting call ID (required for existing castings)
 * - locationIds: Array of location IDs available for this casting
 * - allLoadedLocations: Map of location ID to location object
 * - auditions: Current list of auditions
 * - onAuditionsChange: Callback function when auditions change
 * - isCreating: Boolean flag - true if creating new casting, false if editing
 */
const AuditionManager = ({
    castingId,
    locationIds,
    allLoadedLocations,
    auditions,
    onAuditionsChange,
    isCreating = false
}) => {
    const { addError } = useError();
    const [auditionForm] = Form.useForm();
    
    // Form state
    const [auditionLocationId, setAuditionLocationId] = useState('');
    const [auditionDateFrom, setAuditionDateFrom] = useState(null);
    const [auditionDateTo, setAuditionDateTo] = useState(null);
    const [loadingAudition, setLoadingAudition] = useState(false);

    const handleAddAudition = async () => {
        // Validation
        if (!auditionLocationId || !auditionDateFrom || !auditionDateTo) {
            message.error('Please fill in all audition details');
            return;
        }

        if (auditionDateTo.isBefore(auditionDateFrom)) {
            message.error('End date must be after start date');
            return;
        }

        setLoadingAudition(true);
        try {
            const auditionData = {
                castingCallId: castingId,
                locationId: auditionLocationId,
                dateFrom: auditionDateFrom.toISOString(),
                dateTo: auditionDateTo.toISOString(),
            };

            const response = await axios.post(
                'https://localhost:7118/api/CastingCalls/AddAudition',
                auditionData
            );

            if (response.status === 200) {
                const newAudition = response.data;
                const updatedAuditions = [
                    ...auditions,
                    { ...newAudition, key: newAudition.id }
                ];
                onAuditionsChange(updatedAuditions);

                // Reset form
                setAuditionLocationId('');
                setAuditionDateFrom(null);
                setAuditionDateTo(null);
                auditionForm.resetFields();

                message.success('Audition added successfully');
            }
        } catch (error) {
            console.error('Error adding audition:', error);
            handleApiError(error, addError);
        } finally {
            setLoadingAudition(false);
        }
    };

    const handleRemoveAudition = async (auditionId) => {
        try {
            const response = await axios.post(
                `https://localhost:7118/api/CastingCalls/RemoveAudition/${auditionId}`
            );

            if (response.data === true) {
                const updatedAuditions = auditions.filter(a => a.key !== auditionId);
                onAuditionsChange(updatedAuditions);
                message.success('Audition removed successfully');
            } else {
                message.error('Failed to remove audition');
            }
        } catch (error) {
            console.error('Error removing audition:', error);
            handleApiError(error, addError);
        }
    };

    const auditionColumns = [
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'From',
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'To',
            dataIndex: 'dateTo',
            key: 'dateTo',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveAudition(record.key)}
                />
            ),
        },
    ];

    // Only show the manager if we have a casting ID and locations to work with
    if (!castingId || !locationIds || locationIds.length === 0) {
        return null;
    }

    return (
        <Card>
            <h3>
                {isCreating
                    ? 'Add Auditions for your Casting Call'
                    : 'Manage Auditions'}
            </h3>
            <Divider />

            {/* Audition Form */}
            <Form form={auditionForm} layout="vertical" style={{ marginBottom: '24px' }}>
                <Form.Item label="Audition Location" required>
                    <Select
                        placeholder="Select location"
                        value={auditionLocationId}
                        onChange={setAuditionLocationId}
                    >
                        {locationIds.length > 0 ? (
                            locationIds.map(locId => {
                                const location = allLoadedLocations.get(locId);
                                return location ? (
                                    <Option key={locId} value={locId}>
                                        {location.locationName}
                                    </Option>
                                ) : null;
                            })
                        ) : (
                            <Option disabled>No locations available</Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item label="Audition Date From" required>
                    <DatePicker
                        showTime
                        style={{ width: '100%' }}
                        value={auditionDateFrom}
                        onChange={setAuditionDateFrom}
                    />
                </Form.Item>

                <Form.Item label="Audition Date To" required>
                    <DatePicker
                        showTime
                        style={{ width: '100%' }}
                        value={auditionDateTo}
                        onChange={setAuditionDateTo}
                    />
                </Form.Item>

                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddAudition}
                        loading={loadingAudition}
                    >
                        Add Audition
                    </Button>
                </Space>
            </Form>

            {/* Auditions List */}
            {auditions.length > 0 ? (
                <>
                    <Divider />
                    <h4>Auditions ({auditions.length})</h4>
                    <Table
                        columns={auditionColumns}
                        dataSource={auditions}
                        pagination={false}
                        size="small"
                        style={{ marginTop: '16px' }}
                    />
                </>
            ) : (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '16px' }}>
                    No auditions added yet. Add one above to get started.
                </p>
            )}
        </Card>
    );
};

export default AuditionManager;