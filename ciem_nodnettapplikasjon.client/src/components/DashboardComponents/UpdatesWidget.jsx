import React from "react";
import styles from "./UpdatesWidget.module.css";

function UpdatesWidget() {
  const updates = [
    { actor: "Aktør 1", time: "18:54", color: "#D22D2D" },  // Red
    { actor: "Aktør 2", time: "18:54", color: "#D22D2D" },  // Red
    { actor: "Aktør 3", time: "18:55", color: "#D22D2D" },  // Red
    { actor: "Aktør 4", time: "18:56", color: "#D22D2D" },  // Red
    { actor: "Aktør 5", time: "18:57", color: "#D22D2D" },  // Red
    { actor: "Aktør 6", time: "18:58", color: "#E69526" },  // Orange
    { actor: "Aktør 7", time: "18:58", color: "#E69526" },  // Orange
    { actor: "Aktør 8", time: "18:59", color: "#E69526" },  // Orange
    { actor: "Aktør 9", time: "19:00", color: "#4CAF50" },  // Green
    { actor: "Aktør 10", time: "19:03", color: "#4CAF50" }, // Green
    { actor: "Aktør 11", time: "19:04", color: "#4CAF50" }, // Green
    { actor: "Aktør 12", time: "19:06", color: "#4CAF50" }, // Green
    { actor: "Aktør 13", time: "19:07", color: "#4CAF50" }, // Green
    { actor: "Aktør 14", time: "19:07", color: "#4CAF50" }, // Green
  ];

  return (
    <div className={styles.widgetContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        NESTE OPPDATERING
      </div>

      {/* List of Updates */}
      <ul className={styles.list}>
        {updates.map((update, index) => (
          <li key={index} className={styles.listItem}>
            <span className={styles.actor}>{update.actor}</span>
            <span className={styles.time}>Sist Oppdatert : {update.time}</span>
            <div className={styles.underline} style={{ backgroundColor: update.color }}></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UpdatesWidget;
