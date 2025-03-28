import React from "react";
import UpdatesWidget from "../../components/DashboardComponents/UpdatesWidget";
import CriticalInfoWidget from "../../components/DashboardComponents/CriticalInfoWidget";
import ActiveActorsWidget from "../../components/DashboardComponents/ActiveActorsWidget";
import LiveNetworkWidget from "../../components/DashboardComponents/LiveNetworkWidget";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Left Column */}
      <div className={styles.leftColumn}>
        <UpdatesWidget />
      </div>


 

      {/* Center Column */}
      <div className={styles.centerColumn}>
        <LiveNetworkWidget />
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
