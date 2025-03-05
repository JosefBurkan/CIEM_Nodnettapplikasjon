import React from "react";
import styles from "./LiveNetworkWidget.module.css";


const LiveKhnWidget = () => {
    return (
        <div className={styles.widgetContainer}>
            <div className={styles.header}>LIVE KHN</div>
            <div className={styles.chartContainer}>
                <svg viewBox="0 0 300 200" className={styles.chart}>
                    {/* Red connecting lines */}
                    <line x1="150" y1="40" x2="100" y2="70" className={styles.line} />
                    <line x1="150" y1="40" x2="200" y2="70" className={styles.line} />

                    <line x1="100" y1="70" x2="70" y2="100" className={styles.line} />
                    <line x1="100" y1="70" x2="130" y2="100" className={styles.line} />

                    <line x1="200" y1="70" x2="170" y2="100" className={styles.line} />
                    <line x1="200" y1="70" x2="230" y2="100" className={styles.line} />

                    {/* Top Level */}
                    <rect x="140" y="30" width="20" height="20" className={styles.node} />

                    {/* Second Level */}
                    <rect x="90" y="60" width="20" height="20" className={styles.node} />
                    <rect x="190" y="60" width="20" height="20" className={styles.node} />

                    {/* Third Level */}
                    <rect x="60" y="90" width="20" height="20" className={styles.node} />
                    <rect x="120" y="90" width="20" height="20" className={styles.node} />
                    <rect x="160" y="90" width="20" height="20" className={styles.node} />
                    <rect x="220" y="90" width="20" height="20" className={styles.node} />

                    {/* Fourth Level */}
                    <rect x="40" y="120" width="20" height="20" className={styles.node} />
                    <rect x="80" y="120" width="20" height="20" className={styles.node} />
                    <rect x="110" y="120" width="20" height="20" className={styles.node} />
                    <rect x="140" y="120" width="20" height="20" className={styles.node} />
                    <rect x="170" y="120" width="20" height="20" className={styles.node} />
                    <rect x="200" y="120" width="20" height="20" className={styles.node} />
                    <rect x="230" y="120" width="20" height="20" className={styles.node} />
                </svg>
            </div>
        </div>
    );
};

export default LiveKhnWidget;

