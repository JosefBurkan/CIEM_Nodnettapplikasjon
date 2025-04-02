import React, { useState }from 'react';
import styles from './CreateActor.module.css';
import { useNavigate } from "react-router-dom";


function CreateActor() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        actorType: "",
        subActors: "",
        description: ""
    });

    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            category: formData.category,
            actorType: formData.actorType,
            subActors: formData.subActors
                ? formData.subActors.split(",").map((s) => s.trim())
                : [],
            description: formData.description
        };


        try {
            const response = await fetch("https://localhost:5255/api/actor/CreateActor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to create actor");
            }

            setSuccessMessage("New actor created!");

            setFormData({
                name: "",
                category: "",
                actorType: "",
                subActor: "",
                description: ""
            });

            setTimeout(() => {
                navigate("/actorsAll");
            }, 2000);
            

        } catch (error) {
            console.error("Error creating actor:", error);
        }
    };
    

    return (
        <div className={styles.container}>
            <h1>Ny Aktør</h1>

            {successMessage && (
            <div className={styles.successMessage}>
                {successMessage}
            </div>)}
      

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Name */}
                <label htmlFor="name">Navn:</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Navn..."
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.textInput}
                    required
                />

                {/* Category */}
                <label htmlFor="category">Kategori:</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.selectInput}
                    required
                >
                    <option value="">Velg kategori</option>
                    <option value="Private">Private</option>
                    <option value="Frivillige">Frivillige</option>
                    <option value="Statlige">Statlige</option>
                </select>

                {/* ActorType */}
                <label htmlFor="actorType">Type:</label>
                <select
                    id="actorType"
                    name="actorType"
                    value={formData.actorType}
                    onChange={handleChange}
                    className={styles.selectInput}
                    required
                >
                    <option value="">Velg type</option>
                    <option value="person">Person</option>
                    <option value="organisasjon">Organisasjon</option>
                </select>

                {/* SubActors (comma-separated) */}
                <label htmlFor="subActors">Sub-aktører (kommaseparert):</label>
                <input
                    id="subActors"
                    name="subActors"
                    type="text"
                    placeholder="f.eks. R&D, Sales"
                    value={formData.subActors}
                    onChange={handleChange}
                    className={styles.textInput}
                />

                {/* Description */}
                <label htmlFor="description">Beskrivelse:</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Beskrivelse..."
                    value={formData.description}
                    onChange={handleChange}
                    className={styles.textArea}
                />

                {/* Submit */}
                <button type="submit" className={styles.createButton}>
                    Opprett ny aktør
                </button>
            </form>
        </div>
    );
}

export default CreateActor;