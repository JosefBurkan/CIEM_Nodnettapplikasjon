import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NodeNetworks.module.css';
import Box from '../../components/Box/Box';
import newNetworkIcon from '../../assets/newNetwork.svg';
import networkArchiveIcon from '../../assets/networkArchive.svg';

function NodeNetworks() {
  const [situations, setSituations] = useState([]);

  const FetchAllNetworks = async () => {

    const response = await fetch('https://localhost:5255/api/NodeNetworks/situations')
    const data = await response.json();
    console.log(data);
    setSituations(data);

  }

  useEffect(() => {
    FetchAllNetworks();
  }, []);

  const liveSituations = situations.filter((s) => !s.isArchived);

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <div className={styles.leftSection}>
          {liveSituations.length === 0 ? (
            <div className={styles.noBox}>
              <p>Ingen pågående hendelser registrert</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {liveSituations.map((situation) => {
                const screenshot = localStorage.getItem(`screenshot-${situation.networkId}`);

                return (
                  <Link
                    key={situation.networkId}
                    to={`/sn/${situation.networkId}`}
                    className={styles.cardLink}
                  >
                    <div className={styles.card}>

                      {/* 🔴 Nettverksnavn på toppen */}
                      <div className={styles.networkName}>
                          <p>
                            {situation.title}
                          </p>
                      </div>

                      {/* 🔳 Bilde eller placeholder */}
                      <div className={styles.cardContent}>
                        {screenshot ? (
                          <img src={screenshot} alt="Network preview" className={styles.networkImage} />
                        ) : (
                          <div className={styles.placeholder}>Ingen forhåndsvisning</div>
                        )}
                      </div>

                      {/* 🔴 LIVE-tag på bildet */}
                      <div className={styles.liveTag}>LIVE</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.rightSection}>
                    <Link to="/newNetwork">
            <Box title="Nytt Nettverk" iconSrc={newNetworkIcon} />
          </Link>

          <Link to="/nettverks-arkiv" style={{ textDecoration: 'none' }}>
            <Box title="Nettverks Arkiv" iconSrc={networkArchiveIcon} disableLink />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NodeNetworks;
