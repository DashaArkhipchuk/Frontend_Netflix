import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import UploadButton from '../../elements/UploadButton';
import ThankButton from '../../elements/ThankButton';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useRequireRole from '../../tools/useRequireRole';
import { useError } from '../../tools/errorContext';
import { uploadAllFiles } from '../../tools/cloudinaryUpload';
import { handleApiError } from '../../tools/handleApiError';

const CastingSubmissionPage = () => {
    useRequireRole({ requireActorProfile: true });
    const { addError } = useError();

    const { castingId } = useParams();
    const [casting, setCasting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previews, setPreviews] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStage, setUploadStage] = useState('idle'); // 'idle' | 'uploading' | 'submitting'

    const [formData, setFormData] = useState({
        castingId: castingId,
        submissionNote: '',
        photoFiles: [],
        videoFiles: [],
    });

    useEffect(() => {
        const fetchCasting = async () => {
            try {
                const response = await axios.get(`https://localhost:7118/api/CastingCalls/${castingId}`);
                setCasting(response.data);
            } catch (error) {
                handleApiError(error, addError);
            } finally {
                setLoading(false);
            }
        };
        fetchCasting();
    }, [castingId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
    try {
        const allFiles = [
            ...formData.photoFiles,
            ...formData.videoFiles,
        ]
            .map(f => f?.originFileObj ?? f)          // safe access
            .filter(f => f instanceof File && f.size > 0);  // must be a real non-empty File

console.log('allFiles:', allFiles);
console.log('mediaUrls will be:', allFiles.map(f => f.name));

        if (allFiles.length === 0) {
            addError('Please add at least one file.');
            return false;
        }

        setIsSubmitting(true);
        setUploadStage('uploading');
        setUploadProgress(0);

        const mediaUrls = await uploadAllFiles(allFiles, (pct) => {
            setUploadProgress(pct);
        });

        console.log('mediaUrls raw:', mediaUrls);         
console.log('mediaUrls JSON:', JSON.stringify(mediaUrls)); 

        // Guard: ensure we actually got back valid URLs
        const validUrls = mediaUrls.filter(url => typeof url === 'string' && url.startsWith('http'));

        if (validUrls.length === 0) {
            addError('File upload failed, no valid URLs returned.');
            setIsSubmitting(false);
            setUploadStage('idle');
            return false;
        }

        setUploadStage('submitting');
        setUploadProgress(0);

        const response = await axios.post(
            'https://localhost:7118/api/Submission/SubmitToRoleWithUrls',
            {
                castingId: formData.castingId,
                submissionNote: formData.submissionNote,
                mediaUrls: validUrls,  // clean array, no empty slots
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        setIsSubmitting(false);
        setUploadStage('idle');

        if (response.status === 200 || response.status === 201) {
            console.log('returning true and submitting is', isSubmitting);
            return true;
        } else {
            addError('Submission failed. Please try again.');
            return false;
        }
    } catch (error) {
        setIsSubmitting(false);
        setUploadStage('idle');
        handleApiError(error, addError);
        return false;
    }
};

    const handlePhotoChange = (fileList) => {
        const totalFiles = fileList.length + formData.videoFiles.length;
        if (totalFiles > 5) {
            addError('Maximum limit of 5 files total exceeded.');
            const allowed = 5 - formData.videoFiles.length;
            fileList = fileList.slice(0, allowed);
        }

        const currentUids = new Set(fileList.map(f => f.uid));

        const newPreviews = fileList
            .filter(f => f.originFileObj)
            .map(f => ({
                uid: f.uid,
                url: URL.createObjectURL(f.originFileObj),
                type: f.originFileObj.type,
                name: f.name,
            }));

        setPreviews(prev => {
            const existingUids = new Set(prev.map(p => p.uid));
            const fresh = newPreviews.filter(p => !existingUids.has(p.uid));
            return [
                ...prev.filter(p => p.type?.startsWith('image/') && currentUids.has(p.uid)),
                ...fresh,
                ...prev.filter(p => p.type?.startsWith('video/')),
            ];
        });

        setFormData(prevData => ({ ...prevData, photoFiles: fileList }));
    };

    const handleVideoChange = (fileList) => {
        const totalFiles = formData.photoFiles.length + fileList.length;
        if (totalFiles > 5) {
            addError('Maximum limit of 5 files total exceeded.');
            const allowed = 5 - formData.photoFiles.length;
            fileList = fileList.slice(0, allowed);
        }

        const currentUids = new Set(fileList.map(f => f.uid));

        const newPreviews = fileList
            .filter(f => f.originFileObj)
            .map(f => ({
                uid: f.uid,
                url: URL.createObjectURL(f.originFileObj),
                type: f.originFileObj.type,
                name: f.name,
            }));

        setPreviews(prev => {
            const existingUids = new Set(prev.map(p => p.uid));
            const fresh = newPreviews.filter(p => !existingUids.has(p.uid));
            return [
                ...prev.filter(p => p.type?.startsWith('image/')),
                ...prev.filter(p => p.type?.startsWith('video/') && currentUids.has(p.uid)),
                ...fresh,
            ];
        });

        setFormData(prevData => ({ ...prevData, videoFiles: fileList }));
    };

    useEffect(() => {
        return () => {
            previews.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [previews]);

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
                <h1 className={style.pageTitle}>Customize Submission</h1>
                <hr className={style.line} />

                <div className={style.block}>
                    <h1 className={style.title}>Changes made here only apply to this submission. Your profile will not be affected.</h1>
                </div>

                <div className={style.block}>
                    <div className={style.rowDirection}>
                        <div className={style.castingInfo}>
                            <h1 className={style.title}>{casting.title}</h1>
                            <p className={style.text}>{casting.projectType} | {casting.unionDetails}</p>

                            <div className={style.dateBlock}>
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.5 19C14.7385 19 19 14.7385 19 9.5C19 4.26154 14.7385 0 9.5 0C4.26154 0 0 4.26154 0 9.5C0 14.7385 4.26154 19 9.5 19ZM9.5 1.58333C13.8652 1.58333 17.4167 5.13475 17.4167 9.5C17.4167 13.8653 13.8652 17.4167 9.5 17.4167C5.13475 17.4167 1.58333 13.8653 1.58333 9.5C1.58333 5.13475 5.13475 1.58333 9.5 1.58333ZM8.70833 9.5V4.75C8.70833 4.313 9.063 3.95833 9.5 3.95833C9.937 3.95833 10.2917 4.313 10.2917 4.75V8.70833H12.6667C13.1037 8.70833 13.4583 9.063 13.4583 9.5C13.4583 9.937 13.1037 10.2917 12.6667 10.2917H9.5C9.063 10.2917 8.70833 9.937 8.70833 9.5Z" fill="#F9F1E4" />
                                </svg>
                                <p className={style.textDate}>Submissions Due {formatDate(casting.submissionDue)}</p>
                            </div>

                            <p className={`${style.text} ${style.additionalMargin}`}>
                                {casting.roleType} / {casting.isAnyGenderAccepted ? 'Any Gender' : casting.genders.join(', ')} / {casting.playableAgeFrom}-{casting.playableAgeTo} / {casting.isAnyEthnicAppearanceAccepted ? 'Any Ethnic Appearance' : casting.ethnicAppearances.join(', ')}
                            </p>
                            <p className={`${style.text} ${style.additionalMargin}`}>
                                {casting.unionDetails} / {casting.payment}
                            </p>
                            <p className={`${style.text} ${style.additionalMargin}`}>
                                {casting.roleDescription}
                            </p>
                        </div>

                        <div className={style.requestedMedia}>
                            <h1 className={style.mediatitle}>Requested Media</h1>
                            <div className={style.mediaIcons}>
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_834_1280)">
                                        <path d="M9.7317 10.9687C9.48793 10.7247 9.19847 10.5312 8.87989 10.3992C8.5613 10.2672 8.21981 10.1992 7.87495 10.1992C7.53009 10.1992 7.18861 10.2672 6.87002 10.3992C6.55143 10.5312 6.26198 10.7247 6.0182 10.9687L0.0332031 16.9537C0.114106 18.051 0.606248 19.0773 1.41122 19.8275C2.21619 20.5776 3.27465 20.9962 4.37495 20.9997H16.625C17.4822 20.9995 18.3203 20.7459 19.0338 20.2708L9.7317 10.9687Z" fill="#5B5B5B" />
                                        <path d="M15.75 7C16.7165 7 17.5 6.2165 17.5 5.25C17.5 4.2835 16.7165 3.5 15.75 3.5C14.7835 3.5 14 4.2835 14 5.25C14 6.2165 14.7835 7 15.75 7Z" fill="#5B5B5B" />
                                        <path d="M16.625 0H4.375C3.2151 0.00138938 2.10311 0.462772 1.28294 1.28294C0.462772 2.10311 0.00138938 3.2151 0 4.375L0 14.5128L4.781 9.73175C5.18727 9.32537 5.66962 9.00301 6.20049 8.78307C6.73137 8.56314 7.30037 8.44993 7.875 8.44993C8.44963 8.44993 9.01863 8.56314 9.54951 8.78307C10.0804 9.00301 10.5627 9.32537 10.969 9.73175L20.2711 19.0339C20.7462 18.3203 20.9998 17.4823 21 16.625V4.375C20.9986 3.2151 20.5372 2.10311 19.7171 1.28294C18.8969 0.462772 17.7849 0.00138938 16.625 0ZM15.75 8.75C15.0578 8.75 14.3811 8.54473 13.8055 8.16014C13.2299 7.77556 12.7813 7.22893 12.5164 6.58939C12.2515 5.94985 12.1822 5.24612 12.3173 4.56718C12.4523 3.88825 12.7856 3.26461 13.2751 2.77513C13.7646 2.28564 14.3883 1.9523 15.0672 1.81725C15.7461 1.6822 16.4499 1.75152 17.0894 2.01642C17.7289 2.28133 18.2756 2.72993 18.6601 3.3055C19.0447 3.88108 19.25 4.55777 19.25 5.25C19.25 6.2165 14.7835 7 15.75 7Z" fill="#5B5B5B" />
                                    </g>
                                </svg>
                            </div>
                            {casting.requestedMedia && (
                                <p className={style.text}>{casting.requestedMedia}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className={style.block}>
                    <div className={style.rowDirection}>
                        <div className={style.addRequestedMedia}>
                            <h1 className={style.title}>1. Add Requested Media</h1>
                            <p className={style.text}>You can upload a maximum of 5 items with size no more than 100MB. Requested media will not be added to your profile.</p>

                            <div className={style.additionalMargin}>
                                <p className={style.sectionTitle}>Photo</p>
                                <UploadButton value={formData.photoFiles} onChange={handlePhotoChange} name="photo" />
                            </div>

                            <div className={style.additionalMargin}>
                                <p className={style.sectionTitle}>Video</p>
                                <UploadButton value={formData.videoFiles} onChange={handleVideoChange} name="video" />
                            </div>

                            {casting.instructionsForSubmissionNote && (
                                <div className={style.additionalMargin}>
                                    <p className={style.sectionTitle}>Media Instructions</p>
                                    <p className={style.text}>{casting.instructionsForSubmissionNote}</p>
                                </div>
                            )}
                        </div>

                        <div className={style.rowMargin}>
                            <div className={style.requestedMediaDiv}>
                                <h1 className={style.sectionTitle18px}>Requested Media</h1>

                                {previews.length === 0 ? (
                                    <p className={style.noMediaText}>No Media</p>
                                ) : (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', overflowY: 'auto', gap: '12px', marginTop: '10px' }}>
                                        {previews.map((preview, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                {preview.type.startsWith('image/') ? (
                                                    <img
                                                        src={preview.url}
                                                        alt={preview.name}
                                                        style={{
                                                            width: '100%',
                                                            maxWidth: '250px',
                                                            height: '160px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            display: 'block',
                                                        }}
                                                    />
                                                ) : (
                                                    <video
                                                        src={preview.url}
                                                        style={{
                                                            width: '100%',
                                                            maxWidth: '250px',
                                                            height: '160px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            display: 'block',
                                                        }}
                                                    />
                                                )}
                                                <p style={{
                                                    fontSize: '11px',
                                                    color: '#B69797',
                                                    marginTop: '4px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '250px',
                                                }}>
                                                    {preview.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.block}>
                    <h1 className={style.title}>2. Customize Submission Note</h1>
                    {casting.instructionsForSubmissionNote && (
                        <div className={style.additionalMargin}>
                            <p className={style.sectionTitle}>Submission Note Instructions</p>
                            <p className={style.text}>{casting.instructionsForSubmissionNote}</p>
                        </div>
                    )}
                    <div className={style.additionalMargin}>
                        <p className={style.sectionTitle}>Your Submission Note</p>
                        <input
                            type="text"
                            value={formData.submissionNote}
                            onChange={handleChange}
                            className={style.input}
                            name="submissionNote"
                            id="submissionNote"
                        />
                    </div>
                </div>

                {/* ── Progress bar: visible while uploading or submitting ── */}
                {isSubmitting && (
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ color: '#F9F1E4', marginBottom: '8px' }}>
                            {uploadStage === 'uploading'
                                ? `Uploading files… ${uploadProgress}%`
                                : 'Saving submission…'}
                        </p>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#393939',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                // Stage 2 has no real progress — animate to 100% smoothly
                                width: uploadStage === 'submitting' ? '100%' : `${uploadProgress}%`,
                                height: '100%',
                                backgroundColor: '#800020',
                                borderRadius: '4px',
                                transition: uploadStage === 'submitting'
                                    ? 'width 0.8s ease'
                                    : 'width 0.3s ease',
                            }} />
                        </div>
                    </div>
                )}

                {
                    <ThankButton
                        theStyle="style.sendSubmissionButton"
                        onSubmit={handleSubmit}
                        route="casting"
                        text="Send Submission"
                        isCastingIdNeeded={false}
                    />
                }
            </div>
        </>
    );
}

export default CastingSubmissionPage;