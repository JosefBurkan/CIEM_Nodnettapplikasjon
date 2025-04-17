import React, { useEffect, useState } from 'react';
import styles from './LiveNettverkPreview.module.css';

const LiveNettverkPreview = () => {
  const [networks, setNetworks] = useState([]);

  // Fetch from your API that returns network data
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const res = await fetch('https://localhost:5255/api/KHN/all'); // Adjust API if needed
        const data = await res.json();
        setNetworks(data);
      } catch (err) {
        console.error('Failed to fetch networks:', err);
      }
    };

    fetchNetworks();
  }, []);

  return (
    <div className={styles.grid}>
      {networks.map((network) => {
        const screenshotUrl = `https://vigjqzuqrnxapqxhkwds.supabase.co/storage/v1/object/public/screenshots/${network.networkID}.png`;

        return (
          <div key={network.networkID} className={styles.card}>
            <img
              src={screenshotUrl}
              alt={`Screenshot for ${network.name}`}
              className={styles.thumbnail}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/fallback-thumbnail.png'; // local fallback
              }}
            />
            <div className={styles.overlay}>
              <h3>{network.name}</h3>
              <p>Status: {network.status}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveNettverkPreview;
