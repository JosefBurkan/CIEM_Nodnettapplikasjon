import React, { useState } from 'react';
import styles from './NewActor.module.css';
import { useNavigate } from 'react-router-dom';


const NewActor = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <button className={styles.button} onClick={() => navigate('/searchDatabase')}>
                    Søk i Databaser
                </button>
                <span>
                    eller...
                </span>
                <button className={styles.button} onClick={() => navigate('/createActor')}>
                    Opprett ny aktør
                </button>
            </div>
        </div>
    );
};

export default NewActor;