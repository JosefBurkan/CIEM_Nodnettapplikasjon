import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AboutActor.module.css';
import SeverityDots from '../../../components/SeverityDots/SeverityDots.jsx';
import { supabase } from '../../../utils/supabaseClient';
import checkListIcon from '../../../assets/checkList.svg';
import contactIcon from '../../../assets/contactIcon.svg';
import actorsIcon from '../../../assets/actorsIcon.svg';
import aboutActorIcon from '../../../assets/aboutActor.svg';

//
// InfoItem Component for the 2x2 grid in the Infosjekkliste panel
//
function InfoItem({
    id,
    type,
    initialValues,
    className,
    onDelete,
    globalEditMode,
}) {
    const [lastEdit, setLastEdit] = useState(null);
    const [values, setValues] = useState(initialValues);
    const [isEditing, setIsEditing] = useState(false);
    const [backupValues, setBackupValues] = useState(initialValues);

    const openEdit = () => {
        setBackupValues(values);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setValues(backupValues);
        setIsEditing(false);
    };

    const confirmEdit = () => {
        setLastEdit(new Date());
        setIsEditing(false);
    };

    const renderInputs = () => {
        return Object.keys(values).map((key) => (
            <div key={key} className={styles.editField}>
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                    type="number"
                    min={type === 'sikkerhet' ? 0 : undefined}
                    max={type === 'sikkerhet' ? 5 : undefined}
                    value={values[key]}
                    onChange={(e) =>
                        setValues({ ...values, [key]: Number(e.target.value) })
                    }
                />
            </div>
        ));
    };

    const renderDisplay = () => {
        if (type === 'sikkerhet') {
            return (
                <div className={styles.displayValues}>
                    <div>
                        <strong>Område:</strong>{' '}
                        <SeverityDots level={values.omrade} />
                    </div>
                    <div>
                        <strong>Struktur:</strong>{' '}
                        <SeverityDots level={values.struktur} />
                    </div>
                    <div>
                        <strong>Eskalering:</strong>{' '}
                        <SeverityDots level={values.eskalering} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.displayValues}>
                    {Object.keys(values)
                        .map(
                            (key) =>
                                `${key.charAt(0).toUpperCase() + key.slice(1)}: ${values[key]}`
                        )
                        .join(' | ')}
                </div>
            );
        }
    };

    return (
        <div className={className}>
            <p>
                <strong>Siste oppdatering:</strong>{' '}
                {lastEdit ? lastEdit.toLocaleTimeString() : 'Ingen endringer'}
            </p>
            {isEditing || globalEditMode ? renderInputs() : renderDisplay()}
            {!(isEditing || globalEditMode) && (
                <button
                    className={styles.infoItemEditButton}
                    onClick={openEdit}
                >
                    ✏️
                </button>
            )}
            {onDelete && (
                <button
                    className={styles.deleteInfoItemButton}
                    onClick={() => onDelete(id)}
                >
                    Slett
                </button>
            )}
            {isEditing && (
                <div className={styles.editButtons}>
                    <button
                        className={styles.saveChangesButton}
                        onClick={confirmEdit}
                    >
                        Bekreft
                    </button>
                    <button
                        className={styles.cancelChangesButton}
                        onClick={cancelEdit}
                    >
                        Avbryt
                    </button>
                </div>
            )}
        </div>
    );
}

