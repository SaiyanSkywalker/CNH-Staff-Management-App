"use client";
import { useState, FormEvent, BaseSyntheticEvent, useEffect } from "react";
import page from "@webSrc/styles/ShiftHistory.module.css";
import { useAuth } from "@webSrc/contexts/AuthContext";

interface ShiftHistory {
  id: number;
  employeeId: number;
  employeeName: string;
  unit: string;
  shift: string;
  status: string;
  dateRequested: string;
}

export default function shiftHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("");
  const [status, setStatus] = useState("");
  const [shiftHistories, setShiftHistories] = useState<ShiftHistory[]>([]);
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
      "http://localhost:3003/shift-history/" + employeeId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("res is:");
    console.dir(res);
    const jsonResponse: ShiftHistory[] = await res.json();
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

  const handleDateChange = (event: BaseSyntheticEvent): void => {
    setDate((prevDate) => event.target.value);
  };

  const handleShiftChange = (event: BaseSyntheticEvent): void => {
    setShift((prevShift) => event.target.value);
  };

  const handleStatusChange = (event: BaseSyntheticEvent): void => {
    setStatus((prevStatus) => event.target.value);
  };

  const parseDate = (requestedDate: string): string => {
    let newDate = new Date(requestedDate);
    let month =
      newDate.getMonth() + 1 < 10
        ? "0" + String(newDate.getMonth() + 1)
        : String(newDate.getMonth() + 1);
    let day =
      newDate.getDate() + 1 < 10
        ? "0" + String(newDate.getDate())
        : String(newDate.getDate());
    return month + "/" + day + "/" + newDate.getFullYear();
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
    //console.log("shiftHistoryId is:", shiftHistoryId);
    //console.log("isAccepted is:", isAccepted);
    auth?.socket?.emit("shift_accept", {
      shiftHistoryId,
      isAccepted
    });
  }

  // Initial fill of list
  useEffect(() => {
    async function initialList() {
      await updateList();
    }
    initialList();
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
            <label className={page.label}>Date</label>
            <input
              placeholder="Enter Date"
              value={date}
              onChange={handleDateChange}
              className={page.input}
            ></input>
            </div>

            <div>
            <label className={page.label}>Shift</label>
            <input
              placeholder="Enter Shift"
              value={shift}
              onChange={handleShiftChange}
              className={page.input}
            ></input>
            </div>

            <div>
            <label className={page.label}>Status</label>
            <input
              placeholder="Enter Status"
              value={status}
              onChange={handleStatusChange}
              className={page.input}
            ></input>
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
                  <td className={page.td}>
                    {shiftHistory.dateRequested
                      ? parseDate(shiftHistory.dateRequested)
                      : ""}
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
