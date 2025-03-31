import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutActor.module.css';

const AboutActor = () => {
  // Eksempeldata for aktøren
  const aktor = {
    name: "Beredskapsenheten",
    description:
      "Beredskapsenheten koordinerer redningsoperasjoner og gir kritisk støtte under nødsituasjoner. Enheten er kjent for rask mobilisering og ekspert krisehåndtering.",
    criticalInfo: {
      info: "Alarmnivå: Høyt. Ekstra ressurser nødvendig.",
      timestamp: "2025-03-31 15:30"
    },
    underlyingActors: [
      { id: 1, name: "Redningslaget" },
      { id: 2, name: "Medisinsk Responsenhet" }
    ],
    tasks: [
      "Vurdere skader i nord-distriktet",
      "Distribuere mobile medisinske enheter",
      "Koordinere med lokale myndigheter"
    ],
    contact: {
      email: "kontakt@beredskapenhet.no",
      phone: "123 45 678"
    }
  };

  return (
    <div className={styles.aboutActorContainer}>
      {/* Aktørtittel og kontaktkort */}
      <div className={styles.actorHeader}>
        <h1>{aktor.name}</h1>
        <div className={styles.contactCard}>
          <h3>Kontaktinformasjon</h3>
          <p>E-post: {aktor.contact.email}</p>
          <p>Telefon: {aktor.contact.phone}</p>
        </div>
      </div>

      {/* Hovedinnhold med to kolonner */}
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
            <span className={styles.timestamp}>Gitt på: {aktor.criticalInfo.timestamp}</span>
            <h2 className={styles.sectionTitle}>Kritisk Informasjon</h2>
            <p>{aktor.criticalInfo.info}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutActor;
