/**
 * File: page.tsx
 * Purpose: contains functionality for shift history page
 */

"use client";
import {
  useState,
  FormEvent,
  BaseSyntheticEvent,
  useEffect,
  useContext,
} from "react";
import page from "@webSrc/styles/ShiftHistory.module.css";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import ShiftHistoryClient from "@shared/src/interfaces/ShiftHistoryClient";
import config from "@webSrc/config";
import axios from "axios";
import UnitAttributes from "@shared/src/interfaces/UnitAttributes";
import AuthWrapper from "@webSrc/components/ProtectedRoute";
import { getAccessToken } from "@webSrc/utils/token";
import AdminShiftRequestUpdate from "@shared/src/interfaces/AdminShiftRequestUpdate";
import { BannerContext } from "@webSrc/contexts/BannerContext";
import { v4 as uuid4 } from "uuid";
import { error } from "console";
const Page = () => {
  const params = useSearchParams();
  const employeeNameQuery: string = params.get("employeeName") ?? "";
  const employeeIdQuery: string = params.get("employeeId") ?? "";
  const unitQuery: string = params.get("unit") ?? "";
  const shiftDateQuery: string = params.get("shiftDate") ?? "";
  const requestedDateQuery: string = params.get("requestedDate") ?? "";
  const shiftQuery: string = params.get("shift") ?? "";
  const statusQuery: string = params.get("status") ?? "";

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

  // console.log(
  //   `employeeNameQuery is ${employeeNameQuery}, employeeIdQuery is ${employeeIdQuery}, unitQuery is ${unitQuery}, shiftDateQuery is ${shiftDateQuery}, shiftQuery is ${shiftQuery}, statusQuery is ${statusQuery}`
  // );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<string>(employeeIdQuery);
  const [employeeName, setEmployeeName] = useState<string>(employeeNameQuery);
  const [unit, setUnit] = useState<string>(unitQuery);
  const [shiftDate, setShiftDate] = useState<string>(shiftDateQuery);
  const [requestedDate, setRequestedDate] =
    useState<string>(requestedDateQuery);
  const [shift, setShift] = useState<string>(shiftQuery);
  const [status, setStatus] = useState<string>(statusQuery);
  const [shiftHistories, setShiftHistories] = useState<ShiftHistoryClient[]>(
    []
  );
  const { auth } = useAuth();
  const bannerContext = useContext(BannerContext);

  /**
   * Check employee id to see if it's numeric
   * @returns true if employee id is valid, false otherwise
   */
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

  /**
   * Get all shift history data (based on user role)
   * @param event
   * @returns
   */
  const getShiftHistories = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event?.preventDefault();
    if (!validateEmployeeId()) {
      return;
    }
    await updateList();
  };

  const updateList = async (): Promise<void> => {
    try {
      let unitRequested: string = "";
      if (auth?.user?.roleId === 3) {
        const unitId: string =
          auth?.user?.roleId === 3 ? "/" + String(auth?.user?.unitId) : "";
        const getUnit = async (unitId: string): Promise<void> => {
          const res = await axios.get(`${config.apiUrl}/unit${unitId}`, {
            responseType: "json",
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          });
          const nurseManagerUnits: UnitAttributes[] = res.data;
          const nurseManagerUnit: UnitAttributes = nurseManagerUnits[0];
          unitRequested = nurseManagerUnit.name;
        };
        await getUnit(unitId);
      }

      // console.log(`unitRequested is ${unitRequested}`);
      setIsLoading((prevLoad) => !prevLoad);
      const url = `http://localhost:3003/shift-history?employeeId=${employeeId}&employeeName=${employeeName}&unit=${
        auth?.user?.roleId === 3 ? unitRequested : unit
      }&requestedDate=${requestedDate}&shiftDate=${shiftDate}&shift=${shift}&status=${status}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (res) {
        // console.log("jsonResponse is:");
        // console.dir(jsonResponse);
        setIsLoading((prevLoad) => !prevLoad);
        setShiftHistories((prevshiftHistories) => res.data);
      }
    } catch (error) {
      bannerContext?.showBanner(`Error in retrieving shift histories`, "error");
    }
  };

  // Event handlers for changing any of the search input fields
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
    setShiftDate((prevDate) => event.target.value);
  };

  const handleRequestedDateChange = (event: BaseSyntheticEvent): void => {
    setRequestedDate((prevDate) => event.target.value);
  };

  const handleShiftChange = (event: BaseSyntheticEvent): void => {
    setShift((prevShift) => event.target.value);
  };

  const handleStatusChange = (event: BaseSyntheticEvent): void => {
    setStatus((prevStatus) => event.target.value);
  };

  /**
   * Styles status column based on shift request status
   * @param status status of shift request
   * @returns
   */
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

  /**
   * Changes style of employyeeId baseed on if employee id is valid
   * @returns
   */
  const buttonStyle = (): { backgroundColor: string } => {
    return {
      backgroundColor: validateEmployeeId()
        ? "#067496"
        : "rgba(6, 116, 150, 0.3)",
    };
  };

  /**
   * Emit socket event when accept/reject button is clicked
   * @param shiftHistoryId id of shift history in db
   * @param isAccepted indicates if shift is accepted,
   */
  const acceptOrDenyShift = (
    shiftHistoryId: number,
    isAccepted: boolean
  ): void => {
    auth?.socket?.emit("shift_accept", {
      shiftHistoryId,
      isAccepted,
    });
  };

  // Updates the UI based on if shift is accepted or rejected (based on socket response)
  const shiftRequestResponseHandler = (sh: AdminShiftRequestUpdate) => {
    const newShiftHistories = shiftHistories.map(
      (shiftHistory: ShiftHistoryClient) => {
        if (shiftHistory.id === sh.shiftHistory.id) {
          return {
            ...shiftHistory,
            status: sh.isAccepted ? "Accepted" : "Rejected",
          };
        }
        return shiftHistory;
      }
    );
    if (newShiftHistories.length > 0) {
      setShiftHistories(newShiftHistories);
    }
  };

  const shiftRequestResponseErrorHandler = (sh: AdminShiftRequestUpdate) => {
    const acceptedString: string = sh.isAccepted ? "accepting" : "denying";
    bannerContext?.showBanner(`Error in ${acceptedString} shift!`, "error");
  };

  // Initial fill of list
  useEffect(() => {
    async function initialList() {
      await updateList();
    }
    initialList();
  }, []);

  useEffect(() => {
    if (auth?.socket && shiftHistories.length > 0) {
      auth?.socket.on("shift_accept_response", shiftRequestResponseHandler);
      auth?.socket.on("shift_accept_error", shiftRequestResponseErrorHandler);
    }
  }, [auth, shiftHistories]);
  return (
    <>
      <div className="w-full">
        <h1 className={page.h1}>History</h1>
        <form className={page.form} onSubmit={getShiftHistories}>
          <div className={page.submission}>
            <div>
              <label className={page.label} htmlFor="employeeId">
                Employee ID
              </label>
              <input
                id="employeeId"
                placeholder="Enter ID"
                value={employeeId}
                onChange={handleEmployeeIdChange}
                className={page.input}
              ></input>
            </div>
            <div>
              <label className={page.label} htmlFor="employeeName">
                Employee Name
              </label>
              <input
                id="employeeName"
                placeholder="Enter Name"
                value={employeeName}
                onChange={handleEmployeeNameChange}
                className={page.input}
              ></input>
            </div>

            {auth?.user?.roleId === 3 ? undefined : (
              <div>
                <label className={page.label} htmlFor="unit">
                  Unit
                </label>
                <input
                  id="unit"
                  placeholder="Enter Unit"
                  value={unit}
                  onChange={handleUnitChange}
                  className={page.input}
                ></input>
              </div>
            )}

            <div>
              <label className={page.label} htmlFor="requestedDate">
                Requested Date
              </label>
              <input
                id="requestedDate"
                value={requestedDate}
                onChange={handleRequestedDateChange}
                type="date"
                className={page.input}
              ></input>
            </div>

            <div>
              <label className={page.label} htmlFor="widget">
                Shift Date
              </label>
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
              <label className={page.label} htmlFor="shift">
                Shift
              </label>
              <select
                onChange={handleShiftChange}
                name="shift"
                id="shift"
                defaultValue={""}
                className={page.input}
              >
                <option value={""}>--Select An Option--</option>
                {shifts.map((shift, index) => (
                  <option key={uuid4()} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={page.label} htmlFor="statuses">
                Status
              </label>
              <select
                id="statuses"
                onChange={handleStatusChange}
                defaultValue={""}
                className={page.input}
              >
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
                <tr key={uuid4()}>
                  <td className={page.td}> {shiftHistory.employeeId} </td>
                  <td className={page.td}> {shiftHistory.employeeName} </td>
                  <td className={page.td}> {shiftHistory.unit} </td>
                  <td className={page.td}> {shiftHistory.createdAt} </td>
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
