import React, { useState } from 'react';
import style from './style.module.scss';
import DrawerCasting from '../../elements/DrawerCasting';

const CastingCard = ({ card, activeTab }) => {
    const [openCard, setOpenCard] = useState(false);

    const toggleCard = () => {
        setOpenCard(!openCard);
    };

    return (
        <div className={style.card} key={card.id}>
            <div className={style.title}>
                <p className={style.cardTitle}>{card.title}</p>
                <DrawerCasting
                    key={card.id}
                    tabCasting={activeTab}
                    castingId={card.id}
                    submissionId={card.submissionId}
                    card={card}
                />
            </div>
            <div className={style.columns}>
                <div className={style.firstColumn}>
                    <p className={style.subTitle}>{card.title}</p>
                    <p className={style.commercial}>{card.projectType}</p>
                    <p className={style.label}>Submission Due Date</p>
                    <p className={style.info} style={{ marginLeft: '0' }}>{new Date(card.submissionDue).toLocaleDateString()}</p>
                </div>
                <div className={style.secondColumn}>
                    <div className={style.row}>
                        <p className={style.label}>Gender:</p>
                        <p className={style.info}>{card.genders.join(', ')}</p>
                    </div>
                    <div className={style.row}>
                        <p className={style.label}>Location:</p>
                        <p className={style.info}>{card.locations.join(', ')}</p>
                    </div>
                    <div className={style.row}>
                        <p className={style.label}>Age:</p>
                        <p className={style.info}>{`${card.playableAgeFrom} - ${card.playableAgeTo}`}</p>
                    </div>
                </div>
                <div className={style.thirdColumn}>
                    <div className={style.row}>
                        <p className={style.label}>Payment:</p>
                        <p className={style.info}>{card.payment}</p>
                    </div>
                    <div className={style.row}>
                        <p className={style.label}>Union:</p>
                        <p className={style.info}>{card.unionDetails}</p>
                    </div>
                    <div className={style.row}>
                        <p className={style.label}>Role Type:</p>
                        <p className={style.info}>{card.roleType}</p>
                    </div>
                </div>
            </div>

            <div className={style.header} onClick={toggleCard}>
                <p className={style.roleDesc}>Role Description</p>
                <div className={`${style.arrow} ${openCard ? style.open : ''}`}></div>
            </div>

            {openCard && (
                <div className={style.dropdownContent}>
                    <p className={style.roleDesc}>{card.roleDescription}</p>
                </div>
            )}
        </div>
    );
};

export default CastingCard;
