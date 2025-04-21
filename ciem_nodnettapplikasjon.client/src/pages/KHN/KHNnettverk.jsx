import React from 'react';
import styles from './KHNnettverk.module.css';
import LiveNetworkWidget from "../../components/DashboardComponents/LiveNetworkWidget";
import Box from '../../components/Box/Box';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

function KHNnettverk() {
    const [situations, setSituations] = useState([]);

  useEffect(() => {
    fetch("https://localhost:5255/api/khn/situations")
      .then(res => res.json())
      .then(data => setSituations(data));
  }, []);

    const liveSituations = situations.filter(s => s.status === "Live");
   
    return (
        <div className={styles.container}>
            <div className={styles.dashboard}>

                <div className={styles.leftSection}>
                    {liveSituations.length === 0 ? (
                        <div className={styles.noBox}>
                            <p> Ingen pågående kriser registrert</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {liveSituations.map((situation) => (
                                <Link
                                    key={situation.networkId}
                                    to={`/khn/${situation.networkId}`}
                                    className={styles.cardLink}
                                >
                                    <div style={{ position: "relative" }}>
                                        <LiveNetworkWidget title={situation.title} />
                                        <div className={styles.liveIndicator}>LIVE</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
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

export default KHNnettverk;
