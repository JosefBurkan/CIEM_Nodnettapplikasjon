import React, {useState, useEffect} from 'react';
import styles from './Date.module.css';

function DateComponent(){
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000)

        return () => {
            clearInterval(intervalId);
        }
    }, []);


    function formatDate(){
        return time.toLocaleDateString("no-NO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    function formatTime(){
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();

        return `${padZero(hours)}:${padZero(minutes)}` /*:${padZero(seconds)} Hvis man vil inkludere sekund*/
    }

    function padZero(number){
        return (number < 10 ? "0" : "") + number;
    }

    return(
        <div className={styles.clockContainer}>
            <div className={styles.date}>
                <span>{formatDate()}</span>
            </div>
            <div className={styles.clock}>
                <span>{formatTime()}</span>
            </div>
        </div>
    );

}

export default DateComponent;