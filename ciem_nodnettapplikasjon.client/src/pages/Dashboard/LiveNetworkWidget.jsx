import React from "react";
import styles from "./Widget.module.css";

function LiveNetworkWidget() {
  return (
    <div className={styles.widget}>
      <h2>LIVE KHN</h2>
      <div className={styles.networkPlaceholder}>📊 Network Graph Here</div>
    </div>
  );
}

export default LiveNetworkWidget;
