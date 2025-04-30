import React, { useState, useEffect } from 'react';
import { data, Link } from 'react-router-dom';
import styles from './SamvirkeNettverk.module.css';
import Box from '../../components/Box/Box';
import newNetworkIcon from '../../assets/newNetwork.svg';
import networkArchiveIcon from '../../assets/networkArchive.svg';

function SamvirkeNettverk() {
  const [situations, setSituations] = useState([]);

  useEffect(() => {
    fetch('https://localhost:5255/api/samvirkeNettverk/situations')
      .then((res) => res.json())
      .then((data) => setSituations(data))
      .catch((err) => console.error('Failed to fetch situations:', err));
    console.log(data);
  }, []);

  const liveSituations = situations.filter((s) => s.status === 'Live');

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
                      <div className={styles.networkName}> <p>{situation.status}</p></div>

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

export default SamvirkeNettverk;
