import React, { useState } from "react";
import styles from "./ActiveActorsWidget.module.css";

const initialActorsData = [
    { name: "Kristhåndterings Sentral", green: 12, red: 1, orange: 22, accepted: false, rejected: false },
    { name: "Hovedrednings Sentralen", green: 85, red: 2, orange: 24, accepted: false, rejected: false },
    { name: "Politiet", green: 108, red: 28, orange: 378, accepted: false, rejected: false },
    { name: "Brann og Sikkerhet", green: 390, red: 27, orange: 188, accepted: false, rejected: false },
    { name: "Helse & Ambulanse", green: 154, red: 178, orange: 289, accepted: false, rejected: false },
    { name: "Røde Kors", green: 26, red: 3, orange: 58, accepted: false, rejected: false },
    { name: "Sivilforsvaret", green: 2, red: 98, orange: 5, accepted: false, rejected: false },
    { name: "Folkehjelp", green: 23, red: 9, orange: 172, accepted: false, rejected: false },
    { name: "Heimevernet", green: 90, red: 80, orange: 97, accepted: false, rejected: false },
    { name: "Sanitetskvinnene", green: 2, red: 3, orange: 8, accepted: false, rejected: false },
];

const ActiveActorsWidget = () => {
    const [actors, setActors] = useState(initialActorsData);

    const handleAccept = (index) => {
        const updatedActors = [...actors];
        updatedActors[index].accepted = true;
        checkRemoveActor(updatedActors, index);
    };

    const handleReject = (index) => {
        const updatedActors = [...actors];
        updatedActors[index].rejected = true;
        checkRemoveActor(updatedActors, index);
    };

    const checkRemoveActor = (actorsList, index) => {
        if (actorsList[index].accepted && actorsList[index].rejected) {
            // Remove the actor if both accepted and rejected were clicked
            const filteredActors = actorsList.filter((_, i) => i !== index);
            setActors(filteredActors);
        } else {
            setActors(actorsList);
        }
    };

    return (
        <div className={styles.widget}>
            <div className={styles.header}>AKTIVE AKTØRER</div>
            <div className={styles.actorsList}>
                {actors.map((actor, index) => (
                    <div key={index} className={styles.actorRow}>
                        <div className={styles.actorName}>{actor.name}</div>
                        <div className={styles.statusIcons}>
                            <div className={styles.iconWithNumber}>
                                <span className={`${styles.icon} ${styles.greenIcon}`} onClick={() => handleAccept(index)}>✔</span>
                                <span className={styles.number}>{actor.green}</span>
                            </div>
                            <div className={styles.iconWithNumber}>
                                <span className={`${styles.icon} ${styles.redIcon}`} onClick={() => handleReject(index)}>✖</span>
                                <span className={styles.number}>{actor.red}</span>
                            </div>
                            <div className={styles.iconWithNumber}>
                                <span className={`${styles.icon} ${styles.orangeIcon}`}>⚠</span>
                                <span className={styles.number}>{actor.orange}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button className={styles.loadMore}>Last inn mer...</button>
                <div className={styles.warningCircle}>4</div>
            </div>
        </div>
    );
};

export default ActiveActorsWidget;
