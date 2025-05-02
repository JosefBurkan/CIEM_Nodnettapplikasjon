import React, { useState, useEffect } from 'react';
import styles from './CriticalInfoWidget.module.css';

// This component fetches and displays critical information from the API
// It shows a list of items with their last update time and various statuses represented by colored dots
const CriticalInfoWidget = () => {
    
    // State to hold the information panel data
    // The data is fetched from the API and stored in this state variable
    const [InfoPanel, setInfoPanel] = useState([]);
    const dotMap = level => '🟢'.repeat(level);

    // Function to fetch the information panel data from the API
    // It uses the Fetch API to make a GET request to the specified endpoint
    const getInfoPanel = async () => {
        try {
            const response = await fetch("https://ciem-nodnettapplikasjon.onrender.com/api/InfoPanel/retrieveInfoPanel");
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
        // Fetch the information panel data when the component mounts
        // The data is then used to create a list of info boxes, each containing the last update time and various statuses
        const dotLabels = ["areaLevel", "structure", "escalation", "searchDogs", "vehicles", "drones"];
        
        // Create an array of info boxes from the fetched data
        // Each info box contains the last update time and a list of labels and their corresponding values
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
                <span>Infosjekkliste</span>
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
