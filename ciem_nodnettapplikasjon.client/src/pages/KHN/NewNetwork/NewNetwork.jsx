import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewNetwork() {
    const [networkName, setNetworkName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!networkName.trim()) {
            setErrorMessage("Please enter a valid network name.");
            return;
        }

        const newNetwork = {
            name: networkName,
        };

        try {
            const response = await fetch("https://ciem-nodnettapplikasjon.onrender.com/api/NetworkBuilder/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newNetwork)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Created network:", data);


                navigate(`/nytt-khn/${data.id}`);
            } else {
                setErrorMessage("Failed to create network. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Opprett nytt nettverk</h2>
            <input
                type="text"
                placeholder="Nettverksnavn"
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
                style={{ padding: "0.5rem", width: "300px", marginBottom: "1rem" }}
            />
            {errorMessage && (
                <div style={{ color: "red", marginBottom: "1rem" }}>
                    <strong>{errorMessage}</strong>
                </div>
            )}
            <br />
            <button onClick={handleCreate}>Opprett</button>
        </div>
    );
}

export default NewNetwork;
