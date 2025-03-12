import React, { useState , useEffect} from "react";
import { data, Link, useNavigate } from 'react-router-dom';
import * as signalR from "@microsoft/signalr";

function Actors() 
{

    function buildConnection() 
    {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:5255/emkoreHub")
            .configureLogging(signalR.LogLevel.Information)
            .build();
    
        hubConnection
            .start();
    }

    const [actors, setActors] = useState([]);

    const fetchActors = async () => {
        try {
            const response = await fetch("https://localhost:5255/api/user/views");
            const data = await response.json();
            setActors(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    return (
        <div>
            <button onClick={fetchActors}>Fetch Actors</button>
            <ul>
                {actors.map((actor, index) => (
                    <li key={index}>{actor}</li>
                ))}
            </ul>
        </div>
    );
};

    // return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
    

export default Actors;