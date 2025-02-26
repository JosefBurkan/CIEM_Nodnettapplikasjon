import { useState } from "react";

function App() {
    const [inputPassword, setInputPassword] = useState("");
    const [inputUsername, setInputUsername] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5255"; // Use .env variable or default

    const handleInputPassword = (event) => {
        setInputPassword(event.target.value);
    };

    const handleInputUsername = (event) => {
        setInputUsername(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload

        try {
            const response = await fetch(`${API_URL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Username: inputUsername, Password: inputPassword }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Success:", result);
            } else {
                console.error("Error: Request failed", response.statusText);
            }
        } catch (error) {
            console.error("Error: Network issue or server down", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputUsername}
                onChange={handleInputUsername}
                placeholder="Username"
            />
            <input
                type="password" // Changed to password type for security
                value={inputPassword}
                onChange={handleInputPassword}
                placeholder="Password"
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default App;
