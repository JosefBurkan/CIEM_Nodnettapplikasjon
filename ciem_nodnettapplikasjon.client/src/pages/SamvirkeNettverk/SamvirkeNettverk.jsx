import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SamvirkeNettverk.module.css';
import Box from '../../components/Box/Box';
import LiveNetworkWidget from '../../components/DashboardComponents/LiveNetworkWidget';

function SamvirkeNettverk() {
  const [situations, setSituations] = useState([]);

  useEffect(() => {
    fetch('https://localhost:5255/api/samvirkeNettverk/situations')
      .then((res) => res.json())
      .then((data) => setSituations(data));
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
              {liveSituations.map((situation) => (
                <Link
                  key={situation.networkId}
                  to={`/sn/${situation.networkId}`}
                  className={styles.cardLink}
                >
                  <div style={{ position: 'relative' }} className={styles.previewCard}>
                    <img
                      src={`https://vigjqzuqrnxapqxhkwds.supabase.co/storage/v1/object/public/screenshots/${situation.networkId}.png`}
                      onError={(e) => (e.target.src = '/fallback-thumbnail.png')}
                      alt={situation.title}
                      className={styles.thumbnail}
                    />
                    <LiveNetworkWidget title={situation.title} />
                    <div className={styles.liveIndicator}>LIVE</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

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

export default SamvirkeNettverk;