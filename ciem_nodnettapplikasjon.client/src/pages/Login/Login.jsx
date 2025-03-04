import React, {useState} from 'react';
import EMKORE from '../../assets/EMKORE.png';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [correctMessage, setCorrectMessage] = useState("");
    const isDisabled = (!email || !password);
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
            body: JSON.stringify({ Email: email, Password: password }),
        });

        if (response.ok) {
            const result = await response.json();
            setTimeout(() => navigate("/dashboard"), 1000);
        } else {
            console.error("Error: ", response.statusText);
            console.log("Feil brukernavn eller passord");
            showMessage("Feil brukernavn eller passord, prøv igjen");
        } 


        setPassword("");
        setEmail("");
    };

    return(
        <div className={styles.loginPage}>
            <img src={EMKORE} alt="EMKORE logo" className={styles.logo}/>
            <form className={styles.inputContainer} onSubmit={Login}>
                <input
                    type="text"
                    name="email"
                    className={styles.inputField} 
                    placeholder="BRUKERNAVN"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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