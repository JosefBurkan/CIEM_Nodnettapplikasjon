import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AboutActor.module.css';
import { supabase } from '../../../utils/supabaseClient';
import contactIcon from '../../../assets/contactIcon.svg';
import actorsIcon from '../../../assets/actorsIcon.svg';
import aboutActorIcon from '../../../assets/aboutActor.svg';
import InfoPanel from '../../../components/InfoPanel/InfoPanel.jsx';

function AboutActor() {
    const { id } = useParams();

    // Actor data and organization text states
    const [actorData, setActorData] = useState(null);
    const [orgEditMode, setOrgEditMode] = useState(false);
    const [orgText, setOrgText] = useState('');
    const [orgBackup, setOrgBackup] = useState('');
    const [showContactPopup, setShowContactPopup] = useState(false);

    // Fetch actor data from Supabase
    useEffect(() => {
        async function fetchActor() {
            const { data, error } = await supabase
                .from('Actors')
                .select('*')
                .eq('Id', Number(id))
                .single();
            if (error) {
                console.error('Error fetching actor:', error);
            } else {
                setActorData(data);
                setOrgText(data.aboutText || '');
                setOrgBackup(data.aboutText || '');
            }
        }
        fetchActor();
    }, [id]);

    if (!actorData) return <div>Loading...</div>;

    return (
        <div className={styles.aboutActorContainer}>
            {/* TOP ROW */}
            <div className={styles.topRow}>
                {/* Left Column: Actor Name & Contact Panels */}
                <div className={styles.topLeftColumn}>
                    <div className={styles.actorNamePanel}>
                        <h2>{actorData.Name}</h2>
                    </div>
                    <div
                        className={styles.contactPanel}
                        onClick={() => setShowContactPopup(true)}
                    >
                        <img
                            src={contactIcon}
                            alt="Kontakt Icon"
                            className={styles.contactIcon}
                        />
                        <p>Kontakt</p>
                    </div>
                </div>

                {/* Right Column: Om Organisasjonen Panel */}
                <div className={styles.orgSection}>
                    <div className={styles.orgHeader}>
                        <div className={styles.orgHeaderLeft}>
                            <img
                                src={aboutActorIcon}
                                alt="About Actor Icon"
                                className={styles.orgIcon}
                            />
                            <h2 className={styles.sectionTitle}>Om Aktør</h2>
                        </div>
                        {!orgEditMode && (
                            <button
                                className={styles.editModeButton}
                                onClick={() => {
                                    setOrgBackup(orgText);
                                    setOrgEditMode(true);
                                }}
                            >
                                ✏️
                            </button>
                        )}
                    </div>
                    {orgEditMode ? (
                        <>
                            <textarea
                                value={orgText}
                                onChange={(e) => setOrgText(e.target.value)}
                            />
                            <div className={styles.editButtons}>
                                <button
                                    className={styles.saveChangesButton}
                                    onClick={() => setOrgEditMode(false)}
                                >
                                    Bekreft
                                </button>
                                <button
                                    className={styles.cancelChangesButton}
                                    onClick={() => {
                                        setOrgText(orgBackup);
                                        setOrgEditMode(false);
                                    }}
                                >
                                    Avbryt
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>{orgText}</p>
                    )}
                </div>
            </div>

            {/* BOTTOM PANELS */}
            <div className={styles.bottomPanels}>
                {/* Left Panel: Use the reusable InfoPanel component here */}
                <InfoPanel />

                {/* Right Panel: Underliggende Aktører */}
                <div className={styles.underliggendePanel}>
                    <div className={styles.actorsHeader}>
                        <img
                            src={actorsIcon}
                            alt="Actors Icon"
                            className={styles.actorsIcon}
                        />
                        <h2 className={styles.sectionTitle}>Underliggende Aktører</h2>
                    </div>
                    <br />
                    {actorData.SubActors && actorData.SubActors.length > 0 ? (
                        <ul className={styles.actorsList}>
                            {actorData.SubActors.map((sub, index) => (
                                <li key={index} className={styles.actorItem}>
                                    {sub}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Ingen underliggende aktører.</p>
                    )}
                </div>
            </div>

            {/* CONTACT POPUP MODAL */}
            {showContactPopup && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.contactHeader}>
                            <img
                                src={contactIcon}
                                alt="Kontakt Icon"
                                className={styles.contactIcon}
                            />
                            <h2>Kontaktinformasjon</h2>
                        </div>
                        <p>
                            <strong>E-post:</strong>{' '}
                            {actorData.contact?.email || 'N/A'}
                        </p>
                        <p>
                            <strong>Telefon:</strong>{' '}
                            {actorData.contact?.phone || 'N/A'}
                        </p>
                        <button
                            className={styles.closePopupButton}
                            onClick={() => setShowContactPopup(false)}
                        >
                            Lukk
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.bottomRow}>
                {/* Additional content if needed */}
            </div>
        </div>
    );
}

export default AboutActor;  