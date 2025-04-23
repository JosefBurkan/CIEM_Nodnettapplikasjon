import React, { useState, useEffect } from 'react';
import styles from './CriticalInfoWidget.module.css';

const CriticalInfoWidget = () => {

    const [infoControl, setInfoControl] = useState([]);
    const dotMap = level => '🟢'.repeat(level);

    const getInfoControl = async () => {
        try {
            const response = await fetch("https://localhost:5255/api/infoControl/retrieveInfoControl");
            const data = await response.json();
            setInfoControl(data);
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }
        }

        useEffect(() => {
        getInfoControl();
        }, [])
    
        const dotLabels = ["areaLevel", "structure", "escalation", "searchDogs", "vehicles", "drones"];

        const infoBoxes = infoControl.map(item => ({
            time: item.lastEdit || "19:16",
            content: Object.entries(item || {}).map(([label, value]) => ({
              label,
              value: dotLabels.includes(label) ? dotMap(value) : value,
            })),
          }));

    return (
        <div className={styles.widgetContainer}>
            <div className={styles.header}>
                <div className={styles.icon}></div>
                <span>Kritisk Informasjon</span>
            </div>
            <div className={styles.infoGrid}>
                {infoBoxes.map((box, index) => (
                    <div key={index} className={styles.infoBox}>
                        <div className={styles.infoHeader}>
                            Siste Oppdatering: <strong>{box.time}</strong>
                        </div>
                        <div className={styles.infoContent}>
                            {box.content.map((line, i) => (
                                <div key={i}>
                                    <strong>{line.label}</strong> {line.value}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CriticalInfoWidget;
