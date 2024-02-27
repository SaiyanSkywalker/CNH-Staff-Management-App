'use client';
import { useState, FormEvent, BaseSyntheticEvent, useEffect } from "react";
import page from './page.module.css';

interface ShiftHistory {
    employeeId: number,
    employeeName: string,
    unit: string,
    shift: string,
    status: string,
    dateRequested: string
};

export default function shiftHistory() {
    const [isLoading, setIsLoading] = useState(false);
    const [employeeId, setEmployeeId] = useState("");
    const [employeeList, setEmployeeList] = useState<ShiftHistory[]>([]);

    const validateEmployeeId = () : boolean => {
        const trimmedEmployeeId = employeeId.trim();
        if(trimmedEmployeeId.length === 0) {
            return true;
        }
        if(isNaN(Number(trimmedEmployeeId)) || Number(trimmedEmployeeId) <= 0) {
            return false;
        }
        return true;
    }

    const getEmployeeList = async (event: FormEvent<HTMLFormElement>) : Promise<void> => {
        event?.preventDefault();
        if(!validateEmployeeId()) {
            return;
        }
        updateList();
    }

    const updateList = async () : Promise<void> => {
        setIsLoading(prevLoad => !prevLoad);
        const res = await fetch("http://localhost:3003/shift-history/" + employeeId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const jsonResponse: ShiftHistory[] = await res.json();
        setIsLoading(prevLoad => !prevLoad);
        setEmployeeList(prevEmployeeList => jsonResponse);
    }

    const handleEmployeeIdChange = (event: BaseSyntheticEvent) : void => {
        setEmployeeId(prevEmployeeId => event.target.value);   
    }

    const parseDate = (requestedDate: string) : string => {
        let newDate = new Date(requestedDate);
        let month = newDate.getMonth() + 1 < 10 ? "0" + String(newDate.getMonth() + 1) : String(newDate.getMonth() + 1);
        let day = newDate.getDate() + 1 < 10 ? "0" + String(newDate.getDate()) : String(newDate.getDate());        
        return month + "/" + day + "/" + newDate.getFullYear();
    }

    const statusStyle = (status: string) : {color: string, fontWeight: string} => {
        return {
            color: status === "Accepted" ? "green" : (status === "Pending" ? "#FFAE42" : "red"),
            fontWeight: "bold"
        };
    }

    const buttonStyle = () : {backgroundColor: string} => {
        return {
            backgroundColor: validateEmployeeId() ? "#067496" : "rgba(6, 116, 150, 0.3)"
        };
    }

    // Initial fill of list
    useEffect(() => {
        async function initialList () {
            await updateList();
        }
        initialList();
    }, []);

    return(
        <>
            <h1 className={page.h1}>History</h1>
            <form className={page.form} onSubmit={getEmployeeList}>
                <div className={page.submission}>
                    <label className={page.label}>Employee ID</label>
                    <input placeholder="Enter ID" value={employeeId} onChange={handleEmployeeIdChange} className={page.input}></input>
                </div>
                <button className={page.button} disabled={!validateEmployeeId()} style={buttonStyle()}>Search</button>
            </form>
            <section className={page.section}>
                <table className={isLoading ? `${page.table} ${page.loading}` : page.table}>
                    <thead>
                        <tr>
                            <th className={page.th}>Employee ID</th>
                            <th className={page.th}>Employee Name</th>
                            <th className={page.th}>Unit</th>
                            <th className={page.th}>Shift</th>
                            <th className={page.th}>Status</th>
                            <th className={page.th}>Date Requested</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employeeList.map((employee, i) => 
                                <tr key={i}>
                                    <td className={page.td}> {employee.employeeId} </td>
                                    <td className={page.td}> {employee.employeeName} </td>
                                    <td className={page.td}> {employee.unit} </td>
                                    <td className={page.td}> {employee.shift} </td>
                                    <td className={page.td} style={statusStyle(employee.status)}> {employee.status} </td>
                                    <td className={page.td}> {parseDate(employee.dateRequested)} </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </section>
        </>
    )
}