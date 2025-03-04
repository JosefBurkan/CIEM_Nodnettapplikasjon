import React, { useState} from "react";
import styles from "./Dashboard.module.css"
import "../../index.css";
import EMKORE from '../../assets/EMKORE.png';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard(){
    const navigate = useNavigate();

    return(
        <div className="pageContainer">
            <h1>Dashboard</h1>
            <button onClick={() => navigate("/actors")}>Go to Dashboard</button>
        </div>
    );
}


export default Dashboard;