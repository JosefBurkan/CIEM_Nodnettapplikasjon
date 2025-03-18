import React from 'react';
import styles from './KHNnettverk.module.css';
import LiveNetworkWidget from "../../components/DashboardComponents/LiveNetworkWidget";
import Box from '../../components/Box/Box';

function KHSnettverk() {
    return (
        <div className={styles.container}>
            <div className={styles.dashboard}>
                {/* Left Section - Large Live Network Widget */}
                <div className={styles.leftSection}>
                    {/* ✅ Pass "large" prop here */}
                    <LiveNetworkWidget large />
                    <button className={styles.editButton}>Rediger Nettverk</button>
                </div>

                {/* Right Section - Box Widgets */}
                <div className={styles.rightSection}>
                    <Box title="Nytt Nettverk" icon="grid-add" />
                    <Box title="Nettverks Arkiv" icon="folder" />
                </div>
            </div>
        </div>
    );
}

export default KHSnettverk;