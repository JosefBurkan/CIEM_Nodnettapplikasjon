import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AboutActor.module.css';
import contactIcon from '../../../assets/contactIcon.svg';
import actorsIcon from '../../../assets/actorsIcon.svg';
import aboutActorIcon from '../../../assets/aboutActor.svg';
import InfoPanel from '../../../components/InfoPanel/InfoPanel.jsx';

// Main AboutActor component to display details about a specific actor
function AboutActor() {
    const { id } = useParams(); // Extracts the actor ID from the URL parameters

    // State variables for actor data and organization text
    const [actorData, setActorData] = useState(null); // Stores the fetched actor data
    const [orgEditMode, setOrgEditMode] = useState(false); // Tracks if the organization text is in edit mode
    const [orgText, setOrgText] = useState(''); // Stores the organization text
    const [orgBackup, setOrgBackup] = useState(''); // Backup for organization text during editing
    const [showContactPopup, setShowContactPopup] = useState(false); // Tracks if the contact popup is visible

    // Fetches actor data from the API
    const fetchActor = useCallback(async () => {
        try {
            const response = await fetch(`https://ciem-nodnettapplikasjon.onrender.com/api/Actor/${id}`); // Fetch actor data by ID
            if (!response.ok) {
                throw new Error('Failed to fetch actor data'); // Handle non-OK responses
            }
            const data = await response.json();
            setActorData(data); // Updates the state with fetched actor data
            setOrgText(data.aboutText || ''); // Sets the organization text
            setOrgBackup(data.aboutText || ''); // Creates a backup of the organization text
        } catch (error) {
            console.error('Error fetching actor data:', error); // Logs errors if the fetch fails
        }
    }, [id]); // Dependency ensures this function is memoized and only changes when `id` changes

    // Use useEffect to call fetchActor only once when the component mounts or `id` changes
    useEffect(() => {
        fetchActor();
    }, [fetchActor]); // Dependency ensures this runs only when `fetchActor` changes

    // If actor data is not yet loaded, display a loading message
    if (!actorData) return <div>Loading...</div>;

    return (
        <div className={styles.aboutActorContainer}>
            {/* TOP ROW */}
            <div className={styles.topRow}>
                {/* Left Column: Actor Name & Contact Panels */}
                <div className={styles.topLeftColumn}>
                    <div className={styles.actorNamePanel}>
                        <h2>{actorData.name}</h2> {/* Displays the actor's name */}
                    </div>
                    <div
                        className={styles.contactPanel}
                        onClick={() => setShowContactPopup(true)} // Opens the contact popup
                    >
                        <img
                            src={contactIcon}
                            alt="Kontakt Icon"
                            className={styles.contactIcon}
                        />
                        <p>Kontakt</p>
                    </div>
                </div>

                {/* Right Column: Organization Section */}
                <div className={styles.orgSection}>
                    <div className={styles.orgHeader}>
                        <div className={styles.orgHeaderLeft}>
                            <img
                                src={aboutActorIcon}
                                alt="About Actor Icon"
                                className={styles.orgIcon}
                            />
                            <h2 className={styles.sectionTitle}>Om Aktør</h2> {/* Section title */}
                        </div>
                        {!orgEditMode && (
                            <button
                                className={styles.editModeButton}
                                onClick={() => {
                                    setOrgBackup(orgText); // Backup the current text
                                    setOrgEditMode(true); // Enable edit mode
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
                                onChange={(e) => setOrgText(e.target.value)} // Updates the text as the user types
                            />
                            <div className={styles.editButtons}>
                                <button
                                    className={styles.saveChangesButton}
                                    onClick={() => setOrgEditMode(false)} // Saves changes and exits edit mode
                                >
                                    Bekreft
                                </button>
                                <button
                                    className={styles.cancelChangesButton}
                                    onClick={() => {
                                        setOrgText(orgBackup); // Restores the backup text
                                        setOrgEditMode(false); // Exits edit mode
                                    }}
                                >
                                    Avbryt
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>{orgText}</p> // Displays the organization text
                    )}
                </div>
            </div>

            {/* BOTTOM PANELS */}
            <div className={styles.bottomPanels}>
                {/* Left Panel: InfoPanel Component */}
                <InfoPanel /> {/* Reusable InfoPanel component */}

                {/* Right Panel: Sub-Actors Section */}
                <div className={styles.underliggendePanel}>
                    <div className={styles.actorsHeader}>
                        <img
                            src={actorsIcon}
                            alt="Actors Icon"
                            className={styles.actorsIcon}
                        />
                        <h2 className={styles.sectionTitle}>Underliggende Aktører</h2> {/* Section title */}
                    </div>
                    <br />
                    {actorData.subActors && actorData.subActors.length > 0 ? (
                        <ul className={styles.actorsList}>
                            {actorData.subActors.map((sub, index) => (
                                <li key={index} className={styles.actorItem}>
                                    {sub} {/* Displays each sub-actor */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Ingen underliggende aktører.</p> // Message if no sub-actors exist
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
                            <h2>Kontaktinformasjon</h2> {/* Modal title */}
                        </div>
                        <p>
                            <strong>E-post:</strong>{' '}
                            {actorData.contact?.email || 'N/A'} {/* Displays email */}
                        </p>
                        <p>
                            <strong>Telefon:</strong>{' '}
                            {actorData.contact?.phone || 'N/A'} {/* Displays phone */}
                        </p>
                        <button
                            className={styles.closePopupButton}
                            onClick={() => setShowContactPopup(false)} // Closes the popup
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