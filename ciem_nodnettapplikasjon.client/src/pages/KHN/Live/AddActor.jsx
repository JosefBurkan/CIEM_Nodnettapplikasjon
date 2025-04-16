import React, { useState, useEffect } from "react";
import styles from "./AddActor.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";

function AddActor({ onClose, onActorAdded, existingActors, defaultParent, networkID }) {
  const [step, setStep] = useState("choose"); // "choose" eller "create"
  // Denne staten skal inneholde alle aktører som ligger i databasen – samme logikk som i CreateActor
  const [dbActors, setDbActors] = useState([]);
  
  const [formData, setFormData] = useState({
    hierarchy: "Overordnet",
    name: "",
    phone: "",
    category: "",
    actorType: "",
    description: "",
    parentID: defaultParent?.nodeID || ""
  });
  const [error, setError] = useState("");

  // Hent aktører direkte fra DB når modalen lastes
  useEffect(() => {
    const fetchDbActors = async () => {
      try {
        const res = await fetch("https://localhost:5255/api/actor");
        if (res.ok) {
          const data = await res.json();
          setDbActors(data);
        } else {
          console.error("Klarte ikke hente aktører fra databasen");
        }
      } catch (err) {
        console.error("Feil ved henting av DB-aktører:", err);
      }
    };
    fetchDbActors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.actorType) {
      setError("Fyll inn alle obligatoriske felter");
      return;
    }
    if (formData.hierarchy === "Underaktør" && !formData.parentID) {
      setError("Velg en overordnet aktør");
      return;
    }

    const newActor = {
      name: formData.name,
      phone: formData.phone,
      beskrivelse: formData.description,
      parentID: formData.hierarchy === "Underaktør" ? parseInt(formData.parentID) : null,
      networkID: networkID,
      category: formData.category,
      type: formData.actorType,
      hierarchyLevel: formData.hierarchy,
    };

    try {
      const res = await fetch("https://localhost:5255/api/nodes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newActor),
      });

      if (res.ok) {
        const savedActor = await res.json();
        onActorAdded(savedActor);
        onClose();
        setStep("choose"); // reset til steg 1 neste gang
      } else {
        const err = await res.json();
        console.error("Failed to save actor:", err);
        setError("Noe gikk galt ved lagring.");
      }
    } catch (err) {
      console.error("Request error:", err);
      setError("Kunne ikke koble til serveren.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button
          onClick={() => {
            onClose();
            setStep("choose");
          }}
          className={styles.closeButton}
        >
          X
        </button>

        {step === "choose" && (
          <>
            <h2>Ny Aktør</h2>
            <p>Søk etter eksisterende aktør fra databasen:</p>
            {/* Bruk dbActors her – logikken for søkeresultatene er det samme som i CreateActor */}
            <SearchBar
              actors={dbActors}
              onSelectActor={(actor) => {
                // Her kan du velge å enten:
                // 1. Direkte sende tilbake aktøren slik at den legges inn i nettverket
                // 2. Eller åpne en videre prosess for å velge parent (for underaktør-flyten)
                onActorAdded(actor);
                onClose();
              }}
              enableDropdown={true}
              placeholder="Søk etter aktør..."
            />

            <p style={{ textAlign: "center", margin: "1rem 0" }}>eller...</p>

            <button onClick={() => setStep("create")}>Opprett ny Aktør</button>
          </>
        )}

        {step === "create" && (
          <>
            <h2>Opprett Ny Aktør</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="hierarchy">Velg Hierarki:</label>
              <select
                id="hierarchy"
                name="hierarchy"
                value={formData.hierarchy}
                onChange={handleChange}
                required
              >
                <option value="Overordnet">Overordnet</option>
                <option value="Underaktør">Underaktør</option>
              </select>

              {formData.hierarchy === "Underaktør" && (
                <>
                  <label htmlFor="parentID">Velg overordnet aktør:</label>
                  <select
                    id="parentID"
                    name="parentID"
                    value={formData.parentID}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Velg aktør</option>
                    {existingActors.map((actor) => (
                      <option key={actor.nodeID || actor.id} value={actor.nodeID || actor.id}>
                        {actor.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label htmlFor="name">Navn:</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Navn..."
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="phone">Telefonnummer:</label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Telefonnummer..."
                value={formData.phone}
                onChange={handleChange}
              />

              <label htmlFor="category">Kategori:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Velg kategori</option>
                <option value="Private">Private</option>
                <option value="Frivillige">Frivillige</option>
                <option value="Statlige">Statlige</option>
              </select>

              <label htmlFor="actorType">Type:</label>
              <select
                id="actorType"
                name="actorType"
                value={formData.actorType}
                onChange={handleChange}
                required
              >
                <option value="">Velg type</option>
                <option value="person">Person</option>
                <option value="organisasjon">Organisasjon</option>
              </select>

              <label htmlFor="description">Beskrivelse:</label>
              <textarea
                id="description"
                name="description"
                placeholder="Beskrivelse..."
                value={formData.description}
                onChange={handleChange}
              />

              <button type="submit">Opprett Aktør</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AddActor;
