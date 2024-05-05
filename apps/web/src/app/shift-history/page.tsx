"use client";
import { useState, FormEvent, BaseSyntheticEvent, useEffect } from "react";
import page from "@webSrc/styles/ShiftHistory.module.css";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import ShiftHistoryClient from "@shared/src/interfaces/ShiftHistoryClient";
import AuthWrapper from "@webSrc/components/ProtectedRoute";
import axios from "axios";
import { getAccessToken } from "@webSrc/utils/token";

const Page = () => {
  const params = useSearchParams();
  const employeeNameQuery: string = params.get("employeeName") ?? "";
  const employeeIdQuery: string = params.get("employeeId") ?? "";
  const unitQuery: string = params.get("unit") ?? "";
  const dateQuery: string = params.get("date") ?? "";
  const shiftQuery: string = params.get("shift") ?? "";
  const statusQuery: string = params.get("status") ?? "";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>(employeeIdQuery);
  const [employeeName, setEmployeeName] = useState<string>(employeeNameQuery);
  const [unit, setUnit] = useState<string>(unitQuery);
  const [date, setDate] = useState<string>(dateQuery);
  const [shift, setShift] = useState<string>(shiftQuery);
  const [status, setStatus] = useState<string>(statusQuery);
  const [shiftHistories, setShiftHistories] = useState<ShiftHistoryClient[]>(
    []
  );
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
    const res = await axios(
      `http://localhost:3003/shift-history?employeeId=${employeeId}&employeeName=${employeeName}&unit=${unit}&date=${date}&shift=${shift}&status=${status}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    const jsonResponse: ShiftHistoryClient[] = res.data;
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
    console.log("date is: ");
    setDate((prevDate) => event.target.value);
  };

  const handleShiftChange = (event: BaseSyntheticEvent): void => {
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
        status.toLowerCase() === "accepted"
          ? "green"
          : status.toLowerCase() === "pending"
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

  const acceptOrDenyShift = (
    shiftHistoryId: number,
    isAccepted: boolean
  ): void => {
    auth?.socket?.emit("shift_accept", {
      shiftHistoryId,
      isAccepted,
    });
  };

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
                  <td className={page.td}>{shiftHistory.dateRequested}</td>
                  <td className={page.td}> {shiftHistory.shift} </td>
                  <td
                    className={page.td}
                    style={statusStyle(shiftHistory.status)}
                  >
                    {" "}
                    {shiftHistory.status}{" "}
                  </td>
                  {shiftHistory.status === "Pending" ? (
                    <td className={page.td}>
                      <div className={page.buttons}>
                        <button
                          className={page.accept}
                          onClick={() => {
                            acceptOrDenyShift(shiftHistory.id, true);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className={page.deny}
                          onClick={() => {
                            acceptOrDenyShift(shiftHistory.id, false);
                          }}
                        >
                          Deny
                        </button>
                      </div>
                    </td>
                  ) : (
                    <td className={page.td}></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
};

export default AuthWrapper(Page);
