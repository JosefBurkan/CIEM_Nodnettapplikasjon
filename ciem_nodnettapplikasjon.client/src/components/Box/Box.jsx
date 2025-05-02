import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Box.module.css';
import { IconUsers } from '@tabler/icons-react';


/* A reusable Box component that displays a title, an icon, and optionally acts as a link. */

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