//
// AboutActor Component
//
export default function AboutActor() {
    const { id } = useParams();

    // Unconditionally initialize all hooks.
    const [actorData, setActorData] = useState(null);
    const [orgEditMode, setOrgEditMode] = useState(false);
    const [orgText, setOrgText] = useState('');
    const [orgBackup, setOrgBackup] = useState('');
    const [hendelse, setHendelse] = useState('Hendelse beskrivelse...');
    const [nivaa, setNivaa] = useState('Nivå...');
    const [lokasjon, setLokasjon] = useState('Lokasjon...');
    const [infoEditMode, setInfoEditMode] = useState(false);
    const [infoBackup, setInfoBackup] = useState({ hendelse, nivaa, lokasjon });
    const [kommunikasjonTime, setKommunikasjonTime] = useState(null);
    const [showContactPopup, setShowContactPopup] = useState(false);

    // Fixed InfoItems for the Infosjekkliste grid (2x2)
    const [infoItems] = useState([
        {
            id: 1,
            type: 'sikkerhet',
            initialValues: { omrade: 3, struktur: 2, eskalering: 1 },
        },
        {
            id: 2,
            type: 'default',
            initialValues: { evakuert: 18, gjenværende: 4, savnet: 5 },
        },
        { id: 3, type: 'default', initialValues: { pasienter: 7 } },
        { id: 4, type: 'default', initialValues: { tilgjengelighet: 9 } },
    ]);

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

            {/* BOTTOM PANELS: Infosjekkliste on the left, Underliggende Aktører on the right */}
            <div className={styles.bottomPanels}>
                {/* Left Panel: Infosjekkliste */}
                <div className={styles.infoSjekkContainer}>
                    <div className={styles.infoHeader}>
                        <img
                            src={checkListIcon}
                            alt="Infosjekkliste Icon"
                            className={styles.infoIcon}
                        />
                        <h2>Infosjekkliste</h2>
                        {!infoEditMode && (
                            <button
                                className={styles.editModeButton}
                                onClick={() => {
                                    setInfoBackup({
                                        hendelse,
                                        nivaa,
                                        lokasjon,
                                    });
                                    setInfoEditMode(true);
                                }}
                            >
                                ✏️
                            </button>
                        )}
                    </div>
                    <div className={styles.infoSjekkContent}>
                        <div className={styles.infoLeft}>
                            {infoEditMode ? (
                                <>
                                    <div className={styles.infoField}>
                                        <label>Hendelse Beskrivelse:</label>
                                        <textarea
                                            value={hendelse}
                                            onChange={(e) =>
                                                setHendelse(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>Nivå:</label>
                                        <input
                                            type="text"
                                            value={nivaa}
                                            onChange={(e) =>
                                                setNivaa(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.infoField}>
                                        <label>Lokasjon:</label>
                                        <input
                                            type="text"
                                            value={lokasjon}
                                            onChange={(e) =>
                                                setLokasjon(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.editButtons}>
                                        <button
                                            className={styles.saveChangesButton}
                                            onClick={() =>
                                                setInfoEditMode(false)
                                            }
                                        >
                                            Bekreft
                                        </button>
                                        <button
                                            className={
                                                styles.cancelChangesButton
                                            }
                                            onClick={() => {
                                                setHendelse(
                                                    infoBackup.hendelse
                                                );
                                                setNivaa(infoBackup.nivaa);
                                                setLokasjon(
                                                    infoBackup.lokasjon
                                                );
                                                setInfoEditMode(false);
                                            }}
                                        >
                                            Avbryt
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>
                                        <strong>Hendelse Beskrivelse:</strong>{' '}
                                        {hendelse}
                                    </p>
                                    <p>
                                        <strong>Nivå:</strong> {nivaa}
                                    </p>
                                    <p>
                                        <strong>Lokasjon:</strong> {lokasjon}
                                    </p>
                                </>
                            )}
                        </div>
                        <div className={styles.infoRightGrid}>
                            {infoItems.map((item) => (
                                <InfoItem
                                    key={item.id}
                                    id={item.id}
                                    type={item.type}
                                    initialValues={item.initialValues}
                                    className={styles.infoItem}
                                    globalEditMode={false}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={styles.kommunikasjonRow}>
                        <span>Sist kommunikasjon med aktør:</span>
                        <span className={styles.gittTime}>
                            {kommunikasjonTime
                                ? kommunikasjonTime.toLocaleTimeString()
                                : 'Ikke oppdatert'}
                        </span>
                        <button
                            className={styles.timestampButton}
                            onClick={() => setKommunikasjonTime(new Date())}
                        >
                            Oppdater
                        </button>
                    </div>
                </div>

                {/* Right Panel: Underliggende Aktører */}
                <div className={styles.underliggendePanel}>
                    <div className={styles.actorsHeader}>
                        <img
                            src={actorsIcon}
                            alt="Actors Icon"
                            className={styles.actorsIcon}
                        />
                        <h2 className={styles.sectionTitle}>
                            Underliggende Aktører
                        </h2>
                    </div>
                    <br></br>
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
