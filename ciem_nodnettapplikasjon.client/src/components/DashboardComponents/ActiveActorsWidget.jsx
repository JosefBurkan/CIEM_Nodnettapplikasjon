import React from 'react';
import styles from './ActiveActorsWidget.module.css';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'; // Using FontAwesome icons for statuses

// Sample data for actors and their statuses
const actorsData = [
    { name: 'Kristhåndterings Sentral', green: 12, red: 1, orange: 22 },
    { name: 'Hovedrednings Sentralen', green: 85, red: 2, orange: 24 },
    { name: 'Politiet', green: 108, red: 28, orange: 378 },
    { name: 'Brann og Sikkerhet', green: 390, red: 27, orange: 188 },
    { name: 'Helse & Ambulanse', green: 154, red: 178, orange: 289 },
    { name: 'Røde Kors', green: 26, red: 3, orange: 58 },
    { name: 'Sivilforsvaret', green: 2, red: 98, orange: 5 },
    { name: 'Folkehjelp', green: 23, red: 9, orange: 172 },
    { name: 'Heimevernet', green: 90, red: 80, orange: 97 },
    { name: 'Sanitetskvinnene', green: 2, red: 3, orange: 8 },
];
// Sample data for the number of actors in each status
const ActiveActorsWidget = () => {
    return (
        <div className={styles.widget}>
            <div className={styles.header}>AKTIVE AKTØRER</div>

            <div className={styles.actorsList}>
                {actorsData.map((actor, index) => (
                    <div key={index} className={styles.actorRow}>
                        <div className={styles.actorName}>{actor.name}</div>
                        <div className={styles.statusIcons}>
                            <div className={styles.iconWithNumber}>
                                <FaCheckCircle className={styles.greenIcon} />
                                <span className={styles.number}>
                                    {actor.green}
                                </span>
                            </div>
                            <div className={styles.iconWithNumber}>
                                <FaTimesCircle className={styles.redIcon} />
                                <span className={styles.number}>
                                    {actor.red}
                                </span>
                            </div>
                            <div className={styles.iconWithNumber}>
                                <FaClock className={styles.orangeIcon} />
                                <span className={styles.number}>
                                    {actor.orange}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button className={styles.loadMore}>Last inn mer...</button>

                {/* Warning Corner */}
                <div className={styles.warningCorner}>
                    <div className={styles.warningCount}>4</div>
                    <div className={styles.warningIcon}>
                        {/* SVG Warning Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 9v4"></path>
                            <path d="M12 17h.01"></path>
                            <path d="M21 21H3L12 2l9 19z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveActorsWidget;
