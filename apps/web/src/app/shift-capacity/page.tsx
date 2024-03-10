'use client';

import { useState, FormEvent, BaseSyntheticEvent } from "react";

import styles from '../../styles/shift-capacity.module.css';

export default function shiftCapacity() {

    const [picu, setPicu] = useState(0); 
    const [nicu, setNicu] = useState(0); 

    const [criticalCare, setCriticalCare] = useState(0); 
    const [acuteCare, setAcuteCare] = useState(0); 

    const [threeEast, setThreeEast] = useState(0);
    const [sevenEast, setSevenEast] = useState(0);

    const todayDate = new Date();
    const todayDateString = todayDate.toISOString().substring(0, 10);

    const [shiftIndex, setShiftIndex] = useState("0");
    const [date, setDate] = useState(todayDateString);

    const shifts: string[] = [
        "07:00 - 11:00",
        "07:00 - 15:00",
        "11:00 - 15:00",
        "11:00 - 19:00",
        "15:00 - 19:00",
        "15:00 - 23:00",
        "19:00 - 23:00",
        "23:00 - 07:00",
    ]

    function handlePicuChange(event: BaseSyntheticEvent) {
        setPicu(prevPicuValue => event.target.value);
    }

    function handleNicuChange(event: BaseSyntheticEvent) {
        setNicu(prevNicuValue => event.target.value);
    }

    function handleCriticalCareChange(event: BaseSyntheticEvent) {
        setCriticalCare(prevCriticalCare => event.target.value);
    }

    function handleAcuteCareChange(event: BaseSyntheticEvent) {
        setAcuteCare(prevAcuteCare => event.target.value);
    }

    function handleUnitThreeEChange(event: BaseSyntheticEvent) {
        setThreeEast(prevUnitThreeE => event.target.value);
    }

    function handleUnitSevenEChange(event: BaseSyntheticEvent) {
        setSevenEast(prevUnitSevenE => event.target.value);
    }

    function handleDateChange(event: BaseSyntheticEvent) {
        const newDateString = event.target.value.substring(0, 10);
        setDate(prevDateString => newDateString);
    }

    function handleShiftIndexChange(event: BaseSyntheticEvent) {
        setShiftIndex(prevSelectedShift => event.target.selectedIndex);
    }


    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const res = await fetch("http://localhost:3003/shift-capacity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({picu, nicu, acuteCare, criticalCare, threeEast, sevenEast, shift: shifts[Number(shiftIndex)], date})
        });
    }

    return(
        <div className={styles.container}>
            <form className={styles.capacity} onSubmit={onSubmit}>
                <h1 className={styles.h1}>Max Unit Capacity</h1>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="widget">Date</label>
                        <input className={styles.input} value={date} onChange={handleDateChange} min={todayDate.toISOString().substring(0, 10)} name="date" id="widget" type="date"></input>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="shift">Shift</label>
                        <select className={styles.input} value={shiftIndex} onChange={handleShiftIndexChange} name="shift" id="shift">
                            <option value="0">{shifts[0]}</option>
                            <option value="1">{shifts[1]}</option>
                            <option value="2">{shifts[2]}</option>
                            <option value="3">{shifts[3]}</option>
                            <option value="4">{shifts[4]}</option>
                            <option value="5">{shifts[5]}</option>
                            <option value="6">{shifts[6]}</option>
                            <option value="7">{shifts[7]}</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>PICU</label>
                        <input className={styles.input} value={picu} onChange={handlePicuChange} name="picu" type="number" min="0" max="100"></input>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>NICU</label>
                        <input className={styles.input} value={nicu} onChange={handleNicuChange} name="nicu" type="number" min="0" max="100"></input>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Critical Care</label>
                        <input className={styles.input} value={criticalCare} onChange={handleCriticalCareChange} name="criticalcare" type="number" min="0" max="100"></input>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Acute Care</label>
                        <input className={styles.input} value={acuteCare} onChange={handleAcuteCareChange} name="acutecare" type="number" min="0" max="100"></input>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>3E</label>
                        <input className={styles.input} value={threeEast} onChange={handleUnitThreeEChange} name="3E" type="number" min="0" max="100"></input>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>7E</label>
                        <input className={styles.input} value={sevenEast} onChange={handleUnitSevenEChange} name="7E" type="number" min="0" max="100"></input>
                    </div>
                </div>
                <div className={styles.submission}>
                    <button className={styles.button}>Submit</button>
                </div>
            </form>
        </div>
    )
}
