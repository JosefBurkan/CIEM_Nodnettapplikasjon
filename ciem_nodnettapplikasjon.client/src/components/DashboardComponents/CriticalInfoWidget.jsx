import React from 'react';
import styles from './CriticalInfoWidget.module.css';

const CriticalInfoWidget = () => {
    const infoBoxes = [
        {
            time: '19:16',
            content: [
                {
                    label: 'Antall',
                    value: 'Skadde: 6 | Døde: 0 | Uskadde: 16 | Uvisst: 5',
                },
            ],
        },
        {
            time: '19:16',
            content: [
                {
                    label: 'Antall',
                    value: 'Skadde: 6 | Døde: 0 | Uskadde: 16 | Uvisst: 5',
                },
            ],
        },
        {
            time: '19:12',
            content: [
                {
                    label: 'Evakuering',
                    value: 'Evakuert: 18 | Gjenværende: 4 | Savnet: 5',
                },
            ],
        },
        {
            time: '19:12',
            content: [
                {
                    label: 'Evakuering',
                    value: 'Evakuert: 18 | Gjenværende: 4 | Savnet: 5',
                },
            ],
        },
        {
            time: '19:10',
            content: [
                { label: 'Sikkerhet', value: 'Område: ' },
                { label: 'Struktur', value: '🟢🟢🟢🟢🟢' },
                { label: 'Fare for eskalering', value: '🟢🟢🟢🟢🟢' },
            ],
        },
        {
            time: '19:12',
            content: [
                { label: 'Tilgjengelighet', value: '' },
                { label: 'Kjøretøy', value: '🟠🟠🟠🟠🟠' },
                { label: 'Droner', value: '⚫⚫⚫⚫⚫' },
                { label: 'Letehund', value: '⚫⚫⚫⚫⚫' },
            ],
        },
    ];

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
