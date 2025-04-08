import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

function QRAccessPage() {
    const [searchParams] = useSearchParams();
    const parentId = searchParams.get("parentId");
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        profession: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            phone: formData.phone,
            profession: formData.profession,
            parentId: parseInt(parentId),
            token: token
        };

        try {
            const res = await fetch("https://localhost:5255/api/qr/add-node", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                console.log("Node successfully added.");
                setSubmitted(true);
            } else {
                const errorData = await res.json();
                console.error("Failed to add node:", errorData);
                alert("Noe gikk galt. Prøv igjen.");
            }
        } catch (err) {
            console.error("Error sending request:", err);
            alert("Kunne ikke koble til serveren.");
        }
    };


    if (!parentId || !token) {
        return <div>Mangler nødvendig QR-informasjon.</div>;
    }

    if (submitted) {
        return (
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <h2>Takk! Du er nå koblet til nettverket.</h2>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "400px", margin: "3rem auto" }}>
            <h2>Bli med i nettverket</h2>
            <p>Fyll inn nødvendig informasjon for å få tilgang til nettverket.</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input name="name" type="text" placeholder="Navn" required onChange={handleChange} />
                <input name="phone" type="text" placeholder="Telefonnummer" required onChange={handleChange} />
                <input name="profession" type="text" placeholder="Yrke" required onChange={handleChange} />
                <button type="submit">Koble til nettverket</button>
            </form>
        </div>
    );
}

export default QRAccessPage;
