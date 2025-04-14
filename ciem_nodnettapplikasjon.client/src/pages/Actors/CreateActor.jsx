import React, { useState }from 'react';
import styles from './CreateActor.module.css';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';


function CreateActor() {
    const navigate = useNavigate();
    const [actorHierachy, setActorHierachy] = useState("Overordnet");
    const [existingActor, setExistingActor] = useState(""); // For the dropdown meny, to select an actor from the database 
    const [successMessage, setSuccessMessage] = useState("");
    const [actorID, setActorID] = useState("");
    const [subActor, setSubActor] = useState("");
    const [search, setSearch] = useState("");

    const [subActorFormData, setSubActorFormData] = useState({
        actorID: 0,
        subActor: ""
    });

    const [actorFormData, setActorFormData] = useState({
        name: "",
        category: "",
        actorType: "",
        subActors: "",
        description: ""
    });



    // Fetch actors to use actor names for the drop down meny
    const fetchActors = async () => {
        const response = await fetch("https://ciem-nodnettapplikasjon.onrender.com/api/actor")
        const data = await response.json();
        setExistingActor(data);
    } 

    useEffect(() => {
        fetchActors();
    }, []);

    const handleChangeActor = (e) => {
        setActorFormData({
            ...actorFormData,
            [e.target.name]: e.target.value,

        });
    };

    // Set the sub actor formdata to the value of the sub actor elements
    const handleChangeSubActor = (e) => {
        setSubActorFormData({
            ...subActorFormData,
            [e.target.name]: e.target.value,

        });
    };

    // Set the sub actor, actorID to the chose actor
    const handleActorSelect = (actorID) => {
        setSubActorFormData({
          ...subActorFormData,
          actorID: parseInt(actorID, 10),
        });
      };

    const changeHierachy = (e) => {
        setActorHierachy(e.target.value);
    };

    const handleSubmitActor = async (e) => {
        e.preventDefault();


        const actorPayload = {
            name: actorFormData.name,
            category: actorFormData.category,
            actorType: actorFormData.actorType,
            subActors: actorFormData.subActors 
                ? actorFormData.subActors.split(",").map((s) => s.trim()) // Map to folder, parse at every ','
                : [],
            description: actorFormData.description
        };


        try {
            const response = await fetch("https://ciem-nodnettapplikasjon.onrender.com/api/actor/CreateActor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(actorPayload)
            });

            if (!response.ok) {
                throw new Error("Failed to create actor");
            }

            setSuccessMessage("New actor created!");

            setActorFormData({
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

    // Create a subactor for an existing actor
    const handleSubmitSubActor = async (e) => {
        e.preventDefault();
    
        const subActorPayLoad = {
            actorID: subActorFormData.actorID,
            subActor: subActorFormData.subActor
        };

        console.log(subActorFormData.subActor);
    
        try {
            const response = await fetch("https://localhost:5255/api/actor/CreateSubActor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(subActorPayLoad), 
            });
    
            if (!response.ok) {
                throw new Error("Failed to create sub-actor");
            }
    
            console.log("Sub-actor created successfully!");
            
            setTimeout(() => {
                navigate("/actorsAll");
            }, 2000);
    
        } catch (error) {
            console.error("Could not create sub-actor: ", error);
        }
    };
    
    

    if (actorHierachy == "Overordnet") {
        return (
            <div className={styles.container}>
                <h1>Ny Aktør</h1>

                {successMessage && (
                    <div className={styles.successMessage}>
                        {successMessage}
                    </div>)}

                <form onSubmit={handleSubmitActor} className={styles.form}>
                    {/* Choose hierachy*/}
                    <label htmlFor="actorHierachy">Velg Hieraki:</label>
                        <select
                            id="actorHierachy"
                            name="actorHierachy"
                            value={"Overordnet"}
                            onChange={changeHierachy}
                            className={styles.selectInput}
                            >
                        <option value="Overordnet">Overordnet</option>
                        <option value="Underliggende">Underliggende</option>
                    </select>

                    {/* Name */}
                    <label htmlFor="name">Navn:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Navn..."
                        value={actorFormData.name}
                        onChange={handleChangeActor}
                        className={styles.textInput}
                        required
                    />

                    {/* Category */}
                    <label htmlFor="category">Kategori:</label>
                    <select
                        id="category"
                        name="category"
                        value={actorFormData.category}
                        onChange={handleChangeActor}
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
                        value={actorFormData.actorType}
                        onChange={handleChangeActor}
                        className={styles.selectInput}
                        required
                    >
                        <option value="">Velg type</option>
                        <option value="selvstending">Selvsending</option>
                        <option value="organisasjon">Organisasjon</option>
                    </select>

                    {/* SubActors (comma-separated) */}
                    <label htmlFor="subActors">Sub-aktører (kommaseparert):</label>
                    <input
                        id="subActors"
                        name="subActors"
                        type="text"
                        placeholder="f.eks. R&D, Sales"
                        value={actorFormData.subActors}
                        onChange={handleChangeActor}
                        className={styles.textInput}
                    />

                    {/* Description */}
                    <label htmlFor="description">Beskrivelse:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Beskrivelse..."
                        value={actorFormData.description}
                        onChange={handleChangeActor}
                        className={styles.textArea}
                    />

                    {/* Submit */}
                    <button type="submit" className={styles.createButton}>
                        Opprett ny aktør
                    </button>
                </form>
            </div>
        );
    } else
    {
        return (
        <div className={styles.container}>
            <h1>Legg til Underliggende aktør</h1>

                <form onSubmit={handleSubmitSubActor} className={styles.form}>
                
                {/* Choose hierachy*/}
                <label htmlFor="actorHierachy">Velg Hieraki:</label>
                <select
                    id="actorHierachy"
                    name="actorHierachy"
                    value={"Underliggende"}
                    onChange={changeHierachy}
                    className={styles.selectInput}
                >
                    <option value="Overordnet">Overordnet</option>
                    <option value="Underliggende">Underliggende</option>
                    </select>
                    
                <br/>
                    
                {/*Search for available actors in the database*/}
                <label htmlFor="actorID">Velg en aktør å legge under:</label>
                    <SearchBar
                        id="actorID"
                        name="actorID"
                        placeholder="Søk etter aktører"
                        bgColor="#1A1A1A"
                        onSearch={handleActorSelect}
                        value={subActorFormData.actorID}
                        enableDropdown={true}
                        actors={existingActor}
                        searchBarMode="Actors"  // Specify that searchbar is for actors, not the node network
                    />
                

                {/* Name */}
                <label htmlFor="subActor">Navn:</label>
                <input
                    id="subActor"
                    name="subActor"
                    type="text"
                        placeholder="Navn..."
                    value={subActorFormData.subActor}
                    onChange={handleChangeSubActor}
                    className={styles.textInput}
                    required
                    />

                {/* Submit */}
                <button type="submit" className={styles.createButton}>
                    Opprett ny Underliggende aktør
                </button>
                    
            </form>
                
        </div>
            


        );
    }
}

export default CreateActor;
