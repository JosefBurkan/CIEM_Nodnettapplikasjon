import React from "react";
import UpdatesWidget from "./UpdatesWidget";
import CriticalInfoWidget from "./CriticalInfoWidget";
import ActiveActorsWidget from "./ActiveActorsWidget";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Left Column */}
      <div className={styles.leftColumn}>
        <UpdatesWidget />
      </div>

      {/* Center Column (for future widgets like Live Network Graph if needed) */}
      <div className={styles.centerColumn}>
        <CriticalInfoWidget />
      </div>

      {/* Right Column */}
      <div className={styles.rightColumn}>
        <ActiveActorsWidget />
      </div>
    </div>
  );
}

export default Dashboard;
