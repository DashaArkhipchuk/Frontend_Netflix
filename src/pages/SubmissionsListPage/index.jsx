import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './style.module.scss';
import { ConfigProvider, Pagination } from 'antd';
import useRequireRole from '../../tools/useRequireRole';
import { useError } from '../../tools/errorContext';
import { handleApiError } from '../../tools/handleApiError';

const SubmissionsListPage = () => {
    useRequireRole({ requireDirectorProfile: true });
    const { castingId } = useParams();
    const navigate = useNavigate();
    const { addError } = useError();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const take = 10;

    const fetchSubmissions = async (page = 1) => {
        const skip = (page - 1) * take;
        try {
            console.log(`Fetching submissions for casting call ID ${castingId}, page ${page}`);
            const response = await axios.post(
                `https://localhost:7118/api/Submission/GetSubmissionByCastingCallId/${castingId}?Skip=${skip}&Take=${take}`
            );
            setSubmissions(response.data.items);
            setTotal(response.data.totalCount);
        } catch (error) {
            handleApiError(error, addError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions(1);
    }, [castingId]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchSubmissions(page);
    };

    if (loading) return <div className={style.loading}><p>Loading...</p></div>;

    return (
        <div className={style.container}>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
                alt="Logo"
                className={style.logo}
            />
            <hr className={style.line} />
            <div className={style.headerRow}>
                <h1 className={style.pageTitle}>Submissions</h1>
                <button className={style.backBtn} onClick={() => navigate('/casting')}>
                    ← BACK TO CASTINGS
                </button>
            </div>
            <hr className={style.line} />

            {submissions.length === 0 ? (
                <div className={style.empty}>
                    <p className={style.emptyText}>No submissions yet for this casting call.</p>
                </div>
            ) : (
                <>
                    {submissions.map((submission) => (
                        <div key={submission.id} className={style.card}>
                            {/* Left: first media preview */}
                            <div className={style.previewCol}>
                                {submission.submissionMedias?.[0] ? (
                                    submission.submissionMedias[0].includes('/video/') ? (
                                        <video
                                            src={submission.submissionMedias[0]}
                                            className={style.preview}
                                            muted
                                        />
                                    ) : (
                                        <img
                                            src={submission.submissionMedias[0]}
                                            alt="preview"
                                            className={style.preview}
                                        />
                                    )
                                ) : (
                                    <div className={style.noPreview}>No Media</div>
                                )}
                            </div>

                            {/* Middle: info */}
                            <div className={style.infoCol}>
                                <p className={style.actorName}>{submission.actorName}</p>

                                {submission.submissionNote ? (
                                    <p className={style.note}>"{submission.submissionNote}"</p>
                                ) : (
                                    <p className={style.emptyNote}>No submission note.</p>
                                )}

                                <div className={style.mediaRow}>
                                    {submission.submissionMedias?.map((url, i) => (
                                        url.includes('/video/') ? (
                                            <video
                                                key={i}
                                                src={url}
                                                className={style.thumb}
                                                muted
                                            />
                                        ) : (
                                            <img
                                                key={i}
                                                src={url}
                                                alt={`media-${i}`}
                                                className={style.thumb}
                                            />
                                        )
                                    ))}
                                </div>

                                <p className={style.mediaCount}>
                                    {submission.submissionMedias?.length ?? 0} file(s) attached
                                </p>
                            </div>

                            {/* Right: action */}
                            <div className={style.actionCol}>
                                <button
                                    className={style.viewBtn}
                                    onClick={() => navigate(
                                        `/submission-detail/${submission.id}`,
                                        { state: { submission } }
                                    )}
                                >
                                    VIEW SUBMISSION
                                </button>
                            </div>
                        </div>
                    ))}

                    <ConfigProvider theme={{
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
                    }}>
                        <Pagination
                            pageSize={take}
                            current={currentPage}
                            total={total}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            className={style.pagination}
                        />
                    </ConfigProvider>
                </>
            )}
        </div>
    );
};

export default SubmissionsListPage;