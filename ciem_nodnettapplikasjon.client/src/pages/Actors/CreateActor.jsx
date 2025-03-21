import React, { useState }from 'react';
import styles from './CreateActor.module.css'
const CreateActor = () => { 

    const [formData, setFormData] = useState({
        type: 'person',
        name: '',
        organization: '',
        description: '',
        task: '',
        subordinate: ''
    });

    const handleChange = (e) => { // Prøvd å gjøre det klart for backend jobbb :)
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Midlertidig console melding", formData);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.icon}>👤</span>
                <h1>Ny Aktør</h1>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="person">Person</option>
                        <option value="organization">Organisasjon</option>
                    </select>
                </label>

                <div className={styles.row}>
                    <input name="name" type="text" placeholder="Navn..." value={formData.name} onChange={handleChange} required/>
                    <select name="subordinate" value={formData.subordinate} onChange={handleChange}>
                        <option value="" disabled>Underliggende</option>
                        <option value="1">Fyll 1</option>
                        <option value="2">Fyll 2</option>
                    </select>
                </div>

                <input type="text" placeholder="Organisasjon..." name="organization" value={formData.organization} onChange={handleChange}/>

                <div className={styles.row}>
                    <div>
                        <label>Beskrivelse</label>
                        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div>
                        <label>Oppgave</label>
                        <textarea name="task" value={formData.task} onChange={handleChange}></textarea>
                    </div>
                </div>
                <button type="submit" className={styles.createButton}>Opprett ny Aktør</button>
            </form>
        </div>
    );
};

export default CreateActor;