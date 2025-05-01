import React, { useEffect, useState } from 'react';
import styles from './NetworkArchive.module.css';

function NetworkArchive() {
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        fetchNetworks();
    }, []);

    async function fetchNetworks() {
        try {
            const response = await fetch('https://localhost:5255/api/NodeNetworks/situations');
            if (!response.ok) {
                throw new Error('Failed to fetch networks');
            }
            const data = await response.json();

            // Filter to only archived networks
            const archivedNetworks = data.filter(network => network.isArchived);
            setNetworks(archivedNetworks);
        } catch (error) {
            console.error('Error fetching networks:', error);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Nettverksarkiv</h1>

            <div className={styles.grid}>
                {networks.map((network) => (
                    <div key={network.networkId} className={styles.networkCard}>
                        <img
                            src="/icons/network-icon.png"
                            alt="Network Icon"
                            className={styles.cardIcon}
                        />
                        <span className={styles.networkName}>
                            {network.name} (ID: {network.networkId})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NetworkArchive;
