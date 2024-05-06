"use client";
import { useState, FormEvent, BaseSyntheticEvent, useEffect } from "react";
import page from "@webSrc/styles/ShiftHistory.module.css";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import ShiftHistoryClient from "@shared/src/interfaces/ShiftHistoryClient";

export default function shiftHistory() {
  const params = useSearchParams();
  const employeeNameQuery: string = params.get('employeeName') ?? "";
  const employeeIdQuery: string = params.get('employeeId') ?? "";
  const unitQuery: string = params.get('unit') ?? "";
  const shiftDateQuery: string = params.get('shiftDate') ?? "";
  const requestedDateQuery: string = params.get('requestedDate') ?? "";
  const shiftQuery: string = params.get('shift') ?? "";
  const statusQuery: string = params.get('status') ?? "";

  const shifts: string[] = [
    "07:00 - 11:00",
    "07:00 - 15:00",
    "07:00 - 19:00",
    "11:00 - 15:00",
    "11:00 - 19:00",
    "11:00 - 23:00",
    "15:00 - 19:00",
    "15:00 - 23:00",
    "15:00 - 03:00",
    "19:00 - 23:00",
    "19:00 - 03:00",
    "19:00 - 07:00",
    "23:00 - 03:00",
    "23:00 - 07:00",
    "23:00 - 11:00",
  ];

  console.log(`employeeNameQuery is ${employeeNameQuery}, employeeIdQuery is ${employeeIdQuery}, unitQuery is ${unitQuery}, shiftDateQuery is ${shiftDateQuery}, shiftQuery is ${shiftQuery}, statusQuery is ${statusQuery}`);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>(employeeIdQuery);
  const [employeeName, setEmployeeName] = useState<string>(employeeNameQuery);
  const [unit, setUnit] = useState<string>(unitQuery);
  const [shiftDate, setShiftDate] = useState<string>(shiftDateQuery);
  const [requestedDate, setRequestedDate] = useState<string>(requestedDateQuery);
  const [shift, setShift] = useState<string>(shiftQuery);
  const [status, setStatus] = useState<string>(statusQuery);
  const [shiftHistories, setShiftHistories] = useState<ShiftHistoryClient[]>([]);
  const { auth } = useAuth();

  const validateEmployeeId = (): boolean => {
    const trimmedEmployeeId = employeeId.trim();
    if (trimmedEmployeeId.length === 0) {
      return true;
    }
    if (isNaN(Number(trimmedEmployeeId)) || Number(trimmedEmployeeId) <= 0) {
      return false;
    }
    return true;
  };

  const getShiftHistories = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event?.preventDefault();
    if (!validateEmployeeId()) {
      return;
    }
    updateList();
  };

  const updateList = async (): Promise<void> => {
    setIsLoading((prevLoad) => !prevLoad);
    const res = await fetch(
      `http://localhost:3003/shift-history?employeeId=${employeeId}&employeeName=${employeeName}&unit=${unit}&requestedDate=${requestedDate}&shiftDate=${shiftDate}&shift=${shift}&status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("res is:");
    console.dir(res);
    const jsonResponse: ShiftHistoryClient[] = await res.json();
    console.log("jsonResponse is:");
    console.dir(jsonResponse);
    setIsLoading((prevLoad) => !prevLoad);
    setShiftHistories((prevshiftHistories) => jsonResponse);
  };

  const handleEmployeeIdChange = (event: BaseSyntheticEvent): void => {
    setEmployeeId((prevEmployeeId) => event.target.value);
  };

  const handleEmployeeNameChange = (event: BaseSyntheticEvent): void => {
    setEmployeeName((prevEmployeeName) => event.target.value);
  };

  const handleUnitChange = (event: BaseSyntheticEvent): void => {
    setUnit((prevUnit) => event.target.value);
  };

  const handleShiftDateChange = (event: BaseSyntheticEvent): void => {
    console.log(`new shiftDate is: ${event.target.value}`);
    setShiftDate((prevDate) => event.target.value);
  };

  const handleRequestedDateChange = (event: BaseSyntheticEvent): void => {
    console.log(`new requestedDate is: ${event.target.value}`);
    setRequestedDate((prevDate) => event.target.value);
  };

  const handleShiftChange = (event: BaseSyntheticEvent): void => {
    console.log(`new shift is: ${event.target.value}`);
    setShift((prevShift) => event.target.value);
  };

  const handleStatusChange = (event: BaseSyntheticEvent): void => {
    setStatus((prevStatus) => event.target.value);
  };

  const statusStyle = (
    status: string
  ): { color: string; fontWeight: string } => {
    return {
      color:
        status === "Accepted"
          ? "green"
          : status === "Pending"
          ? "#FFAE42"
          : "red",
      fontWeight: "bold",
    };
  };

  const buttonStyle = (): { backgroundColor: string } => {
    return {
      backgroundColor: validateEmployeeId()
        ? "#067496"
        : "rgba(6, 116, 150, 0.3)",
    };
  };


  const acceptOrDenyShift = (shiftHistoryId: number, isAccepted: boolean): void => {
    auth?.socket?.emit("shift_accept", {
      shiftHistoryId,
      isAccepted
    });
  }

  const parseDate = (date: Date) => date.toString().substring(5,7) + "/" + date.toString().substring(8,10) + "/" + date.toString().substring(0,4);

  // Initial fill of list
  useEffect(() => {
    async function initialList() {
      await updateList();
    }
    initialList();

    auth?.socket?.on("shift_received", (arg: { isAccepted: boolean, id: number }) => {
      setShiftHistories(prevShiftHistories => {
        return prevShiftHistories.map(prevShiftHistory => {
          if(prevShiftHistory.id === arg.id) {
            return {...prevShiftHistory, id: arg.id};
          }
          return prevShiftHistory;
        });
      });
    });
  }, []);

  return (
    <>
      <div className="w-full">
        <h1 className={page.h1}>History</h1>
        <form className={page.form} onSubmit={getShiftHistories}>
          <div className={page.submission}>
            <div>
            <label className={page.label}>Employee ID</label>
            <input
              placeholder="Enter ID"
              value={employeeId}
              onChange={handleEmployeeIdChange}
              className={page.input}
            ></input>
            </div>
            <div>
            <label className={page.label}>Employee Name</label>
            <input
              placeholder="Enter Name"
              value={employeeName}
              onChange={handleEmployeeNameChange}
              className={page.input}
            ></input>
            </div>

            <div>
            <label className={page.label}>Unit</label>
            <input
              placeholder="Enter Unit"
              value={unit}
              onChange={handleUnitChange}
              className={page.input}
            ></input>
            </div>

            <div>
            <label className={page.label}>Requested Date</label>            
            <input 
                value={requestedDate}
                onChange={handleRequestedDateChange}
                type="date"
                className={page.input}
            ></input>
            </div>

            <div>
            <label className={page.label}>Shift Date</label>            
            <input 
                value={shiftDate}
                onChange={handleShiftDateChange}
                name="date"
                id="widget"
                type="date"
                className={page.input}
            ></input>
            </div>

            <div>
            <label className={page.label}>Shift</label>
            <select
              onChange={handleShiftChange}
              name="shift"
              id="shift"
              defaultValue={""}
              className={page.input}
            >
              <option value={""}>--Select An Option--</option>
              {shifts.map((shift, index) => (
                <option value={shift}>{shift}</option>  
              ))}
            </select>

            {/*
            <input
              placeholder="Enter Shift"
              value={shift}
              onChange={handleShiftChange}
              className={page.input}
            ></input>
            */}
            </div>

            <div>
            <label className={page.label} htmlFor="statuses">Status</label>
            <select id="statuses" onChange={handleStatusChange} defaultValue={""} className={page.input}>
              <option value="">--Select An Option--</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
            </div>

          </div>
          <button
            className={page.button}
            disabled={!validateEmployeeId()}
            style={buttonStyle()}
          >
            Search
          </button>
        </form>
        <section className={page.section}>
          <table
            className={isLoading ? `${page.table} ${page.loading}` : page.table}
          >
            <thead>
              <tr>
                <th className={page.th}>Employee ID</th>
                <th className={page.th}>Employee Name</th>
                <th className={page.th}>Unit</th>
                <th className={page.th}>Requested Date</th>
                <th className={page.th}>Shift Date</th>
                <th className={page.th}>Shift Time Block</th>
                <th className={page.th}>Status</th>
                <th className={page.th}>Accept/Deny</th>
              </tr>
            </thead>
            <tbody>
              {shiftHistories.map((shiftHistory, i) => (
                <tr key={i}>
                  <td className={page.td}> {shiftHistory.employeeId} </td>
                  <td className={page.td}> {shiftHistory.employeeName} </td>
                  <td className={page.td}> {shiftHistory.unit} </td>
                  <td className={page.td}> {parseDate(shiftHistory.createdAt)/*shiftHistory.createdAt.substring(5,7) + "/" + shiftHistory.createdAt.substring(8,10) + "/" + shiftHistory.createdAt.substring(0,4)*/} </td>
                  <td className={page.td}>
                    {shiftHistory.dateRequested}
                  </td>
                  <td className={page.td}> {shiftHistory.shift} </td>
                  <td className={page.td} style={statusStyle(shiftHistory.status)}>
                    {" "}
                    {shiftHistory.status}{" "}
                  </td>
                  {
                    shiftHistory.status === "Pending" ? 
                    (<td className={page.td}>
                      <div className={page.buttons}>
                        <button className={page.accept} onClick={() => { acceptOrDenyShift(shiftHistory.id, true) }}>Accept</button>
                        <button className={page.deny} onClick={() => { acceptOrDenyShift(shiftHistory.id, false) }}>Deny</button>
                      </div>
                    </td>) :
                    (<td className={page.td}></td>)
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
