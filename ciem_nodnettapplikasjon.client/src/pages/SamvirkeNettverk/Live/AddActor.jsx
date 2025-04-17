import React, { useState, useEffect } from "react";
import styles from "./AddActor.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";

function AddActor({ onClose, onActorAdded, existingActors = [], defaultParent, networkID }) {
  const [step, setStep] = useState("choose");
  const [dbActors, setDbActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [details, setDetails] = useState({
    parentID: defaultParent?.nodeID || "",
    description: "",
  });
  const [formData, setFormData] = useState({
    hierarchy: "Overordnet",
    name: "",
    phone: "",
    category: "",
    actorType: "",
    description: "",
    parentID: defaultParent?.nodeID || "",
  });
  const [error, setError] = useState("");

  // Hent aktører for søk
  useEffect(() => {
    async function fetchDbActors() {
      try {
        const res = await fetch("https://localhost:5255/api/actor");
        if (!res.ok) throw new Error("Klarte ikke hente aktører fra server");
        setDbActors(await res.json());
      } catch (e) {
        console.error(e);
      }
    }
    fetchDbActors();
  }, []);

  // Når bruker velger en eksisterende aktør i choose-step
  const handleSelectActor = (actor) => {
    setSelectedActor(actor);
    setDetails(prev => ({
      parentID: defaultParent?.nodeID || "",
      description: "",
    }));
    setError("");
  };

  // Oppdater detaljfelter for eksisterende aktør
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  // Legg til valgt eksisterende aktør som node via API
  const handleAddExisting = async () => {
    if (!selectedActor) {
      setError("Ingen aktør valgt");
      return;
    }
    try {
      const payload = {
        name: selectedActor.name,
        phone: selectedActor.phone || "",
        beskrivelse: details.description,
        parentID: details.parentID ? parseInt(details.parentID, 10) : null,
        networkID,
        category: selectedActor.category || "",
        type: selectedActor.type || "",
        hierarchyLevel: details.parentID ? "Underaktør" : "Overordnet",
      };
      const res = await fetch("https://localhost:5255/api/nodes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.title || "Lagring feilet");
      }
      const saved = await res.json();
      onActorAdded(saved);
      onClose();
    } catch (e) {
      console.error(e);
      setError(e.message || "Noe gikk galt");
    }
  };

  // Oppdater skjema for ny aktør
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  // Send ny aktør til API
  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    const { hierarchy, parentID, name, phone, category, actorType, description } = formData;
    if (!name || !category || !actorType) {
      setError("Fyll inn alle obligatoriske felter");
      return;
    }
    if (hierarchy === "Underaktør" && !parentID) {
      setError("Velg en overordnet aktør");
      return;
    }
    try {
      const payload = {
        name,
        phone,
        beskrivelse: description,
        parentID: hierarchy === "Underaktør" ? parseInt(parentID, 10) : null,
        networkID,
        category,
        type: actorType,
        hierarchyLevel: hierarchy,
      };
      const res = await fetch("https://localhost:5255/api/nodes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.title || "Lagring feilet");
      }
      const saved = await res.json();
      onActorAdded(saved);
      onClose();
    } catch (e) {
      console.error(e);
      setError(e.message || "Noe gikk galt");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>

        {step === "choose" ? (
          <>
            <h2>Legg til eksisterende aktør</h2>
            <SearchBar
              actors={dbActors}
              enableDropdown
              placeholder="Søk etter aktør"
              onSelectActor={handleSelectActor}
            />
            {selectedActor && (
              <div className={styles.details}>
                <p><strong>Valgt aktør:</strong> {selectedActor.name}</p>
                <label>Underaktør til:</label>
                <select name="parentID" value={details.parentID} onChange={handleDetailChange}>
                  <option value="">Ingen (øverst)</option>
                  {existingActors.map(a => (
                    <option key={a.nodeID || a.id} value={a.nodeID || a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <label>Beskrivelse:</label>
                <textarea
                  name="description"
                  value={details.description}
                  onChange={handleDetailChange}
                  placeholder="Beskrivelse..."
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button onClick={handleAddExisting}>Legg til aktør</button>
              </div>
            )}
            <hr />
            <button onClick={() => setStep("create")}>Opprett ny Aktør</button>
          </>
        ) : (
          <>
            <h2>Opprett ny Aktør</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmitCreate} className={styles.form}>
              <label>Hierarki:</label>
              <select name="hierarchy" value={formData.hierarchy} onChange={handleChange}>
                <option value="Overordnet">Overordnet</option>
                <option value="Underaktør">Underaktør</option>
              </select>

              {formData.hierarchy === "Underaktør" && (
                <>
                  <label>Velg overordnet aktør:</label>
                  <select name="parentID" value={formData.parentID} onChange={handleChange}>
                    <option value="">Velg aktør</option>
                    {existingActors.map(a => (
                      <option key={a.nodeID || a.id} value={a.nodeID || a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <label>Navn:</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Navn..." required />
              <label>Telefonnummer:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefonnummer..." />
              <label>Kategori:</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Velg kategori</option>
                <option value="Private">Private</option>
                <option value="Frivillige">Frivillige</option>
                <option value="Statlige">Statlige</option>
              </select>
              <label>Type:</label>
              <select name="actorType" value={formData.actorType} onChange={handleChange} required>
                <option value="">Velg type</option>
                <option value="person">Person</option>
                <option value="organisasjon">Organisasjon</option>
              </select>
              <label>Beskrivelse:</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Beskrivelse..." />
              <button type="submit">Opprett Aktør</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AddActor;
