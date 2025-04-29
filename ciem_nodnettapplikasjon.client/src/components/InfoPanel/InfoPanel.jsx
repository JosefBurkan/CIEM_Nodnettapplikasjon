// InfoPanel.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";  // ← make sure this path is correct
import styles from "./InfoPanel.module.css";
import checkListIcon from "../../assets/checkList.svg";
import SeverityDots from "../../components/SeverityDots/SeverityDots.jsx";

export default function InfoPanel({
  layout = "horizontal", // Default to "horizontal"
  showEdit = true,
  showComm = true,
}) {
  //
  // --- Live networks dropdown state via Supabase ---
  //
  const [liveNetworks, setLiveNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [backupNetwork, setBackupNetwork] = useState("");
  const [lastEditNetwork, setLastEditNetwork] = useState(null);

  // Fetch all live networks on mount
  useEffect(() => {
    async function loadNetworks() {
      const { data, error } = await supabase
        .from("NodeNetworks") // Ensure the table name is correct
        .select("networkID, name");

      if (error) {
        console.error("Error fetching networks:", error);
      } else {
        console.log("Fetched networks:", data); // Log the fetched data
        if (data.length > 0) {
          console.log("Network names:", data.map((net) => net.name)); // Log network names
        } else {
          console.log("No networks found in the NodeNetworks table.");
        }
        setLiveNetworks(data);
        if (data.length && !selectedNetwork) {
          setSelectedNetwork(data[0].networkID);
        }
      }
    }
    loadNetworks();
  }, []);



  //
  // --- Left‑side fields + backups + timestamp ---
  //
  const [hendelse, setHendelse] = useState("Hendelse beskrivelse...");
  const [nivaa, setNivaa] = useState("Nivå...");
  const [lokasjon, setLokasjon] = useState("Lokasjon...");
  const [backupLeft, setBackupLeft] = useState({ hendelse, nivaa, lokasjon });
  const [lastEditLeft, setLastEditLeft] = useState(null);

  //
  // --- Global edit flag ---
  //
  const [isEditing, setIsEditing] = useState(false);

  //
  // --- Panels state + backup + per‑panel timestamp ---
  //
  const [items, setItems] = useState([
    { id: 1, type: "sikkerhet", values: { omrade: 3, struktur: 2, eskalering: 1 }, lastEdit: null },
    { id: 2, type: "default", values: { evakuert: 18, gjenværende: 4, savnet: 5 }, lastEdit: null },
    { id: 3, type: "default", values: { pasienter: 7 }, lastEdit: null },
    { id: 4, type: "sikkerhet", values: { kjoretoy: 3, droner: 2, letehunder: 1 }, lastEdit: null },
  ]);
  
  const [backupItems, setBackupItems] = useState(
    items.map(i => ({ id: i.id, values: { ...i.values } }))
  );

  //
  // --- Communication timestamp ---
  //
  const [kommunikasjonTime, setKommunikasjonTime] = useState(null);

  //
  // --- Enter global edit mode: backup everything ---
  //
  const startGlobalEdit = () => {
    setBackupNetwork(selectedNetwork);
    setBackupLeft({ hendelse, nivaa, lokasjon });
    setBackupItems(items.map(i => ({ id: i.id, values: { ...i.values } })));
    setIsEditing(true);
  };

  //
  // --- Cancel edits: restore backups ---
  //
  const cancelGlobalEdit = () => {
    setSelectedNetwork(backupNetwork);
    setHendelse(backupLeft.hendelse);
    setNivaa(backupLeft.nivaa);
    setLokasjon(backupLeft.lokasjon);
    setItems(prev =>
      prev.map(it => {
        const b = backupItems.find(bi => bi.id === it.id);
        return { ...it, values: { ...b.values } };
      })
    );
    setIsEditing(false);
  };

  //
  // --- Confirm edits: update only changed timestamps ---
  //
  const confirmGlobalEdit = () => {
    const now = new Date();

    // Dropdown
    if (selectedNetwork !== backupNetwork) {
      setLastEditNetwork(now);
    }

    // Left fields
    if (
      hendelse !== backupLeft.hendelse ||
      nivaa     !== backupLeft.nivaa     ||
      lokasjon  !== backupLeft.lokasjon
    ) {
      setLastEditLeft(now);
    }

    // Panels
    setItems(prev =>
      prev.map(it => {
        const b = backupItems.find(bi => bi.id === it.id).values;
        const changed = JSON.stringify(it.values) !== JSON.stringify(b);
        return { ...it, lastEdit: changed ? now : it.lastEdit };
      })
    );

    setIsEditing(false);
  };

  //
  // --- Update one panel field ---
  //
  const updateField = (id, key, val) => {
    setItems(prev =>
      prev.map(it =>
        it.id === id
          ? { ...it, values: { ...it.values, [key]: val } }
          : it
      )
    );
  };

  //
  // --- Render a single panel card ---
  //
  const renderItem = it => (
    <div key={it.id} className={styles.infoItem}>
      <div className={styles.displayValues}>
        <strong>Sist oppdatering:</strong>{" "}
        {it.lastEdit ? it.lastEdit.toLocaleTimeString() : "Ingen endringer"}
      </div>
      {isEditing ? (
        Object.entries(it.values).map(([k, v]) => (
          <div key={k} className={styles.editField}>
            <label>{k.charAt(0).toUpperCase() + k.slice(1)}:</label>
            <input
              type={it.type === "sikkerhet" ? "number" : "text"}
              min={it.type === "sikkerhet" ? 0 : undefined}
              max={it.type === "sikkerhet" ? 5 : undefined}
              value={v}
              onChange={e =>
                updateField(
                  it.id,
                  k,
                  it.type === "sikkerhet"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
            />
          </div>
        ))
      ) : it.type === "sikkerhet" ? (
        <div className={styles.displayValues}>
          {Object.entries(it.values).map(([k, v]) => (
            <div key={k}>
              <strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong>{" "}
              <SeverityDots level={v} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.displayValues}>
          {Object.entries(it.values)
            .map(([k, v]) =>
              `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`
            )
            .join(" | ")}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.infoSjekkContainer}>
      {/* Header */}
      <div className={styles.infoHeader}>
        <img src={checkListIcon} alt="" className={styles.infoIcon} />
        <h2>Infosjekkliste</h2>
        {showEdit && !isEditing && (
          <button className={styles.editModeButton} onClick={startGlobalEdit}>
            ✏️
          </button>
        )}
        {isEditing && (
          <>
            <button
              className={styles.saveChangesButton}
              onClick={confirmGlobalEdit}
            >
              ✔️
            </button>
            <button
              className={styles.cancelChangesButton}
              onClick={cancelGlobalEdit}
            >
              ❌
            </button>
          </>
        )}
      </div>

      {/* Network dropdown */}
      <div className={styles.dropdownField}>
        <label>Nettverk:</label>
        <select
          value={selectedNetwork}
          onChange={e => setSelectedNetwork(e.target.value)}
          disabled={!isEditing}
        >
          <option value="">— Ingen valgt —</option>
          {liveNetworks.map(net => (
            <option key={net.networkID} value={net.networkID}>
              {net.name}
            </option>
          ))}
        </select>
        <div className={styles.displayValues}>
          <strong>Sist oppdatering:</strong>{" "}
          {lastEditNetwork
            ? lastEditNetwork.toLocaleTimeString()
            : "Ingen endringer"}
        </div>
      </div>

      {/* Main content */}
      <div
        className={
          layout === "vertical"
            ? styles.infoSjekkContentVertical
            : styles.infoSjekkContent
        }
      >
        {/* Left side event details */}
        <div className={styles.infoLeft}>
          <div className={styles.displayValues}>
            <strong>Sist oppdatering:</strong>{" "}
            {lastEditLeft
              ? lastEditLeft.toLocaleTimeString()
              : "Ingen endringer"}
          </div>
          {isEditing ? (
            <>
              <div className={styles.infoField}>
                <label>Hendelse Beskrivelse:</label>
                <textarea
                  value={hendelse}
                  onChange={e => setHendelse(e.target.value)}
                />
              </div>
              <div className={styles.infoField}>
                <label>Nivå:</label>
                <input
                  type="text"
                  value={nivaa}
                  onChange={e => setNivaa(e.target.value)}
                />
              </div>
              <div className={styles.infoField}>
                <label>Lokasjon:</label>
                <input
                  type="text"
                  value={lokasjon}
                  onChange={e => setLokasjon(e.target.value)}
                />
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

        {/* Right side panels */}
        <div
          className={
            layout === "vertical"
              ? styles.infoRightVertical
              : styles.infoRightGrid
          }
        >
          {items.map(renderItem)}
        </div>
      </div>

      {/* Communication timestamp */}
      {showComm && (
        <div className={styles.kommunikasjonRow}>
          <span>Sist kommunikasjon med aktør:</span>{" "}
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
}