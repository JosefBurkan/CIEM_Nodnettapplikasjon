import React, { useState } from 'react';
import EMKORE from '../../assets/EMKORE.png';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [correctMessage, setCorrectMessage] = useState("");
    const isDisabled = (!username || !password);
    const navigate = useNavigate();

    const showMessage = (error = "", success = "",) => {
        setErrorMessage(error);
        setCorrectMessage(success);
    }

    const Login = async (e) => {
        e.preventDefault();

        const response = await fetch("https://localhost:5255/api/user/login", {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const result = await response.json();
            showMessage("", `Velkommen inn ${username}`);
            setTimeout(() => navigate("/dashboard"), 1000);
        } else {
            console.error("Error: ", response.statusText);
            console.log("Feil brukernavn eller passord");
            showMessage("Feil brukernavn eller passord, prøv igjen");
        }

        setPassword("");
        setUsername("");
    };

    return (
        <div className={styles.loginPage}>
            <img src={EMKORE} alt="EMKORE logo" className={styles.logo} />
            <form className={styles.inputContainer} onSubmit={Login}>
                <input
                    type="text"
                    name="username"
                    className={styles.inputField}
                    placeholder="BRUKERNAVN"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    className={styles.inputField}
                    placeholder="PASSORD"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className={styles.loginButton} disabled={isDisabled}>LOGIN</button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {correctMessage && <p style={{ color: "green" }}>{correctMessage}</p>}
            <p className={styles.helpBox}>Hjelp ⓘ</p>
        </div>

    );
}

export default Login;  