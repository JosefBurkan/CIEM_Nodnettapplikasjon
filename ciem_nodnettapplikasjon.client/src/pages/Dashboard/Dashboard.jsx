import React, { useState, useEffect } from "react";
import UpdatesWidget from "../../components/DashboardComponents/UpdatesWidget";
import CriticalInfoWidget from "../../components/DashboardComponents/CriticalInfoWidget";
import ActiveActorsWidget from "../../components/DashboardComponents/ActiveActorsWidget";
import LiveNetworkWidget from "../../components/DashboardComponents/LiveNetworkWidget";
import styles from "./Dashboard.module.css";
import Box from "../../components/Box/Box";
import { WiDaySunny } from "react-icons/wi";
import { Link } from "react-router-dom";


    function Dashboard() {
        const [situations, setSituations] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            fetch("/api/khn/all-situations")
                .then((res) => res.json())
                .then((data) => {
                    setSituations(data); 
                    setLoading(false); 
                })
                .catch((err) => {
                    console.error("Failed to fetch situations:", err);
                    setLoading(false);
                });
        }, [])

        if (loading) return <div>Laster inn...</div>;

        const hasLiveSituations = situations.some(s => s.status === "Live");

    if (hasLiveSituations) {

        // Live KHN
        return (
            <div className={styles.dashboard}>
                <div className={styles.leftColumn}>
                    <UpdatesWidget />
                </div>

                <div className={styles.centerColumn}>
                    <LiveNetworkWidget />
                    <CriticalInfoWidget />
                </div>

                <div className={styles.rightColumn}>
                    <ActiveActorsWidget />
                </div>
            </div>
        );
    }

    // No Live KHN
    return (
        <div className={styles.noCrisisContainer}>
            <div className={styles.welcomeBox}>
                <div className={styles.leftText}>
                    <h2>Velkommen!</h2>
                    <p className={styles.userName}>Ola Nordmann</p>
                    <p>Operasjonsleder<br />Politiet Agder</p>
                </div>
                <div className={styles.rightText}>
                    <p>Ingen pågående kriser er registrert</p>
                    <WiDaySunny className={styles.sunIcon} />

                </div>
            </div>

            <div className={styles.cardGrid}>
                <Link to="/newNetwork">
                    <Box title="Nytt Nettverk" icon="grid-add" />
                </Link>

                <Link to="/nettverks-arkiv">
                    <Box title="Nettverks Arkiv" icon="folder" />
                </Link>

                <Link to="/actorsAll">
                    <Box title="Alle Aktører" icon="users" />
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;