import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutActor.module.css';
import DateComponent from '../../../components/Date/Date.jsx';
import SeverityDots from '../../../components/SeverityDots/SeverityDots.jsx';
import checkListIcon from '../../../assets/checkList.svg';

// Enhanced InfoItem component
function InfoItem({ type, initialValues, className }) {
  // Two timestamps: one for "Lest" and one for confirmed edits ("Endret")
  const [lastRead, setLastRead] = useState(null);
  const [lastEdit, setLastEdit] = useState(null);
  // Flag to control editing mode
  const [isEditing, setIsEditing] = useState(false);
  // Values for the info item
  const [values, setValues] = useState(initialValues);

  // Update the "Lest" timestamp
  const handleRead = () => {
    setLastRead(new Date());
  };

  // Open editing mode
  const openEdit = () => {
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
  };

  // Confirm the new values and update the "Endret" timestamp
  const confirmEdit = () => {
    setLastEdit(new Date());
    setIsEditing(false);
  };

  // Render input fields for each value.
  // If the type is "sikkerhet", restrict the input between 0 and 5.
  const renderInputs = () => {
    return Object.keys(values).map((key) => (
      <div key={key} className={styles.editField}>
        <label>
          {key.charAt(0).toUpperCase() + key.slice(1)}:
        </label>
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

  // Render display view for the info item.
  // For "sikkerhet", use SeverityDots; otherwise, display the values as text.
  const renderDisplay = () => {
    if (type === 'sikkerhet') {
      return (
        <div className={styles.displayValues}>
          <p>
            <strong>Område:</strong>{' '}
            <SeverityDots level={values.omrade} />
          </p>
          <p>
            <strong>Struktur:</strong>{' '}
            <SeverityDots level={values.struktur} />
          </p>
          <p>
            <strong>Eskalering:</strong>{' '}
            <SeverityDots level={values.eskalering} />
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
        <strong>Aktør mottat:</strong>{' '}
        {lastRead ? lastRead.toLocaleTimeString() : 'Ikke oppdatert'}
      </p>
      <p>
        <strong>Situasjon Oppdatert:</strong>{' '}
        {lastEdit ? lastEdit.toLocaleTimeString() : 'Ingen endringer'}
      </p>
      <button onClick={handleRead}>Lest ✔</button>
      <button onClick={openEdit}>Oppdater</button>
      {isEditing ? (
        <div className={styles.editContainer}>
          {renderInputs()}
          <div className={styles.editButtons}>
            <button onClick={confirmEdit}>Bekreft</button>
            <button onClick={cancelEdit}>Avbryt</button>
          </div>
        </div>
      ) : (
        renderDisplay()
      )}
    </div>
  );
}

const AboutActor = () => {
  // Example data for the actor
  const aktor = {
    name: 'Beredskapsenheten',
    description:
      'Beredskapsenheten koordinerer redningsoperasjoner og gir kritisk støtte under nødsituasjoner. Enheten er kjent for rask mobilisering og ekspert krisehåndtering.',
    underlyingActors: [
      { id: 1, name: 'Redningslaget' },
      { id: 2, name: 'Medisinsk Responsenhet' }
    ],
    tasks: [
      'Vurdere skader i nord-distriktet',
      'Distribuere mobile medisinske enheter',
      'Koordinere med lokale myndigheter'
    ],
    contact: {
      email: 'kontakt@beredskapenhet.no',
      phone: '123 45 678'
    }
  };

  return (
    <div className={styles.aboutActorContainer}>
      {/* Top row with three columns: actorInfoCard (far left), orgSection (middle), and infoPanel (top right) */}
      <div className={styles.topRow}>
        <div className={styles.actorInfoCard}>
          <h1>{aktor.name}</h1>
          <div className={styles.contactCard}>
            <h3>Kontaktinformasjon</h3>
            <p>E-post: {aktor.contact.email}</p>
            <p>Telefon: {aktor.contact.phone}</p>
          </div>
        </div>
        <div className={styles.orgSection}>
          <h2 className={styles.sectionTitle}>Om Organisasjonen</h2>
          <p>{aktor.description}</p>
        </div>
        <div className={styles.infoPanel}>
          <div className={styles.headerRow}>
            <div className={styles.titleWithIcon}>
              <img
                src={checkListIcon}
                alt="Checklist Icon"
                className={styles.infoIcon}
              />
              <h2 className={styles.sectionTitle}>Infosjekkliste</h2>
            </div>
            <div className={styles.timestampContainer}>
              <span>Gitt på:</span>
              <DateComponent />
            </div>
          </div>
          {/* Info item for Sikkerhet */}
          <InfoItem
            className={styles.infoItem}
            type="sikkerhet"
            initialValues={{ omrade: 3, struktur: 2, eskalering: 1 }}
          />
          {/* Info item for Antall */}
          <InfoItem
            className={styles.infoItem}
            type="default"
            initialValues={{ skadde: 6, dode: 0, uskadde: 16, uvisst: 5 }}
          />
          {/* Info item for Evakuering */}
          <InfoItem
            className={styles.infoItem}
            type="default"
            initialValues={{ evakuert: 18, gjenværende: 4, savnet: 5 }}
          />
        </div>
      </div>

      {/* Optionally, add additional rows below if needed */}
      <div className={styles.bottomRow}>
        {/* Additional content can go here */}
      </div>
    </div>
  );
};

export default AboutActor;
