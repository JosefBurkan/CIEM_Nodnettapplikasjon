import React, { useState } from "react";
import styles from "./InfoPanel.module.css";
import checkListIcon from "../../assets/checkList.svg"; // Adjust path if needed
// Import SeverityDots so you can use it for "sikkerhet" items
import SeverityDots from "../../components/SeverityDots/SeverityDots.jsx";

const InfoPanel = ({ layout, showEdit = true, showComm = true }) => {
  const [infoEditMode, setInfoEditMode] = useState(false);
  const [hendelse, setHendelse] = useState("Hendelse beskrivelse...");
  const [nivaa, setNivaa] = useState("Nivå...");
  const [lokasjon, setLokasjon] = useState("Lokasjon...");
  const [infoBackup, setInfoBackup] = useState({
    hendelse: "Hendelse beskrivelse...",
    nivaa: "Nivå...",
    lokasjon: "Lokasjon...",
  });
  const [kommunikasjonTime, setKommunikasjonTime] = useState(null);

  const [infoItems] = useState([
    {
      id: 1,
      type: "sikkerhet",
      initialValues: { omrade: 3, struktur: 2, eskalering: 1 },
    },
    {
      id: 2,
      type: "default",
      initialValues: { evakuert: 18, gjenværende: 4, savnet: 5 },
    },
    {
      id: 3,
      type: "default",
      initialValues: { pasienter: 7 },
    },
  ]);

  // Render a single info item.
  // For "sikkerhet" items, wrap each piece in a div to avoid nesting <div> inside <p>
  const renderInfoItem = (item) => {
    if (item.type === "sikkerhet") {
      return (
        <div key={item.id} className={styles.infoItem}>
          <div>
            <strong>Område:</strong>{" "}
            <SeverityDots level={item.initialValues.omrade} />
          </div>
          <div>
            <strong>Struktur:</strong>{" "}
            <SeverityDots level={item.initialValues.struktur} />
          </div>
          <div>
            <strong>Eskalering:</strong>{" "}
            <SeverityDots level={item.initialValues.eskalering} />
          </div>
        </div>
      );
    } else {
      return (
        <div key={item.id} className={styles.infoItem}>
          <div>
            {Object.keys(item.initialValues)
              .map(
                (key) =>
                  `${key.charAt(0).toUpperCase() + key.slice(1)}: ${item.initialValues[key]}`
              )
              .join(" | ")}
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.infoSjekkContainer}>
      {/* Header */}
      <div className={styles.infoHeader}>
        <img
          src={checkListIcon}
          alt="Infosjekkliste Icon"
          className={styles.infoIcon}
        />
        <h2>Infosjekkliste</h2>
        {showEdit && !infoEditMode && (
          <button
            className={styles.editModeButton}
            onClick={() => {
              setInfoBackup({ hendelse, nivaa, lokasjon });
              setInfoEditMode(true);
            }}
          >
            ✏️
          </button>
        )}
      </div>

      {/* Main content container: conditional class based on layout prop */}
      <div
        className={
          layout === "vertical"
            ? styles.infoSjekkContentVertical
            : styles.infoSjekkContent
        }
      >
        <div className={styles.infoLeft}>
          {infoEditMode ? (
            <>
              <div className={styles.infoField}>
                <label>Hendelse Beskrivelse:</label>
                <textarea
                  value={hendelse}
                  onChange={(e) => setHendelse(e.target.value)}
                />
              </div>
              <div className={styles.infoField}>
                <label>Nivå:</label>
                <input
                  type="text"
                  value={nivaa}
                  onChange={(e) => setNivaa(e.target.value)}
                />
              </div>
              <div className={styles.infoField}>
                <label>Lokasjon:</label>
                <input
                  type="text"
                  value={lokasjon}
                  onChange={(e) => setLokasjon(e.target.value)}
                />
              </div>
              <div className={styles.editButtons}>
                <button
                  className={styles.saveChangesButton}
                  onClick={() => setInfoEditMode(false)}
                >
                  Bekreft
                </button>
                <button
                  className={styles.cancelChangesButton}
                  onClick={() => {
                    setHendelse(infoBackup.hendelse);
                    setNivaa(infoBackup.nivaa);
                    setLokasjon(infoBackup.lokasjon);
                    setInfoEditMode(false);
                  }}
                >
                  Avbryt
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>Hendelse Beskrivelse:</strong> {hendelse}
              </div>
              <div>
                <strong>Nivå:</strong> {nivaa}
              </div>
              <div>
                <strong>Lokasjon:</strong> {lokasjon}
              </div>
            </>
          )}
        </div>

        {/* Conditional right section layout */}
        <div
          className={
            layout === "vertical" ? styles.infoRightVertical : styles.infoRightGrid
          }
        >
          {infoItems.map((item) => renderInfoItem(item))}
        </div>
      </div>

      {/* Communication Timestamp Row - rendered conditionally */}
      {showComm && (
        <div className={styles.kommunikasjonRow}>
          <span>Sist kommunikasjon med aktør:</span>
          <span className={styles.gittTime}>
            {kommunikasjonTime
              ? kommunikasjonTime.toLocaleTimeString()
              : "Ikke oppdatert"}
          </span>
          <button
            className={styles.timestampButton}
            onClick={() => setKommunikasjonTime(new Date())}
          >
            Oppdater
          </button>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
