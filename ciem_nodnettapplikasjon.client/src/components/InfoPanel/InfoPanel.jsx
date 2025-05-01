// InfoPanel.jsx
import React, { useEffect, useState } from "react";
import styles from "./InfoPanel.module.css";
import checkListIcon from "../../assets/checkList.svg";
import SeverityDots from "../SeverityDots/SeverityDots";

export default function InfoPanel({ layout = "horizontal", showComm = true, hideSections = [] }) {
  const [items, setItems] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:5255/api/InfoPanel/retrieveInfoPanel");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  const renderInfoItem = (title, fields) => (
    <div className={styles.infoBox}>
      <div className={styles.infoHeader}>
        <strong>{title}</strong>
      </div>
      <div className={styles.infoContent}>
        {fields.map(([label, value], index) => (
          <div key={index} className={styles.infoField}>
            <strong>{label}:</strong>{" "}
            {["Områdenivå", "Struktur", "Fare for eskalering", "Kjøretøy", "Droner", "Søkshunder"].includes(label) ? (
              <SeverityDots level={value || 0} />
            ) : (
              value || "N/A"
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${styles.infoSjekkContainer} ${layout === "vertical" ? styles.infoVertical : ""}`}>
      {/* Header */}
      <div className={styles.infoHeader}>
        <img src={checkListIcon} alt="" className={styles.infoIcon} />
        <h2>Informasjons Panel</h2>
      </div>

      {/* Main Content */}
      {items.map((item) => (
        <div key={item.id} className={layout === "vertical" ? styles.infoVertical : styles.infoContentWrapper}>
          {/* Left Side */}
          <div className={styles.infoLeft}>
            <div className={styles.infoField}>
              <strong>Navn på hendelse:</strong>
              <div className={styles.infoValue}>{item.eventName || "N/A"}</div>
            </div>
            <div className={styles.infoField}>
              <strong>Nivå:</strong>
              <div className={styles.infoValue}>{item.level || "N/A"}</div>
            </div>
            <div className={styles.infoField}>
              <strong>Lokasjon:</strong>
              <div className={styles.infoValue}>{item.exactPosition || "N/A"}</div>
            </div>
            <div className={styles.infoField}>
              <strong>Hendelse beskrivelse:</strong>
              <div className={styles.infoValue}>
                {item.eventDescription && item.eventDescription.length > 250 ? (
                  <>
                    {item.eventDescription.slice(0, 350)}...
                    <button
                      className={styles.readMoreButton}
                      onClick={() => openModal(item.eventDescription)}
                    >
                      Les mer
                    </button>
                  </>
                ) : (
                  item.eventDescription || "N/A"
                )}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className={styles.infoRight}>
            {!hideSections.includes("Sikkerhet") &&
              renderInfoItem("Sikkerhet", [
                ["Områdenivå", item.areaLevel],
                ["Struktur", item.structure],
                ["Fare for eskalering", item.escalation],
              ])}
            {!hideSections.includes("Evakuering") &&
              renderInfoItem("Evakuering", [
                ["Evakuerte", item.evacuated],
                ["Gjenværende", item.remaining],
                ["Savnet", item.missing],
              ])}
            {!hideSections.includes("Pasienter") &&
              renderInfoItem("Pasienter", [
                ["Skadde", item.injured],
                ["Omkomne", item.deceased],
                ["Uskadde", item.uninjured],
                ["Ukjent status", item.unknownStatus],
              ])}
            {!hideSections.includes("Tilgjengelighet") &&
              renderInfoItem("Tilgjengelighet", [
                ["Kjøretøy", item.vehicles],
                ["Droner", item.drones],
                ["Søkshunder", item.searchDogs],
              ])}
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <p>{modalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
}