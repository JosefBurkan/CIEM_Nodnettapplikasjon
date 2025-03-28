import React, { useEffect, useState } from 'react';
import styles from './NettverksArkiv.module.css';

function NettverksArkiv() {
    const [networks, setNetworks] = useState([]);
    const [newNetworkName, setNewNetworkName] = useState("");

    useEffect(() => {
        fetchArchivedNetworks();
    }, []);

    async function fetchArchivedNetworks() {
        try {
            const response = await fetch("https://localhost:5255/api/ArchivedNetworks");
            if (!response.ok) {
                throw new Error("Failed to fetch archived networks");
            }
            const data = await response.json();
            setNetworks(data);
        } catch (error) {
            console.error("Error fetching networks:", error);
        }
    }

    async function handleCreateNetwork() {
        try {
            const response = await fetch("https://localhost:5255/api/ArchivedNetworks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newNetworkName })
            });
            if (!response.ok) {
                throw new Error("Failed to create network");
            }

            // Refresh the list
            fetchArchivedNetworks();
            setNewNetworkName("");
        } catch (error) {
            console.error("Error creating network:", error);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Nettverks Arkiv</h1>

            <div className={styles.controls}>
                <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Nytt nettverks navn..."
                    value={newNetworkName}
                    onChange={(e) => setNewNetworkName(e.target.value)}
                />
                <button className={styles.createButton} onClick={handleCreateNetwork}>
                    Legg til nytt nettverk i arkivet
                </button>
            </div>

            <div className={styles.grid}>
                {networks.map((network) => (
                    <div key={network.id} className={styles.networkCard}>
                        <img
                            src="/icons/network-icon.png"
                            alt="Network Icon"
                            className={styles.cardIcon}
                        />
                        <span className={styles.networkName}>
                            {network.name} (ID: {network.id})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NettverksArkiv;
