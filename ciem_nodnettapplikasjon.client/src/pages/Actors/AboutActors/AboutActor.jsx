import React, { useState } from 'react';
import styles from './AboutActor.module.css';
import DateComponent from '../../../components/Date/Date.jsx';
import SeverityDots from '../../../components/SeverityDots/SeverityDots.jsx';
import checkListIcon from '../../../assets/checkList.svg';
import contactIcon from '../../../assets/contactIcon.svg';
import actorsIcon from '../../../assets/actorsIcon.svg';
import aboutActorIcon from '../../../assets/aboutActor.svg';

// Enhanced InfoItem component for the fixed 2x2 grid in Infosjekkliste
function InfoItem({ id, type, initialValues, className, onDelete, globalEditMode }) {
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
          onChange={(e) => setValues({ ...values, [key]: Number(e.target.value) })}
        />
      </div>
    ));
  };

  const renderDisplay = () => {
    if (type === 'sikkerhet') {
      return (
        <div className={styles.displayValues}>
          <p>
            <strong>Område:</strong> <SeverityDots level={values.omrade} />
          </p>
          <p>
            <strong>Struktur:</strong> <SeverityDots level={values.struktur} />
          </p>
          <p>
            <strong>Eskalering:</strong> <SeverityDots level={values.eskalering} />
          </p>
        </div>
      );
    } else {
      return (
        <div className={styles.displayValues}>
          {Object.keys(values)
            .map((key) => (
              `${key.charAt(0).toUpperCase() + key.slice(1)}: ${values[key]}`
            ))
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
        <button className={styles.infoItemEditButton} onClick={openEdit}>
          ✏️
        </button>
      )}
      {onDelete && (
        <button className={styles.deleteInfoItemButton} onClick={() => onDelete(id)}>
          Slett
        </button>
      )}
      {isEditing && (
        <div className={styles.editButtons}>
          <button className={styles.saveChangesButton} onClick={confirmEdit}>
            Bekreft
          </button>
          <button className={styles.cancelChangesButton} onClick={cancelEdit}>
            Avbryt
          </button>
        </div>
      )}
    </div>
  );
}

export default function AboutActor() {
  // Global state for "Om Organisasjonen" edit mode
  const [orgEditMode, setOrgEditMode] = useState(false);
  const [orgText, setOrgText] = useState(
    'Beredskapsenheten koordinerer redningsoperasjoner og gir kritisk støtte under nødsituasjoner. Enheten er kjent for rask mobilisering og ekspert krisehåndtering.'
  );
  const [orgBackup, setOrgBackup] = useState(orgText);

  // Global state for Infosjekkliste left fields
  const [hendelse, setHendelse] = useState('Hendelse beskrivelse...');
  const [nivaa, setNivaa] = useState('Nivå...');
  const [lokasjon, setLokasjon] = useState('Lokasjon...');
  const [infoEditMode, setInfoEditMode] = useState(false);
  const [infoBackup, setInfoBackup] = useState({ hendelse, nivaa, lokasjon });

  // Global timestamp for "Sist kommunikasjon med aktør"
  const [kommunikasjonTime, setKommunikasjonTime] = useState(null);

  // Global state for contact popup
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Fixed InfoItems for the right grid (2x2)
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
    {
      id: 3,
      type: 'default',
      initialValues: { pasienter: 7 },
    },
    {
      id: 4,
      type: 'default',
      initialValues: { tilgjengelighet: 9 },
    },
  ]);

  // Actor and contact data
  const actorName = 'Beredskapsenheten';
  const contact = {
    email: 'kontakt@nodland.no',
    phone: '123 45 678',
  };

  // Actors list data
  const [actors] = useState([
    { id: 1, name: 'Redningslaget' },
    { id: 2, name: 'Medisinsk Responsenhet' },
  ]);

  return (
    <div className={styles.aboutActorContainer}>
      {/* TOP ROW */}
      <div className={styles.topRow}>
        {/* Left Column: Actor Name & Contact (stacked vertically) */}
        <div className={styles.topLeftColumn}>
          <div className={styles.actorNamePanel}>
            <h2>{actorName}</h2>
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
        {/* Right Column: Om Organisasjonen */}
        <div className={styles.orgSection}>
          <div className={styles.orgHeader}>
            <img
              src={aboutActorIcon}
              alt="About Actor Icon"
              className={styles.orgIcon}
            />
            <h2 className={styles.sectionTitle}>Om Organisasjonen</h2>
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

      {/* INFOSJEKKLISTE PANEL (horizontal layout) */}
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
                setInfoBackup({ hendelse, nivaa, lokasjon });
                setInfoEditMode(true);
              }}
            >
              ✏️
            </button>
          )}
        </div>
        <div className={styles.infoSjekkContent}>
          {/* Left side: Editable fields for hendelse, nivå, lokasjon */}
          <div className={styles.infoLeft}>
            {infoEditMode ? (
              <>
                <div className={styles.infoField}>
                  <label>Hendelse Beskrivelse:</label>
                  <textarea
                    value={hendelse}
                    onChange={(e) => setHendelse(e.target.value)}
                  />
                </div>
                <div className={styles.infoField}>
                  <label>Nivå:</label>
                  <input
                    type="text"
                    value={nivaa}
                    onChange={(e) => setNivaa(e.target.value)}
                  />
                </div>
                <div className={styles.infoField}>
                  <label>Lokasjon:</label>
                  <input
                    type="text"
                    value={lokasjon}
                    onChange={(e) => setLokasjon(e.target.value)}
                  />
                </div>
                <div className={styles.editButtons}>
                  <button
                    className={styles.saveChangesButton}
                    onClick={() => setInfoEditMode(false)}
                  >
                    Bekreft
                  </button>
                  <button
                    className={styles.cancelChangesButton}
                    onClick={() => {
                      setHendelse(infoBackup.hendelse);
                      setNivaa(infoBackup.nivaa);
                      setLokasjon(infoBackup.lokasjon);
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
                  <strong>Hendelse Beskrivelse:</strong> {hendelse}
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
          {/* Right side: 2x2 grid of InfoItems */}
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
        {/* "Sist kommunikasjon med aktør" row */}
        <div className={styles.kommunikasjonRow}>
          <span>Sist kommunikasjon med aktør:</span>
          <span className={styles.gittTime}>
            {kommunikasjonTime ? kommunikasjonTime.toLocaleTimeString() : 'Ikke oppdatert'}
          </span>
          <button
            className={styles.timestampButton}
            onClick={() => setKommunikasjonTime(new Date())}
          >
            Oppdater
          </button>
        </div>
      </div>

      {/* ACTORS LIST SECTION */}
      <div className={styles.actorsListContainer}>
        <div className={styles.actorsHeader}>
          <img
            src={actorsIcon}
            alt="Actors Icon"
            className={styles.actorsIcon}
          />
          <h2 className={styles.sectionTitle}>Aktører</h2>
        </div>
        <ul className={styles.actorsList}>
          {actors.map((a) => (
            <li key={a.id} className={styles.actorItem}>
              {a.name}
            </li>
          ))}
        </ul>
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
              <strong>E-post:</strong> {contact.email}
            </p>
            <p>
              <strong>Telefon:</strong> {contact.phone}
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

      {/* Optional Bottom Row */}
      <div className={styles.bottomRow}>
        {/* Additional content if needed */}
      </div>
    </div>
  );
}
