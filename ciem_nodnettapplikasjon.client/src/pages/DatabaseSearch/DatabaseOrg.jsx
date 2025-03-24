import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Actors/NewActor.module.css'; 

const DatabaseOrg = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/searchDatabase/${category}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <button className={styles.button} onClick={() => handleCategoryClick('nodetater')}>
                    Nødetatene
                </button>
                <button className={styles.button} onClick={() => handleCategoryClick('rednings')}>
                    Rednings Aktører
                </button>
                <button className={styles.button} onClick={() => handleCategoryClick('frivillige')}>
                    Frivillige Organisasjoner
                </button>
                <button className={styles.button} onClick={() => handleCategoryClick('private')}>
                    Private Aktører
                </button>
            </div>
        </div>
    );
};

export default DatabaseOrg;
