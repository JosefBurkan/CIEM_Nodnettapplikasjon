import React, { useState , useEffect} from "react";
import { data, Link, useNavigate } from 'react-router-dom';

function Actors() {

    const [actors, setActors] = useState([])

    useEffect(() => {
        fetch("https://localhost:5255/api/user/views") // Change to match your API URL
            .then(response => response.json())
            .then(data => setActors(data))
            .catch(error => console.error("Error fetching services:", error));
            console.log(actors);
    }, []);

    return(
        <div>
            <h1>Antall aktører: {actors} </h1>
        </div>
    );

}

export default Actors;