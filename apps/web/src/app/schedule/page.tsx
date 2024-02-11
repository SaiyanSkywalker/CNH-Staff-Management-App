"use client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";

//TODO: Style the Calendar cells
//TODO: Refactor component
//TODO: Figure out what to do
export default function Page() {
  const localizer = momentLocalizer(moment);
  const [originalScheduleData, setOriginalScheduleData] = useState<any>({});
  const [filteredScheduleData, setFilteredScheduleData] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState<string>("all");
  const [units, setUnits] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const buildEvents = (data: any, unit: string) => {
    let results: any[] = [];
    let groupedShifts: any = {};

    // TODO: Filter data for only allowed units
    const x = units.map((x) => x.laborLevelEntryId);
    // Group shifts by shiftDate, startTime, and endTime
    for (const [key, value] of Object.entries(data)) {
      if ((x.includes(parseInt(key)) && key === unit) || unit === "all") {
        value.forEach((v: any) => {
          const newKey = `${v["costCenter"]}-${v["shiftDate"]}-${v["startTime"]}-${v["endTime"]}`;
          if (!groupedShifts[newKey]) {
            groupedShifts[newKey] = [];
          }
          groupedShifts[newKey].push(v);
        });
      }
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
    // Create array of events
    debugger;
    return results;
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    setSelectedOption(selectedValue);
  };

  useEffect(() => {
    const getUnits = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "http://localhost:3003/unit",
          responseType: "json",
        });
        const data = await response.data;
        setUnits(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUnits();
  }, []);

  useEffect(() => {
    const getSchedules = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "http://localhost:3003/schedule",
          responseType: "json",
        });
        const data = await response.data;
        setOriginalScheduleData(data);
        setEvents(buildEvents(data, selectedOption));
      } catch (error) {
        console.error(error);
      }
    };
    getSchedules();
  }, [units, selectedOption]);
  return (
    <>
      <h1 className="text-4xl  p-8 font-bold text-center">Schedule</h1>
      {/* TODO: Allow for multiselect in dropdown */}
      <div className="w-100 pt-12 flex justify-center items-center">
        <div className="flex flex-col w-[65%]">
          <div className="self-end mb-8">
            <label htmlFor="units" className="block mb-2 font-semibold">
              Select Cost Center:
            </label>
            <select
              multiple
              id="unit-select"
              name="units"
              defaultValue={"all"}
              onChange={handleSelectChange}
              className={`w-[200px] p-4 text-md border border-nuetral-500 rounded cursor-pointer bg-slate-200`}
            >
              <option value="all">All</option>
              {units.map((unit, idx) => (
                <option key={idx} value={unit["laborLevelEntryId"]}>
                  {unit["name"]}
                </option>
              ))}
            </select>
          </div>
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
