import React, { useState, useEffect } from 'react';
import styles from './CriticalInfoWidget.module.css';

const CriticalInfoWidget = () => {

    const [InfoPanel, setInfoPanel] = useState([]);
    const dotMap = level => '🟢'.repeat(level);

    const getInfoPanel = async () => {
        try {
            const response = await fetch("https://localhost:5255/api/InfoPanel/retrieveInfoPanel");
            const data = await response.json();
            setInfoPanel(data);
            console.log(data);
        }
        catch (error) {
            console.log(error);
        }
        }

        useEffect(() => {
        getInfoPanel();
        }, [])
    
        const dotLabels = ["areaLevel", "structure", "escalation", "searchDogs", "vehicles", "drones"];

        const infoBoxes = InfoPanel.map(item => ({
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
