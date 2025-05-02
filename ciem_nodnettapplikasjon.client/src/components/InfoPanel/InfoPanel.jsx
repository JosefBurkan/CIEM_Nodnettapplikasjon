import React, { useState, useEffect, useCallback } from "react";
import styles from "./InfoPanel.module.css";
import checkListIcon from "../../assets/checkList.svg";
import SeverityDots from "../SeverityDots/SeverityDots";

// Main InfoPanel component to display event details and related information
export default function InfoPanel({ layout = "horizontal", showComm = true, hideSections = [] }) {
  const [items, setItems] = useState([]); // State to store fetched data
  const [modalContent, setModalContent] = useState(null); // State to store content for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility

  // Memoized function to fetch data for the InfoPanel from the API
  const getInfoPanel = useCallback(async () => {
    try {
      const response = await fetch("https://ciem-nodnettapplikasjon.onrender.com/api/InfoPanel/retrieveInfoPanel");
      const data = await response.json();
      setItems(data); // Updates the state with fetched data
      console.log(data); // Logs the data for debugging
    } catch (error) {
      console.log(error); // Logs errors if the fetch fails
    }
  }, []); // Empty dependency array ensures this function is memoized

  // Use useEffect to call getInfoPanel only once when the component mounts
  useEffect(() => {
    getInfoPanel();
  }, [getInfoPanel]); // Dependency ensures this runs only when `getInfoPanel` changes

  // Opens the modal and sets its content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Closes the modal and clears its content
  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  // Renders individual information items with a title and fields
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
              <SeverityDots level={value || 0} /> // Displays severity dots for specific fields
            ) : (
              value || "N/A" // Displays value or "N/A" if value is missing
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${styles.infoSjekkContainer} ${layout === "vertical" ? styles.infoVertical : ""}`}>
      {/* Header section with icon and title */}
      <div className={styles.infoHeader}>
        <img src={checkListIcon} alt="" className={styles.infoIcon} />
        <h2>Informasjons Panel</h2>
      </div>

      {/* Main content section */}
      {items.map((item) => (
        <div key={item.id} className={layout === "vertical" ? styles.infoVertical : styles.infoContentWrapper}>
          {/* Left Side: Event details */}
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
                    {item.eventDescription.slice(0, 350)}... {/* Truncates long descriptions */}
                    <button
                      className={styles.readMoreButton}
                      onClick={() => openModal(item.eventDescription)} // Opens modal for full description
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

          {/* Right Side: Additional information */}
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

      {/* Modal for displaying full descriptions */}
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