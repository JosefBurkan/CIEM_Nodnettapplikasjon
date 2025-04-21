import React from 'react';
import styles from './AddActorModal.module.css';

function AddActorModal({ onClose, onSelect }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>Hva ønsker du å gjøre?</h2>
        <div className={styles.buttons}>
          <button onClick={() => onSelect('new')}>Lag ny aktør</button>
          <button onClick={() => onSelect('existing')}>Velg aktør fra database</button>
          <button onClick={onClose}>Avbryt</button>
        </div>
      </div>
    </div>
  );
}

export default AddActorModal;