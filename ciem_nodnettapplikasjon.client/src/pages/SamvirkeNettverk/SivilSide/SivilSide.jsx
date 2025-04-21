import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './SivilSide.module.css';
import logo from '../../../assets/EMKORE.png';
import InfoPanel from '../../../components/InfoPanel/InfoPanel';

function SivilSide() {
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
        <h2>Velkommen, {name || 'Ukjent Bruker'}!</h2>
        {/* Pass a prop to indicate vertical layout */}
        <InfoPanel layout="vertical" showEdit={false} showComm={false} />
      </div>
    </div>
  );
}


export default SivilSide;