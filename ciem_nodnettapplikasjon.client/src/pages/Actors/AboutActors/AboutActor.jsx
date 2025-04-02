import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutActor.module.css';
import DateComponent from '../../../components/Date/Date.jsx';
import SeverityDots from '../../../components/SeverityDots/SeverityDots.jsx';
import checkListIcon from '../../../assets/checkList.svg';

// Define the InfoItem component here so it can be used inside AboutActor
function InfoItem({ children, initialUpdate, className }) {
  const [lastUpdate, setLastUpdate] = useState(initialUpdate || null);

  const handleRead = () => {
    setLastUpdate(new Date());
  };

  return (
    <div className={className}>
      <p>
        <strong>Siste Oppdatering:</strong>{' '}
        {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Ikke oppdatert'}
      </p>
      <button onClick={handleRead}>Lest ✔</button>
      {children}
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
      {/* Actor header and contact card */}
      <div className={styles.actorHeader}>
        <h1>{aktor.name}</h1>
        <div className={styles.contactCard}>
          <h3>Kontaktinformasjon</h3>
          <p>E-post: {aktor.contact.email}</p>
          <p>Telefon: {aktor.contact.phone}</p>
        </div>
      </div>

      {/* Main content with two columns */}
      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Om Organisasjonen</h2>
            <p>{aktor.description}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Underliggende Aktører</h2>
            <ul className={styles.actorsList}>
              {aktor.underlyingActors.map(uActor => (
                <li key={uActor.id}>
                  <Link to={`/actor/${uActor.id}`}>{uActor.name}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pågående Oppgaver</h2>
            <ul>
              {aktor.tasks.map((oppgave, index) => (
                <li key={index}>{oppgave}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.infoPanel}>
            {/* Title & icon */}
            <div className={styles.headerRow}>
              <div className={styles.titleWithIcon}>
                <img
                  src={checkListIcon}
                  alt="Checklist Icon"
                  className={styles.infoIcon}
                />
                <h2 className={styles.sectionTitle}>Infosjekkliste</h2>
              </div>
            </div>

            {/* Info item with read button for Sikkerhet/Struktur/Fare for eskalering */}
            <InfoItem className={styles.infoItem}>
              <div className={styles.metricsRow}>
                <div className={styles.metric}>
                  <strong>Sikkerhet</strong>
                  <span>| Område:</span>
                  <SeverityDots level={3} />
                </div>
                <div className={styles.metric}>
                  <span>| Struktur:</span>
                  <SeverityDots level={2} />
                </div>
                <div className={styles.metric}>
                  <span>| Fare for eskalering:</span>
                  <SeverityDots level={1} />
                </div>
              </div>
            </InfoItem>

            {/* Additional static info item for Antall */}
            <InfoItem className={styles.infoItem}>
              <div className={styles.metricsRow}>
                <div className={styles.metric}>
                  <strong>Antall</strong>
                  <span>| Skadde: 6 | Døde: 0 | Uskadde: 16 | Uvisst: 5</span>
                </div>
              </div>
            </InfoItem>

            {/* Additional static info item for Evakuering */}
            
            <InfoItem className={styles.infoItem}>
              <div className={styles.metricsRow}>
                <div className={styles.metric}>
                  <strong>Evakuering</strong>
                  <span>| Evakuert: 18 | Gjenværende: 4 | Savnet: 5</span>
                </div>
              </div>
            </InfoItem>
            {/* Add more items as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutActor;
