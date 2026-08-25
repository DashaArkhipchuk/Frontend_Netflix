import React, { useEffect, useState } from 'react';
import { IoIosArrowDropleftCircle } from 'react-icons/io';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './style.module.scss';
import { useError } from '../../tools/errorContext';
import { handleApiError } from '../../tools/handleApiError';
import { useAuth } from '../../elements/AuthProvider';
import useRequireRole from '../../tools/useRequireRole';

const SubmissionPage = () => {
    useRequireRole({ requireActorOrDirector: true });
    const { submissionId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addError } = useError();
    const { isActor, isDirector } = useAuth();

    const [submission, setSubmission] = useState(state?.submission ?? null);
    const [loading, setLoading] = useState(!state?.submission);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [lightbox, setLightbox] = useState(null); // { url, isVideo }

    useEffect(() => {
        if (state?.submission) return;
        const fetch = async () => {
            try {
                const res = await axios.get(`https://localhost:7118/api/Submission/${submissionId}`);
                setSubmission(res.data);
            } catch (err) {
                handleApiError(err, addError);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [submissionId]);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://localhost:7118/api/Submission/RemoveSubmission/${submissionId}`);
            navigate('/casting');
        } catch (err) {
            handleApiError(err, addError);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const openLightbox = (url) => setLightbox({ url, isVideo: url.includes('/video/') });
    const closeLightbox = () => setLightbox(null);

    if (loading) return <div className={style.loading}><p>Loading...</p></div>;
    if (!submission) return <div className={style.loading}><p>Submission not found.</p></div>;

    const handleBack = () => {
        navigate('/casting'); // Перенаправлення на CastingPage
    };

    return (
        <div className={style.container}>

            {/* Lightbox */}
            {lightbox && (
                <div className={style.lightboxOverlay} onClick={closeLightbox}>
                    <button className={style.lightboxClose} onClick={closeLightbox}>✕</button>
                    <div className={style.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        {lightbox.isVideo ? (
                            <video src={lightbox.url} controls autoPlay className={style.lightboxMedia} />
                        ) : (
                            <img src={lightbox.url} alt="full" className={style.lightboxMedia} />
                        )}
                    </div>
                </div>
            )}

            <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
                alt="Logo"
                className={style.logo}
            />
            <hr className={style.line} />
            <div className={style.headerRow}>
                <IoIosArrowDropleftCircle
                    className={style.arrowBack}
                    onClick={handleBack}
                />
                <h1 className={style.pageTitle}>
                    {isDirector ? 'Submission Review' : 'My Submission'}
                </h1>
            </div>
            <hr className={style.line} />

            {/* Actor badge for director view */}
            {isDirector && (
                <div className={style.actorBadge}>
                    <div className={style.actorAvatar}>
                        {submission.actorName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className={style.actorLabel}>Submitted by</p>
                        <p className={style.actorName}>{submission.actorName}</p>
                    </div>
                </div>
            )}

            {/* Casting Call Info */}
            {isActor && (
            <div className={style.block}>
                <div className={style.blockHeader}>
                    <h2 className={style.blockTitle}>Casting Call</h2>
                    <button
                        className={style.viewCastingBtn}
                        onClick={() => navigate(`/casting-billboard/${submission.id}`)}
                    >
                        VIEW FULL CASTING →
                    </button>
                </div>
                <h3 className={style.castingTitle}>{submission.title}</h3>
                <div className={style.metaRow}>
                    <span className={style.metaPill}>{submission.projectType}</span>
                    <span className={style.metaPill}>{submission.roleType}</span>
                    <span className={style.metaPill}>{submission.unionDetails}</span>
                    <span className={style.metaPill}>{submission.payment}</span>
                    <span className={style.metaPill}>Ages {submission.playableAgeFrom}–{submission.playableAgeTo}</span>
                    <span className={style.metaPill}>
                        {submission.isAnyGenderAccepted ? 'Any Gender' : submission.genders?.join(', ')}
                    </span>
                </div>
                {submission.locations?.length > 0 && (
                    <p className={style.castingMeta}> {submission.locations.join(', ')}</p>
                )}
                <div className={style.dateBlock}>
                    <svg width="16" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 19C14.7385 19 19 14.7385 19 9.5C19 4.26154 14.7385 0 9.5 0C4.26154 0 0 4.26154 0 9.5C0 14.7385 4.26154 19 9.5 19ZM9.5 1.58333C13.8652 1.58333 17.4167 5.13475 17.4167 9.5C17.4167 13.8653 13.8652 17.4167 9.5 17.4167C5.13475 17.4167 1.58333 13.8653 1.58333 9.5C1.58333 5.13475 5.13475 1.58333 9.5 1.58333ZM8.70833 9.5V4.75C8.70833 4.313 9.063 3.95833 9.5 3.95833C9.937 3.95833 10.2917 4.313 10.2917 4.75V8.70833H12.6667C13.1037 8.70833 13.4583 9.063 13.4583 9.5C13.4583 9.937 13.1037 10.2917 12.6667 10.2917H9.5C9.063 10.2917 8.70833 9.937 8.70833 9.5Z" fill="#F9F1E4" />
                    </svg>
                    <span className={style.textDate}>Submission Due: {formatDate(submission.submissionDue)}</span>
                </div>
                <hr className={style.innerLine} />
                <p className={style.roleDescription}>{submission.roleDescription}</p>
            </div>
            )}

            {/* Submission Note */}
            <div className={style.block}>
                <div className={style.blockHeader}>
                    <h2 className={style.blockTitle}>Submission Note</h2>
                </div>
                {submission.submissionNote ? (
                    <div className={style.noteBox}>
                        <span className={style.quoteIcon}>"</span>
                        <p className={style.noteText}>{submission.submissionNote}</p>
                        <span className={style.quoteIcon}>"</span>
                    </div>
                ) : (
                    <p className={style.emptyNote}>No submission note provided.</p>
                )}
            </div>

            {/* Media */}
            <div className={style.block}>
                <div className={style.blockHeader}>
                    <h2 className={style.blockTitle}>Submitted Media</h2>
                    <span className={style.mediaCount}>{submission.submissionMedias?.length ?? 0} file(s)</span>
                </div>

                {submission.submissionMedias?.length > 0 ? (
                    <div className={style.mediaGrid}>
                        {submission.submissionMedias.map((url, i) => (
                            <div
                                key={i}
                                className={style.mediaItem}
                                onClick={() => openLightbox(url)}
                            >
                                {url.includes('/video/') ? (
                                    <>
                                        <video src={url} className={style.media} muted />
                                        <div className={style.playOverlay}>▶</div>
                                    </>
                                ) : (
                                    <img src={url} alt={`media-${i}`} className={style.media} />
                                )}
                                <div className={style.mediaHover}>
                                    <span>Click to expand</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={style.emptyNote}>No media attached.</p>
                )}
            </div>

            {/* Actor-only: delete */}
            {isActor && (
                <div className={style.dangerZone}>
                    <h2 className={style.dangerTitle}>Danger Zone</h2>
                    {!deleteConfirm ? (
                        <button className={style.deleteBtn} onClick={() => setDeleteConfirm(true)}>
                            DELETE SUBMISSION
                        </button>
                    ) : (
                        <div className={style.confirmBlock}>
                            <p className={style.confirmText}>This cannot be undone. Are you sure?</p>
                            <button className={style.deleteBtn} onClick={handleDelete}>YES, DELETE</button>
                            <button className={style.cancelBtn} onClick={() => setDeleteConfirm(false)}>CANCEL</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubmissionPage;