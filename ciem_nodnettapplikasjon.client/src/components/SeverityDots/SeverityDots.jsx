import React from 'react';
import styles from './SeverityDots.module.css';

function SeverityDots({ level, max = 5 }) {
    // Determine the active color based on the level
    const getActiveColor = (level) => {
        switch (level) {
            case 0:
                return '#000000'; // No danger: all dots black
            case 1:
                return '#4D0000'; // darkred
            case 2:
                return '#B00000'; // red
            case 3:
                return '#FF9900'; // orange
            case 4:
                return '#99CC00'; // lightgreen
            case 5:
                return '#008000'; // green
            default:
                return '#000000'; // fallback
        }
    };

    const activeColor = getActiveColor(level);
    const inactiveColor = '#000000';

    // Generate exactly "max" dots, coloring the first "level" dots with activeColor
    const dots = Array.from({ length: max }, (_, i) => (
        <span
            key={i}
            className={styles.dot}
            style={{ backgroundColor: i < level ? activeColor : inactiveColor }}
        />
    ));

    return <div className={styles.dotsContainer}>{dots}</div>;
}

export default SeverityDots;
