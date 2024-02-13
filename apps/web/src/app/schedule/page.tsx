"use client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import UnitAttributes from "@shared/src/interfaces/UnitAttributes";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import config from "web/src/config";

export default function Page() {
  const localizer = momentLocalizer(moment);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [units, setUnits] = useState<UnitAttributes[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  //TODO: handle case where event goes into the next day
  const buildEvents = (data: { [key: string]: ScheduleEntryAttributes[] }) => {
    let results: any[] = [];
    let groupedShifts: any = {};

    // Group shifts by shiftDate, startTime, and endTime
    for (const [key, value] of Object.entries(data)) {
      value.forEach((v: any) => {
        const newKey = `${v["costCenterId"]}-${v["shiftDate"]}-${v["startTime"]}-${v["endTime"]}`;
        if (!groupedShifts[newKey]) {
          groupedShifts[newKey] = [];
        }
        groupedShifts[newKey].push(v);
      });
    }

    // Create array of events
    for (const property in groupedShifts) {
      const tokens = property.split("-");
      const event = {
        title: `Cost Center: ${tokens[0]}, ${groupedShifts[property].length}/${groupedShifts[property].length}`,
        start: moment(`${tokens[1]} ${tokens[2]}`, "YYYYMMDD HH:mm").toDate(),
        end: moment(`${tokens[1]} ${tokens[3]}`, "YYYYMMDD HH:mm").toDate(),
      };
      results.push(event);
    }
    return results;
  };

  const handleSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    await getSchedules();
  };

  const getSchedules = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/schedule?unit=${selectedOption}`,
        responseType: "json",
      });
      const data = await response.data;
      setEvents(buildEvents(data));
    } catch (error) {
      console.error(error);
    }
  };
  const getUnits = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/unit`,
        responseType: "json",
      });
      const data = await response.data;
      setUnits(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUnits();
  }, []);

  useEffect(() => {
    getSchedules();
  }, [units, selectedOption]);
  return (
    <>
      <h1 className="text-4xl  p-8 font-bold text-center">Schedule</h1>

      <div className="w-100 pt-12 flex justify-center items-center">
        <div className="flex flex-col w-[65%]">
          <div className="self-end mb-8">
            <label htmlFor="units" className="block mb-2 font-semibold">
              Select Cost Center:
            </label>
            <select
              id="unit-select"
              name="units"
              defaultValue={"all"}
              onChange={handleSelectChange}
              className={`w-[200px] p-4 text-md border border-nuetral-500 rounded cursor-pointer bg-transparent`}
            >
              <option value="all">All</option>
              {units.map((unit, idx) => (
                <option key={idx} value={unit["laborLevelEntryId"]}>
                  {unit["name"]}
                </option>
              ))}
            </select>
          </div>
          {/* //TODO: Style the Calendar cells/events 
          //TODO: Add in modal for when
          you click "see more" on month view */}
          <Calendar
            className="h-[800px]"
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day"]}
            // dayLayoutAlgorithm={"no-overlap"}
          />
        </div>
      </div>
    </>
  );
}
