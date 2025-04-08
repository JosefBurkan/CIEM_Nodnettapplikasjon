import React, { useEffect, useState } from 'react';
import styles from './KHNnettverk.module.css';
import LiveNetworkWidget from "../../components/DashboardComponents/LiveNetworkWidget";
import Box from '../../components/Box/Box';
import { Link } from 'react-router-dom';
import { ReactFlowProvider } from "@xyflow/react";

function KHNnettverk() {
  const [situations, setSituations] = useState([]);

  useEffect(() => {
    fetch("/api/khn/situations")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched situations:", data);
        setSituations(data);
      })
      .catch(err => {
        console.error("Failed to fetch situations:", err);
        setSituations([]);
      });
  }, []);

  const liveSituations = situations.filter(s => s.status === "Live");

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>

        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          <ReactFlowProvider>
            {liveSituations.length === 0 ? (
              <div className={styles.noBox}>
                <p>Ingen pågående kriser registrert</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {liveSituations.map((situation) => (
                  <Link
                    key={situation.networkId}
                    to={`/khn/${situation.networkId}`}
                    className={styles.cardLink}
                  >
                    <LiveNetworkWidget
                      title={situation.title}
                      networkId={situation.networkId}
                    />
                  </Link>
                ))}
              </div>
            )}
          </ReactFlowProvider>
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.rightSection}>
          <Link to="/newNetwork">
            <Box title="Nytt Nettverk" icon="grid-add" />
          </Link>
          <Link to="/nettverks-arkiv" style={{ textDecoration: 'none' }}>
            <Box title="Nettverks Arkiv" boxIconColor="red" disableLink />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default KHNnettverk;
