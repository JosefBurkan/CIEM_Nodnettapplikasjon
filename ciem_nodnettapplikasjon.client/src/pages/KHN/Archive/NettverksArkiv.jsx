import React, { useEffect, useState } from 'react';
import styles from './NettverksArkiv.module.css';
import SearchBar from '../../../components/SearchBar/SearchBar';

function NettverksArkiv() {
    const [networks, setNetworks] = useState([]);
    const [newNetworkName, setNewNetworkName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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
            const response = await fetch("https://localhost:5255/api/GetArchivedNetworks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newNetworkName })
            });
            if (!response.ok) {
                throw new Error("Failed to create network");
            }

            fetchArchivedNetworks();
            setNewNetworkName("");
        } catch (error) {
            console.error("Error creating network:", error);
        }
    }

    const filteredNetworks = networks.filter((network) =>
        network.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <SearchBar
                    placeholder="Søk etter nettverk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

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

            {/* Red Rounded Tab */}
            <div className={styles.tab}>Nettverks Arkiv</div>

            <div className={styles.cardWrapper}>
                <div className={styles.grid}>
                    {filteredNetworks.map((network) => (
                        <div key={network.networkID} className={styles.networkCard}>
                            <img
                                src="/images/network-icon.png"
                                alt="Network Icon"
                                className={styles.cardIcon}
                            />
                            <span className={styles.networkName}>
                                {network.name} {network.networkID ? `(ID: ${network.networkID})` : ""}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NettverksArkiv;
