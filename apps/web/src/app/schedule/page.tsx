"use client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

export default function Page() {
  const localizer = momentLocalizer(moment);
  // TODO: Add mock events (use CSV sheet)
  return (
    <>
      <h1 className="text-4xl  p-8 font-bold text-center">Schedule</h1>
      <div className="w-100 pt-12 flex justify-center items-center">
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </>
  );
}
