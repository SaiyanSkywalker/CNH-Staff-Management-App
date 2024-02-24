'use client';
import { useState, FormEvent, BaseSyntheticEvent } from "react";
import page from './page.module.css';

interface ShiftHistory {
    employeeId: string,
    employeeName: string,
    unit: string,
    shift: string,
    status: string,
    dateRequested: Date
};

export default function shiftHistory() {
    const [employeeId, setEmployeeId] = useState("");
    const [employeeList, setEmployeeList] = useState<ShiftHistory[]>([]);

    const getEmployeeList = async (event: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        const res = await fetch("http://localhost:3003/shift-capacity", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({employeeId})
        });

        const jsonResponse = await res.json();
        console.log("jsonResponse is " + jsonResponse);
    }

    return(
        <>
            <h1 className={page.h1}>History</h1>
            <form className="flex flex-row justify-around items-center" onSubmit={getEmployeeList}>
                <div>
                    <label className={page.label}>Employee Id</label>
                    <input placeholder="Enter Employee Id" value={employeeId} className={page.input} required></input>
                </div>
                <button className={page.button}>Search</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Unit</th>
                        <th>Shift</th>
                        <th>Status</th>
                        <th>Date Requested</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        employeeList.map((employee) => 
                            <tr>
                                <td> {employee.employeeId} </td>
                                <td> {employee.employeeName} </td>
                                <td> {employee.unit} </td>
                                <td> {employee.shift} </td>
                                <td> {employee.status} </td>
                                <td> {Intl.DateTimeFormat('en-US').format(employee.dateRequested)} </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </>
    )
}