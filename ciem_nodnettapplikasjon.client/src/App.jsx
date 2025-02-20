import React, { useState } from 'react';

function App() {
    const [inputPassword, setInputPassword] = useState('');
    const [inputEmail, setInputEmail] = useState('');

    const API_URL = import.meta.env.VITE_API_URL; // Stores localhost address

    //
    // Summary:
    //     Updates the password field's content whenever a change in it happens
    const handleInputPassword = (event) => {
        setInputPassword(event.target.value);
    };

    //
    // Summary:
    //     Updates the email field's content whenever a change in it happens
    const handleInputEmail = (event) => {
        setInputEmail(event.target.value);
    };



    const handleSubmit = async () => {
        try {
            const response = await fetch("https://localhost:7088/api/user/login", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ Email: inputEmail, Password: inputPassword }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Success:", result);
            } else {
                console.error("Error: funker faen ikke", response.statusText);
            }
        } catch (error) {
            console.error("Error: ble error nr 2", error);
        }
    };
     
    return (
        <div>
            <input
                type="text"
                value={inputEmail}
                onChange={handleInputEmail}
                placeholder="Enter some text"
            />
            <input
                type="text"
                value={inputPassword}
                onChange={handleInputPassword}
                placeholder="Enter your password here"
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>

    );
}

export default App;