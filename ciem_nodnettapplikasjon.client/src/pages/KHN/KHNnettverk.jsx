import React from 'react';
import styles from './KHNnettverk.module.css';
import LiveNetworkWidget from "../../components/DashboardComponents/LiveNetworkWidget";
import Box from '../../components/Box/Box';
import { Link } from 'react-router-dom';

function KHSnettverk() {


    return (
        <div className={styles.container}>
            <div className={styles.dashboard}>

                <div className={styles.leftSection}>
                     <Link to="/liveKHN">
                        <LiveNetworkWidget large />
                    </Link>
                    <button className={styles.editButton}>Rediger Nettverk</button>
                </div>

                <div className={styles.rightSection}>
                       <Link to ="/newNetwork">
                        <Box title="Nytt Nettverk" icon="grid-add" />
                    </Link>

                    <Link to="/nettverks-arkiv" style={{ textDecoration: 'none' }}>
                        <Box title="Nettverks Arkiv" boxIconColor="red" disableLink/>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}

export default KHSnettverk;