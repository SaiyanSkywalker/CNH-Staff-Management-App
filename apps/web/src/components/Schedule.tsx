"use client";
import { Calendar, View, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import UnitAttributes from "@shared/src/interfaces/UnitAttributes";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import config from "web/src/config";
import { CNHEvent } from "@webSrc/interfaces/CNHEvent";
import Modal from "@webSrc/components/EventModal";
import styles from "@webSrc/styles/Schedule.module.css";
//TODO: Add night shift toggle?
//TODO: Change events based on user filter
//TODO: Add some type of checked styling to filters (on page load for default)

const Schedule = () => {
  const localizer = momentLocalizer(moment);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [units, setUnits] = useState<UnitAttributes[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [monthCapacities, setmonthCapacities] = useState<any>({});
  const [view, setView] = useState<any>(Views.DAY);
  const [selectedEvent, setSelectedEvent] = useState<CNHEvent>({} as CNHEvent);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shiftFilter, setShiftFilter] = useState<string>("4");
  const [schedules, setSchedules] = useState<{
    [key: string]: ScheduleEntryAttributes[];
  }>({});
  const defaultCapacity = 10; // Will change with actual capacity once shift capacity page is finished
  const { views, defaultView, formats } = useMemo(() => {
    return {
      views: ["month", "week", "day"] as View[],
      defaultView: Views.DAY,
      // Formats dates to use
      formats: {
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, "HH:mm", culture),
        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
          `${localizer.format(start, "HH:mm", culture)} - ${localizer.format(
            end,
            "HH:mm",
            culture
          )}`,
      },
    };
  }, []);

  const getEvents = (
    shifts: { [key: string]: ScheduleEntryAttributes[] },
    filter: string
  ) => {
    //TODO: filter shifts based on user selection
    //TODO: Add filters (4hr, 8hr, 12hr) for shifts
    //TODO: Group shifts into intervals (shift that span 2 days count to start day)
    const shiftFilters: { [key: string]: string[][] } = {
      "4": [
        ["07:00", "11:00"],
        ["11:00", "15:00"],
        ["15:00", "19:00"],
        ["19:00", "23:00"],
        ["23:00", "07:00"],
      ],
      "8": [
        ["07:00", "15:00"],
        ["15:00", "23:00"],
        ["23:00", "07:00"],
      ],
      "12": [
        ["07:00", "19:00"],
        ["19:00", "07:00"],
      ],
    };

    const selectedFilters: string[][] = shiftFilters[filter];
    const buckets: { [key: string]: ScheduleEntryAttributes[] } = {};
    const events: any[] = [];

    // Group shifts by date
    for (const costCenter in shifts) {
      const costCenterShifts = shifts[costCenter];
      const shiftsByDate: any = costCenterShifts.reduce((acc, val) => {
        const shiftDate = val.shiftDate.toString();
        if (!acc[shiftDate]) {
          acc[shiftDate] = [];
        }
        acc[shiftDate].push(val);
        return acc;
      }, {} as { [key: string]: ScheduleEntryAttributes[] });

      // For each date, loop through shifts and place them in appropiate bucket
      for (const day in shiftsByDate) {
        const currentShifts: ScheduleEntryAttributes[] = shiftsByDate[day];
        const dateString = moment(new Date(day)).format("YYYYMMDD");
        selectedFilters.forEach((filter) => {
          const key = `${costCenter},${day},${filter[0]},${filter[1]}`;
          // Compare shift times with selected window
          const lowerDateBound = moment(
            `${dateString} ${filter[0]}`,
            "YYYYMMDD HH:mm"
          ).toDate();
          const upperDateBound = moment(
            `${dateString} ${filter[1]}`,
            "YYYYMMDD HH:mm"
          ).toDate();

          // Handles case where shift extends into next day
          if (upperDateBound < lowerDateBound) {
            upperDateBound.setDate(upperDateBound.getDate() + 1);
          }

          // If shift is in window, add it to bucket
          buckets[key] = currentShifts.filter(
            (shift: ScheduleEntryAttributes) => {
              // store start and end times of shift
              const shiftStartTime = moment(
                `${dateString} ${shift.startTime}`,
                "YYYYMMDD HH:mm"
              ).toDate();
              const shiftEndTime = moment(
                `${dateString} ${shift.endTime}`,
                "YYYYMMDD HH:mm"
              ).toDate();

              if (shiftEndTime < shiftStartTime) {
                shiftEndTime.setDate(shiftEndTime.getDate() + 1);
              }
              //Subtract 30 minutes from shiftEndTIme (30 minutes is added to each shift to account for change over between staff)
              shiftEndTime.setMinutes(shiftEndTime.getMinutes() - 30);

              return !(
                (shiftStartTime < lowerDateBound &&
                  shiftEndTime < lowerDateBound) ||
                (shiftStartTime > upperDateBound &&
                  shiftEndTime > upperDateBound)
              );
            }
          );
        });
      }
    }
    const mc: { [key: string]: number } = {};
    // Go through buckets, create events and push them to final events array
    for (const b in buckets) {
      const tokens = b.split(",");
      const startTime = moment(
        `${moment(new Date(tokens[1])).format("YYYYMMDD")} ${tokens[2]} `,
        "YYYYMMDD HH:mm"
      ).toDate();
      const endTime = moment(
        `${moment(new Date(tokens[1])).format("YYYYMMDD")} ${tokens[3]} `,
        "YYYYMMDD HH:mm"
      ).toDate();
      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }
      // Get the lowest shift capacity for each date on the schedule
      const capacityRatio = buckets[b].length / defaultCapacity;
      const date = moment(tokens[1], "YYYYMMDD").toDate().toString();

      if (!mc[date]) {
        mc[date] = capacityRatio;
      } else {
        mc[date] = Math.min(mc[date], capacityRatio);
      }
      const event: CNHEvent = {
        title: `Cost Center: ${tokens[0]}, ${buckets[b].length}/${defaultCapacity}`,
        start: startTime,
        end: endTime,
        capacityRatio: capacityRatio,
      };
      events.push(event);
    }
    setmonthCapacities(mc);
    return events;
  };
  const handleEventSelect = (event: CNHEvent) => {
    setSelectedEvent(event);
    openModal();
  };

  const closeModal: () => void = () => {
    setShowModal(false);
  };
  const openModal: () => void = () => {
    setShowModal(true);
  };
  const handleViewChange = useCallback(
    (newView: View) => {
      setView(newView);
    },
    [setView]
  );

  /**
   * Returns tailwind class for background color styling based on capacityRatio
   * @param capacityRatio ratio of current staff members to expected amount based on shift
   * @returns
   */
  const getStyleBasedOnCapacityRatio = (capacityRatio: number) => {
    if (capacityRatio >= 1) {
      return {
        className: "bg-green-500",
      };
    } else if (capacityRatio < 1 && capacityRatio >= 0.9) {
      return {
        className: "bg-yellow-500",
      };
    } else {
      return {
        className: "bg-red-500",
      };
    }
  };

  /**
   * applies styles to event elements in calendar
   * based on capacity ratio
   * @param event contains info about event
   * @returns
   */
  const customEventPropGetter = (event: CNHEvent) => {
    if (view != Views.MONTH) {
      return getStyleBasedOnCapacityRatio(event.capacityRatio);
    } else {
      return { className: "hidden " };
    }
  };

  /**
   * Styles the calendar cells in the month view
   * @param date date of the calendar cell
   * @returns
   */
  const customDayPropGetter = (date: Date) => {
    const dateString = date.toString();
    if (monthCapacities[dateString] != undefined && view === Views.MONTH) {
      const capacityRatio = monthCapacities[dateString];
      return getStyleBasedOnCapacityRatio(capacityRatio);
    }
    return {};
  };

  /**
   * Builds a list of events to be used in calendar widget
   * @param data shifts group by unit
   * @returns
   */
  const buildEvents = (data: { [key: string]: ScheduleEntryAttributes[] }) => {
    let results: any[] = [];
    let groupedShifts: { [key: string]: ScheduleEntryAttributes[] } = {};
    let mc: { [key: string]: number } = {};

    // Group shifts by shiftDate, startTime, and endTime
    for (const [_, value] of Object.entries(data)) {
      value.forEach((v: ScheduleEntryAttributes) => {
        const dateString = moment(new Date(v["shiftDate"])).format("YYYYMMDD");
        const newKey = `${v.costCenterId}-${dateString}-${v.startTime}-${v.endTime}`;
        if (!groupedShifts[newKey]) {
          groupedShifts[newKey] = [];
        }
        groupedShifts[newKey].push(v);
      });
    }

    // Iterate through each shift
    for (const property in groupedShifts) {
      const tokens = property.split("-");
      const startTime = moment(
        `${tokens[1]} ${tokens[2]}`,
        "YYYYMMDD HH:mm"
      ).toDate();
      const endTime = moment(
        `${tokens[1]} ${tokens[3]}`,
        "YYYYMMDD HH:mm"
      ).toDate();

      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }
      const capacityRatio = groupedShifts[property].length / defaultCapacity;

      // Get the lowest shift capacity for each date on the schedule
      const date = moment(tokens[1], "YYYYMMDD").toDate().toString();
      if (!mc[date]) {
        mc[date] = capacityRatio;
      } else {
        mc[date] = Math.min(mc[date], capacityRatio);
      }

      const event = {
        title: `Cost Center: ${tokens[0]}, ${groupedShifts[property].length}/${defaultCapacity}`,
        start: startTime,
        end: endTime,
        capacityRatio: capacityRatio,
      };
      results.push(event);
    }

    setmonthCapacities(mc);
    return results;
  };

  const handleSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };
  const handleShiftFilterChange = (e: ChangeEvent<HTMLFormElement>) => {
    setShiftFilter(e.target.value);
    setEvents(getEvents(schedules, e.target.value));
  };
  const getSchedules = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/schedule?costCenterId=${selectedOption}`,
        responseType: "json",
      });
      const data = await response.data;
      // setEvents(buildEvents(data));
      if (data) {
        setSchedules(data);
        setEvents(getEvents(data, shiftFilter));
      }
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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

      <div className="w-[85%] pt-12 flex items-center">
        <div className="flex flex-col w-full">
          <div className="flex justify-between align-center">
            <div>
              <label htmlFor="units" className="block mb-2 font-semibold">
                Choose Shift Filter:
              </label>
              <form
                className="self-center flex gap-x-4"
                onChange={handleShiftFilterChange}
              >
                <div className={styles["shift-filter-container"]}>
                  <input
                    defaultChecked
                    type="radio"
                    name="shiftFilter"
                    id="fourHourShift"
                    value="4"
                  />
                  <label htmlFor="fourHourShift">4 Hour</label>
                </div>
                <div className={styles["shift-filter-container"]}>
                  <input
                    type="radio"
                    name="shiftFilter"
                    id="eightHourShift"
                    value="8"
                  />
                  <label htmlFor="eightHourShift">8 Hour</label>
                </div>
                <div className={styles["shift-filter-container"]}>
                  <input
                    type="radio"
                    name="shiftFilter"
                    id="twelveHourShift"
                    value="12"
                  />
                  <label htmlFor="twelveHourShift">12 Hour</label>
                </div>
              </form>
            </div>
            <div className="self-end mb-8">
              <label htmlFor="units" className="block mb-2 font-semibold">
                Select Cost Center:
              </label>
              <select
                id="unit-select"
                name="units"
                defaultValue={""}
                onChange={handleSelectChange}
                className={`w-[200px] p-4 text-md border border-nuetral-500 rounded cursor-pointer bg-transparent`}
              >
                <option value="">All</option>
                {units.map((unit, idx) => (
                  <option key={idx} value={unit["laborLevelEntryId"]}>
                    {unit["name"]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Calendar
            className="h-[700px] overflow-scroll border-4 rounded-lg border-gray-400 shadow-lg p-12"
            localizer={localizer}
            events={events}
            views={views}
            defaultView={defaultView}
            eventPropGetter={customEventPropGetter}
            onView={handleViewChange}
            dayPropGetter={customDayPropGetter}
            onSelectEvent={handleEventSelect}
            selectable
            formats={formats}
          />
        </div>
      </div>
      <Modal isOpen={showModal} closeModal={closeModal} event={selectedEvent} />
    </>
  );
};
export default Schedule;
