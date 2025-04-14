import React from 'react';
import { useNavigate } from 'react-router-dom';

const DatabaseOrg = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/searchDatabase/${category}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <button className={styles.button} onClick={() => handleCategoryClick('nodetater')}>
                    N�detatene
                </button>
                <button className={styles.button} onClick={() => handleCategoryClick('rednings')}>
                    Redningsakt�rer
                </button>
                <button className={styles.button} onClick={() => handleCategoryClick('frivillige')}>
                    Frivillige Organisasjoner
                </button>
                <button className={styles.button} onClick={() => handleCategoryClick('private')}>
                    Private Akt�rer
                </button>
            </div>
        </div>
    );
};

export default DatabaseOrg;
