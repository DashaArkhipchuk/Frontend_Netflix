import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../elements/AuthProvider';
import useRequireRole from '../../tools/useRequireRole';
import { useError } from '../../tools/errorContext';
import { handleApiError } from '../../tools/handleApiError';

const CastingBillboardPage = () => {
    useRequireRole({ requireActorOrDirector: true });
    const { addError } = useError();
    const { castingId } = useParams();
    const navigate = useNavigate();
    const [casting, setCasting] = useState(null);
    const [loading, setLoading] = useState(true);
    const {isActor, isDirector} = useAuth();
    useEffect(() => {
        const fetchCasting = async () => {
            try {
                const response = await axios.get(`https://localhost:7118/api/CastingCalls/${castingId}`);
                setCasting(response.data);
            } catch (error) {
                handleApiError(error, addError);
                return false;
            } finally {
                setLoading(false);
            }
        };
        fetchCasting();
    }, [castingId]);

    const handleCastingSubmissionPage = () => {
        navigate(`/casting-submission/${castingId}`);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (loading) return <p>Loading...</p>;
    if (!casting) return <p>Casting call not found.</p>;

    return (
        <>
            <div className={style.container}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
                    alt="Netflix Logo"
                    className={style.logo}
                />
                <hr className={style.line} />
                <h1 className={style.pageTitle}>Casting Billboard®</h1>
                <hr className={style.line} />

                <div className={style.block}>
                    <h1 className={style.title}>{casting.title}</h1>
                    <p className={style.text}>{casting.projectType} | {casting.unionDetails}</p>
                </div>

                <div className={style.block}>
                    <h1 className={style.title}>{casting.title}</h1>

                    <div className={style.dateBlock}>
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.5 19C14.7385 19 19 14.7385 19 9.5C19 4.26154 14.7385 0 9.5 0C4.26154 0 0 4.26154 0 9.5C0 14.7385 4.26154 19 9.5 19ZM9.5 1.58333C13.8652 1.58333 17.4167 5.13475 17.4167 9.5C17.4167 13.8653 13.8652 17.4167 9.5 17.4167C5.13475 17.4167 1.58333 13.8653 1.58333 9.5C1.58333 5.13475 5.13475 1.58333 9.5 1.58333ZM8.70833 9.5V4.75C8.70833 4.313 9.063 3.95833 9.5 3.95833C9.937 3.95833 10.2917 4.313 10.2917 4.75V8.70833H12.6667C13.1037 8.70833 13.4583 9.063 13.4583 9.5C13.4583 9.937 13.1037 10.2917 12.6667 10.2917H9.5C9.063 10.2917 8.70833 9.937 8.70833 9.5Z" fill="#F9F1E4" />
                        </svg>
                        <p className={style.textDate}>Submissions Due {formatDate(casting.submissionDue)}</p>
                        <p className={style.textDate}>Work {formatDate(casting.workingDateFrom)} - {formatDate(casting.workingDateTo)}</p>
                        <p className={style.textDate}>Posted {formatDate(casting.postedDate)}</p>
                    </div>

                    <p className={style.text}>
                        {casting.roleType} / {casting.playableAgeFrom} - {casting.playableAgeTo} / {casting.isAnyGenderAccepted ? 'Any Gender' : casting.genders.join(', ')} / {casting.isAnyEthnicAppearanceAccepted ? 'Any Ethnic Appearance' : casting.ethnicAppearances.join(', ')}
                    </p>
                    <p className={style.text}>{casting.unionDetails} / {casting.payment}</p>

                    <hr className={style.line} />

                    <div className={style.marginStyle}>
                        <p className={style.text}>{casting.roleDescription}</p>
                    </div>

                    {!casting.isAnyEthnicAppearanceAccepted && casting.ethnicAppearances?.length > 0 && (
                        <div className={style.marginStyle}>
                            <p className={style.sectionTitle}>Ethnic Appearance</p>
                            <p className={style.text}>{casting.ethnicAppearances.join(', ')}</p>
                        </div>
                    )}

                    {casting.rateDetails && (
                        <div className={style.marginStyle}>
                            <p className={style.sectionTitle}>Additional Rate Details</p>
                            <p className={style.text}>{casting.payment}</p>
                            <p className={style.text}>{casting.rateDetails}</p>
                        </div>
                    )}

                    {casting.workRequirements && (
                        <div className={style.marginStyle}>
                            <p className={style.sectionTitle}>Work Requirements</p>
                            <p className={style.text}>{casting.workRequirements}</p>
                        </div>
                    )}

                    <div className={style.rowDirection}>
                        {casting.auditions?.length > 0 && (
                            <div className={style.marginStyle}>
                                <p className={style.sectionTitle}>Auditions</p>
                                {casting.auditions.map((audition) => (
                                    <div key={audition.id}>
                                        <p className={style.text}>{audition.location}</p>
                                        <p className={style.text}>{formatDate(audition.dateFrom)} - {formatDate(audition.dateTo)}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {casting.workInformation && (
                            <div className={`${style.marginStyle} ${style.marginLeft}`}>
                                <p className={style.sectionTitle}>Work Information</p>
                                <p className={style.text}>{casting.workInformation}</p>
                                <p className={style.text}>{formatDate(casting.workingDateFrom)} - {formatDate(casting.workingDateTo)}</p>
                            </div>
                        )}
                    </div>

                    {casting.requestedMedia && (
                        <div className={style.marginStyle}>
                            <p className={style.sectionTitle}>Requested Media</p>
                            <p className={style.text}>{casting.requestedMedia}</p>
                        </div>
                    )}

                    {casting.instructionsForSubmissionNote && (
                        <div className={style.marginStyle}>
                            <p className={style.sectionTitle}>Instructions for Submission Note</p>
                            <p className={style.text}>{casting.instructionsForSubmissionNote}</p>
                        </div>
                    )}

                    {casting.requestingSubmissionsFrom && (
                        <div className={style.marginStyle}>
                            <p className={style.sectionTitle}>Requesting Submissions From</p>
                            <p className={style.text}>{casting.requestingSubmissionsFrom}</p>
                        </div>
                    )}

                    {casting.locations?.length > 0 && (
                        <div className={style.marginStyle}>
                            <p className={style.sectionTitle}>Locations</p>
                            <p className={style.text}>{casting.locations.join(', ')}</p>
                        </div>
                    )}

                    {isActor && (
                        <button onClick={handleCastingSubmissionPage} className={style.submitToRoleButton}>
                            Submit To Role
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default CastingBillboardPage;