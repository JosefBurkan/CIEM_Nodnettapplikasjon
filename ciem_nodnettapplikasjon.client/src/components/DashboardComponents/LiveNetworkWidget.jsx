import React from "react";
import styles from "./LiveNetworkWidget.module.css";
import LiveNetworkPreview from "./LiveNetworkPreview";

const LiveNetworkWidget = ({ title, networkId }) => {
  return (
    <div className={styles.widget}>
      <div className={styles.label}>{title || "LIVE KHN"}</div>
      <LiveNetworkPreview networkId={networkId} />
    </div>
  );
};

export default LiveNetworkWidget;
