import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Box.module.css';
import { IconUsers } from '@tabler/icons-react';

function Box({ title, boxIconColor, destination, disableLink = false, iconSrc }) {
    const content = (
        <div className={styles.box}>
            <div className={styles.boxHeader}>
                <span>{title}</span>
            </div>
            <div className={styles.boxContent}>
                {iconSrc ? (
                    <img
                        src={iconSrc}
                        alt={`${title}-ikon`}
                        className={styles.boxIcon}
                    />
                ) : (
                    <IconUsers
                        alt="profil-ikon"
                        className={styles.boxIcon}
                        style={{ color: boxIconColor }}
                    />
                )}
            </div>
        </div>
    );

    if (!disableLink && destination) {
        return (
            <Link to={destination} className={styles.boxLink}>
                {content}
            </Link>
        );
    } else {
        return content;
    }
}

export default Box;
