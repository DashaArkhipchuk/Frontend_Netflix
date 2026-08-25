import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';
import EditCastingModal from '../EditCastingModal';
import DeleteCastingModal from '../DeleteCastingModal';
import { useAuth } from '../AuthProvider';

const DrawerCasting = ({ castingId, submissionId, tabCasting = '1', card}) => {
    const [open, setOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const { isActor, isDirector, actorProfileExists, directorProfileExists } = useAuth();

    const handleSubmitClick = () => {
        if (isActor && actorProfileExists) {
            navigate(`/casting-billboard/${castingId}`);
        } else {
            setOpen(true);
        }
    };

    const handleViewDetails = () => {
        navigate(`/casting-billboard/${castingId}`);
    };

    const onClose = () => setOpen(false);
    const handleCreateActorProfilePage = () => navigate(`/create-actor-profile/${castingId}`);
    const handleGetStartedPage = () => navigate('/get-started');
    const handleEditCastingPage = () => navigate(`/edit-casting/${castingId}`);
    const handleViewDetailsPage = () => navigate(`/casting-billboard/${castingId}`);
    const handleViewActorSubmissionPage = () => navigate(`/submission-detail/${submissionId}`, { state: { submission: card } });
    const handleViewSubmissions = () => navigate(`/submission-list/${castingId}`);
    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    // Tab 1 — Casting Calls (all users)
    if (tabCasting === '1') {
        return (
            <>
                {isActor && (
                    <button type="button" onClick={handleSubmitClick} className={style.btnSubmit}>
                        SUBMIT
                    </button>
                )}
                {!isActor && isDirector && (
                    <button type="button" onClick={handleViewDetails} className={style.btnSubmit}>
                        VIEW DETAILS
                    </button>
                )}

                <Drawer
                    className={style.drawer}
                    title={<img className={style.logo} src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png" alt="logo" />}
                    onClose={onClose}
                    open={open}
                >
                    <h1 className={style.tabContentName}>Ready to submit to this role?</h1>
                    <p>Log in or sign up today and get access to thousands of high-quality <b>acting jobs</b>.</p>

                    {isActor && !actorProfileExists && (
                        <>
                            <p className={style.question}>Ready to get started as an Actor?</p>
                            <Button className={style.buttonYes} onClick={handleCreateActorProfilePage}>YES</Button>
                        </>
                    )}
                </Drawer>
            </>
        );
    }

    // Tab 2 — Actor: their submissions
    if (tabCasting === '2' && isActor) {
        return (
            <div className={style.buttons}>
                <button type="button" onClick={handleViewDetails} className={style.btnSubmit}>
                    VIEW DETAILS
                </button>

                <button type="button" onClick={handleViewActorSubmissionPage} className={style.btnSubmit}>
                    VIEW MY SUBMISSION
                </button>
            </div>
        );
    }

    // Tab 3 — Director: their own castings (edit/delete)
    if (tabCasting === '3') {
        return (
            <>
                <div className={style.buttons}>
                    <div className={style.row}>
                        <button type="button" onClick={handleViewDetails} className={style.btnSubmit}>VIEW DETAILS</button>
                        <button type="button" onClick={handleViewSubmissions} className={style.btnSubmit}>VIEW SUBMISSIONS</button>
                    </div>
                    <div className={style.row}>
                        <button type="button" onClick={handleEditCastingPage} className={style.btnSubmit}>EDIT</button>
                        <button type="button" onClick={showModal} className={style.btnSubmit}>DELETE</button>
                    </div>
                </div>
                <DeleteCastingModal
                    isVisible={isModalVisible}
                    onCancel={handleCancel}
                    castingId={castingId}
                />
            </>
        );
    }

    return null;
};

export default DrawerCasting;