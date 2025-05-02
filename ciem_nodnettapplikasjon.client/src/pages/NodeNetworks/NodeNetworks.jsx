import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NodeNetworks.module.css';
import Box from '../../components/Box/Box';
import newNetworkIcon from '../../assets/newNetwork.svg';
import networkArchiveIcon from '../../assets/networkArchive.svg';

function NodeNetworks() {
  // State to store the list of situations fetched from the API
  const [situations, setSituations] = useState([]);

  // Function to fetch all network situations from the API
  const FetchAllNetworks = async () => {
    try {
      const response = await fetch('https://ciem-nodnettapplikasjon.onrender.com/api/NodeNetworks/situations'); // API call to fetch situations
      const data = await response.json(); // Parse the JSON response
      console.log(data); // Log the fetched data for debugging
      setSituations(data); // Update the state with the fetched situations
    } catch (error) {
      console.error('Error fetching network situations:', error); // Log any errors that occur during the fetch
    }
  };

  // useEffect to call FetchAllNetworks when the component mounts
  useEffect(() => {
    FetchAllNetworks();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Filter the situations to get only the live (non-archived) ones
  const liveSituations = situations.filter((s) => !s.isArchived);

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        {/* Left section to display live network situations */}
        <div className={styles.leftSection}>
          {liveSituations.length === 0 ? (
            // Display a message if no live situations are available
            <div className={styles.noBox}>
              <p>Ingen pågående hendelser registrert</p>
            </div>
          ) : (
            // Display a grid of live situations
            <div className={styles.grid}>
              {liveSituations.map((situation) => {
                // Retrieve a screenshot from localStorage for the situation
                const screenshot = localStorage.getItem(`screenshot-${situation.networkId}`);

                return (
                  <Link
                    key={situation.networkId} // Unique key for each situation
                    to={`/liveNetwork/${situation.networkId}`} // Link to the live network page
                    className={styles.cardLink}
                  >
                    <div className={styles.card}>
                      {/* Display the network name */}
                      <div className={styles.networkName}>
                        <p>{situation.title}</p>
                      </div>

                      {/* Display the screenshot or a placeholder if no screenshot is available */}
                      <div className={styles.cardContent}>
                        {screenshot ? (
                          <img src={screenshot} alt="Network preview" className={styles.networkImage} />
                        ) : (
                          <div className={styles.placeholder}>Ingen forhåndsvisning</div>
                        )}
                      </div>

                      {/* Display a LIVE tag for live situations */}
                      <div className={styles.liveTag}>LIVE</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right section with links to create a new network or view the network archive */}
        <div className={styles.rightSection}>
          <Link to="/newNetwork">
            <Box title="Nytt Nettverk" iconSrc={newNetworkIcon} />
          </Link>

          <Link to="/networkArchive" style={{ textDecoration: 'none' }}>
            <Box title="Nettverks Arkiv" iconSrc={networkArchiveIcon} disableLink />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NodeNetworks;