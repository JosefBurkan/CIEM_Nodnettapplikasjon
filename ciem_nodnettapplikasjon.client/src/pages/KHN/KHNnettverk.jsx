import React from 'react';
import styles from './KHNnettverk.module.css';
import LiveNetworkWidget from "../../components/DashboardComponents/LiveNetworkWidget";
import Box from '../../components/Box/Box';
import { Link } from 'react-router-dom';
import { ReactFlowProvider } from "@xyflow/react";

function KHSnettverk() {
  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>

        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          <ReactFlowProvider>
            {/* 👇 Entire widget wrapped in Link */}
            <Link to="/liveKHN" className={styles.widgetLink}>
              <LiveNetworkWidget large />
            </Link>
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

export default KHSnettverk;
