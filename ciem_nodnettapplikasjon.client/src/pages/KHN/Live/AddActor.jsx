import React, { useState } from "react";
import styles from "./AddActor.module.css";

function AddActor({ onClose, onActorAdded, existingActors }) {
  const [formData, setFormData] = useState({
    hierarchy: "Overordnet",
    name: "",
    category: "",
    actorType: "",
    description: "",
    parentId: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.actorType) {
      setError("Fyll inn alle obligatoriske felter");
      return;
    }
    if (formData.hierarchy === "Underaktør" && !formData.parentId) {
      setError("Velg en overordnet aktør");
      return;
    }

    const newActor = {
      nodeID: Date.now(),
      name: formData.name,
      layer: formData.hierarchy === "Underaktør" ? 1 : 0,
      category: formData.category,
      actorType: formData.actorType,
      description: formData.description,
      // Hvis underaktør, lagres id'en til den overordnede aktøren.
      parentId: formData.hierarchy === "Underaktør" ? formData.parentId : null,
      hierarchy: formData.hierarchy
    };

    onActorAdded(newActor);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
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

          {/* Hvis underaktør, vis select for å velge overordnet aktør */}
          {formData.hierarchy === "Underaktør" && (
            <>
              <label htmlFor="parentId">Velg overordnet aktør:</label>
              <select
                id="parentId"
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                required
              >
                <option value="">Velg aktør</option>
                {existingActors &&
                  existingActors.map((actor) => (
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
      </div>
    </div>
  );
}

export default AddActor;
