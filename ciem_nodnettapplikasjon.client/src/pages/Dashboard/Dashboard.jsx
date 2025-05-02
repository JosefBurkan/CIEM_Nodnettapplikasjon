import React, { useState, useEffect, useCallback } from 'react';
import UpdatesWidget from '../../components/DashboardComponents/UpdatesWidget';
import InfoPanel from '../../components/InfoPanel/InfoPanel';
import ActiveActorsWidget from '../../components/DashboardComponents/ActiveActorsWidget';
import LiveNetworkWidget from '../../components/DashboardComponents/LiveNetworkWidget';
import styles from './Dashboard.module.css';
import Box from '../../components/Box/Box';
import { WiDaySunny } from 'react-icons/wi';
import { Link } from 'react-router-dom';
import newNetworkIcon from '../../assets/newNetwork.svg';
import networkArchiveIcon from '../../assets/networkArchive.svg';

function Dashboard() {
    const [situations, setSituations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    // Fetch situations from the API
    const fetchSituations = useCallback(async () => {
        try {
            const response = await fetch('https://ciem-nodnettapplikasjon.onrender.com/api/NodeNetworks/all-situations');
            if (!response.ok) throw new Error('Failed to fetch situations');
            const data = await response.json();
            setSituations(data);
            console.log('Situations retrieved successfully');
        } catch (error) {
            console.error('Failed to fetch situations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch user data from the API
    const fetchUser = useCallback(async () => {
        const username = localStorage.getItem('username');
        if (!username) {
            console.error('No username found in localStorage');
            return;
        }

        try {
            const response = await fetch(`https://ciem-nodnettapplikasjon.onrender.com/api/User/current/${username}`);
            if (!response.ok) throw new Error('User not found');
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    }, []);

    // Use useEffect to fetch situations on component mount
    useEffect(() => {
        fetchSituations();
    }, [fetchSituations]);

    // Use useEffect to fetch user data on component mount
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    if (loading) return <div>Laster inn...</div>;

    const hasLiveSituations = situations.length > 0;

    if (hasLiveSituations) {
        // Live NodeNetworks
        return (
            <div className={styles.dashboard}>
                <div className={styles.leftColumn}>
                    <UpdatesWidget />
                </div>

                <div className={styles.centerColumn}>
                    <LiveNetworkWidget />
                    <InfoPanel />
                </div>

                <div className={styles.rightColumn}>
                    <ActiveActorsWidget />
                </div>
            </div>
        );
    }

    // No Live NodeNetworks
    return (
        <div className={styles.noCrisisContainer}>
            <div className={styles.welcomeBox}>
                <div className={styles.leftText}>
                    <h2>Velkommen!</h2>
                    {user.username ? (
                        <>
                            <p className={styles.userName}>{user.username}</p>
                            <p>
                                {user.role} <br />
                                {user.organisasjon} | {user.stat}
                            </p>
                        </>
                    ) : (
                        <p>Laster brukerdata...</p>
                    )}
                </div>
                <div className={styles.rightText}>
                    <p>Ingen pågående hendelser er registrert</p>
                    <WiDaySunny className={styles.sunIcon} />
                </div>
            </div>

            <div className={styles.cardGrid}>
                <Link to="/newNetwork">
                    <Box title="Nytt Nettverk" iconSrc={newNetworkIcon} />
                </Link>

                <Link to="/networkArchive">
                    <Box title="Nettverks Arkiv" iconSrc={networkArchiveIcon} disableLink />
                </Link>

                <Link to="/actorsAll">
                    <Box title="Alle Aktører" icon="users" />
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;
