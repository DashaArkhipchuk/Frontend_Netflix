import React from 'react';
import { Modal, Button, message, ConfigProvider } from 'antd';
import axios from 'axios';


const DeleteCastingModal = ({ isVisible, onCancel, castingId }) => {
    console.log(castingId);
    const handleDeleteCasting = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`https://localhost:7118/api/CastingCalls/Remove/${castingId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

            if (response.status === 200) {
                message.success('Casting deleted successfully');
                // Оновити сторінку або перенаправити
                window.location.reload();
            } else {
                message.error('Failed to delete casting');
            }
        } catch (error) {
            message.error('An error occurred while deleting the casting');
            console.error('Delete casting error:', error);
        }
    };

    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#800020',
                colorBgElevated: '#262425',
                colorText: '#F9F1E4',
                colorTextHeading: '#F9F1E4',
                colorBorderSecondary: '#393939',
                colorIcon: '#F9F1E4',
                colorIconHover: '#800020',
            },
            components: {
                Modal: {
                    contentBg: '#262425',
                    headerBg: '#262425',
                    titleColor: '#F9F1E4',
                    titleFontSize: 18,
                },
                Button: {
                    defaultBg: '#393939',
                    defaultColor: '#F9F1E4',
                    defaultBorderColor: '#393939',
                    defaultHoverBg: '#4a4a4a',
                    defaultHoverColor: '#F9F1E4',
                    defaultHoverBorderColor: '#4a4a4a',
                },
            },
        }}>

            <Modal
                title="Confirm Deletion"
                visible={isVisible}
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        CANCEL
                    </Button>,
                    <Button key="confirm" type="primary" onClick={async () => {
                        await handleDeleteCasting(); // Додайте await
                        onCancel(); // Закриваємо модальне вікно тільки після обробки
                    }}>
                        DELETE
                    </Button>
                ]}
            >
                <p>Are you sure you want to delete this casting?</p>
            </Modal>
        </ConfigProvider>
    );
};

export default DeleteCastingModal;
