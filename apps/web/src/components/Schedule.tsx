"use client";
import {
  Calendar,
  DateLocalizer,
  View,
  Views,
  momentLocalizer,
  DateFormatFunction,
  DateRange,
  Culture,
  DateRangeFormatFunction,
} from "react-big-calendar";
import moment from "moment";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import UnitAttributes from "@shared/src/interfaces/UnitAttributes";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import config from "web/src/config";
import { CNHEvent } from "@webSrc/interfaces/CNHEvent";
import Modal from "@webSrc/components/EventModal";
import styles from "@webSrc/styles/Schedule.module.css";
import ShiftCapacityAttributes from "@shared/src/interfaces/ShiftCapacityAttributes";
import ShiftCapacityResponse from "@shared/src/interfaces/ShiftCapacityResponse";
const Schedule = () => {
  const localizer = momentLocalizer(moment);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [units, setUnits] = useState<UnitAttributes[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [monthCapacities, setMonthCapacities] = useState<any>({});
  const [view, setView] = useState<any>(Views.DAY);
  const [selectedEvent, setSelectedEvent] = useState<CNHEvent>({} as CNHEvent);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shiftFilter, setShiftFilter] = useState<string>("4");
  const [schedules, setSchedules] = useState<{
    [key: string]: ScheduleEntryAttributes[];
  }>({});
  const [defaultCapacities, setDefaultCapacities] = useState<
    ShiftCapacityAttributes[]
  >([]);
  const [updatedCapacities, setUpdatedCapacities] = useState<
    ShiftCapacityAttributes[]
  >([]);

  const hardCodedCapacity = 25; // TODO: change with actual capacity once shift capacity page is finished
  const { views, defaultView, formats } = useMemo(() => {
    const timeGutterFormatter: DateFormatFunction = (
      date: Date,
      culture?: Culture,
      localizer?: DateLocalizer
    ): string => {
      if (localizer) {
        return localizer.format(date, "HH:mm", culture);
      }
      return "";
    };
    const eventTimeRangeFormatter: DateRangeFormatFunction = (
      range: DateRange,
      culture?: Culture,
      localizer?: DateLocalizer
    ): string => {
      if (localizer) {
        return `${localizer.format(
          range.start,
          "HH:mm",
          culture
        )} - ${localizer.format(range.end, "HH:mm", culture)}`;
      }
      return "";
    };
    return {
      views: ["month", "week", "day"] as View[],
      defaultView: Views.DAY,
      // Formats dates in the calendar to use 24-hr clock
      formats: {
        timeGutterFormat: timeGutterFormatter,
        eventTimeRangeFormat: eventTimeRangeFormatter,
      },
    };
  }, []);

  /**
   * Creates list of events for calnedar component based on schedule data
   * and user selection for shift intervals
   * @param shifts shifts from CSV file
   * @param filter string; represents shift intervals (4, 8, 12 hr shifts)
   * @returns list of events for Calendar component
   */
  const buildEvents = (
    shifts: { [key: string]: ScheduleEntryAttributes[] },
    filter: string
  ): CNHEvent[] => {
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

    // Get capacites
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
    let capacity: number;
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

      // First look for updated capacity
      const updatedCapacity = updatedCapacities.find(
        (value: ShiftCapacityAttributes) =>
          value.shift === `${tokens[2]} - ${tokens[3]}` &&
          value.shiftDate ===
            moment(tokens[1], "YYYYMMDD").format("YYYY-MM-DD") &&
          value.laborLevelEntryId === Number(tokens[0])
      )?.capacity;
      if (updatedCapacity) {
        console.log(updatedCapacity);
      }
      const defaultCapacity = defaultCapacities.find(
        (shiftCapacity: ShiftCapacityAttributes) => {
          return (
            shiftCapacity.shift === `${tokens[2]} - ${tokens[3]}` &&
            shiftCapacity.laborLevelEntryId === Number(tokens[0])
          );
        }
      )?.capacity;

      capacity = updatedCapacity || defaultCapacity || hardCodedCapacity;
      // console.log(`Default: ${defaultCapacity}`);
      // console.log(`updated: ${updatedCapacity}`);
      // console.log(`Capacity ${capacity}`);
      const capacityRatio = buckets[b].length / capacity;
      const date = moment(tokens[1], "YYYYMMDD").toDate().toString();

      if (!mc[date]) {
        mc[date] = capacityRatio;
      } else {
        mc[date] = Math.min(mc[date], capacityRatio);
      }
      const event: CNHEvent = {
        title: `Cost Center: ${tokens[0]}, ${buckets[b].length}/${capacity} ${
          endTime.getDay() - startTime.getDay() != 0 ? " (Night Shift)" : ""
        }`,
        start: startTime,
        end: endTime,
        capacityRatio: capacityRatio,
      };
      events.push(event);
    }
    setMonthCapacities(mc);
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

  const handleSelectChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };
  const handleShiftFilterChange = (e: ChangeEvent<HTMLFormElement>) => {
    setShiftFilter(e.target.value);
    setEvents(buildEvents(schedules, e.target.value));
  };
  const getSchedules = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/schedule?costCenterId=${selectedOption}`,
        responseType: "json",
      });
      const data = await response.data;
      if (data) {
        setSchedules(data);
        setEvents(buildEvents(data, shiftFilter));
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
      const data = response.data;
      setUnits(data);
    } catch (err) {
      console.error(err);
    }
  };
  const getCapacities = async () => {
    // Get default capacity
    const response = await axios({
      method: "GET",
      url: `${config.apiUrl}/shift-capacity/admin/`,
      responseType: "json",
    });
    const data: ShiftCapacityResponse = response.data;
    setDefaultCapacities(data.default);
    setUpdatedCapacities(data.updated);
  };
  useEffect(() => {
    getUnits();
  }, []);
  useEffect(() => {
    getCapacities();
    getSchedules();
  }, [units, selectedOption]);
  return (
    <>
      <h1 className="text-4xl p-8 font-bold text-center">Schedule</h1>
      <div className="pt-4 flex justify-center items-center w-full">
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
