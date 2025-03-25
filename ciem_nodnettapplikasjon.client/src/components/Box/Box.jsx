import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Box.module.css';
import { IconUsers } from '@tabler/icons-react';

function Box({ title, boxIconColor, destination, disableLink = false }) {
    if (!disableLink && destination) {
        return (
            <Link to={destination} className={styles.boxLink}>
                <div className={styles.box}>
                    <div className={styles.boxHeader} >
                        <span>{title}</span>
                    </div>
                    <div className={styles.boxContent}>
                        <IconUsers alt="profil-ikon" className={styles.boxIcon} style={{ color: boxIconColor }} />
                    </div>
                </div>
            </Link>
        );

    } else {
        return (
            <div className={styles.box}>
                <div className={styles.boxHeader}>
                    <span>{title}</span>
                </div>
                <div className={styles.boxContent}>
                    <IconUsers alt="profil-ikon" className={styles.boxIcon} style={{ color: boxIconColor }} />
                </div>
            </div>
        );
    }
}


export default Box;