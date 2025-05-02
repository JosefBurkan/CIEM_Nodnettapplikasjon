import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './CivilianPage.module.css';
import logo from '../../../assets/EMKORE.png';
import InfoPanel from '../../../components/InfoPanel/InfoPanel';

function CivilianPage() {
  const location = useLocation();
  const { name } = location.state || {};

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <img src={logo} alt="Logo" />
        <div className={styles.dateTime}>
          <p>{new Date().toLocaleDateString()}</p>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>
      </nav>

      {/* Content */}
      <div className={styles.contentContainer}>
        {/* Velkommen message in a styled box */}
        <div className={styles.welcomeBox}>
          <h2>Velkommen, {name || 'Ukjent Bruker'}!</h2>
        </div>

        {/* InfoPanel */}
        <InfoPanel layout="vertical" hideSections={["Tilgjengelighet"]} />
      </div>
    </div>
  );
}

export default CivilianPage;