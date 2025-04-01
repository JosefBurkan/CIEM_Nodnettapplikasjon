import React from "react";
import styles from "./LiveNetworkWidget.module.css";
import LiveNetworkPreview from "./LiveNetworkPreview";

function LiveNetworkWidget({ large }) {
  return (
    <div className={`${styles.widget} ${large ? styles.large : ""}`}>
      <div className={styles.label}>LIVE KHN</div>
      <LiveNetworkPreview />
    </div>
  );
}

export default LiveNetworkWidget;
