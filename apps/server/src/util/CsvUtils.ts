/**
 * File: CsvUtils.ts
 * Purpose: contains utility functions used to process CSV files
 */
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { UploadedFile } from "express-fileupload";
import moment from "moment";

// Converts CSV file to a 2D array
export const csvToArray = (content: string): string[][] => {
  let lines = content.split("\n").slice(1); // Skip line with header columns
  return lines.map((l) => l.trim().split(","));
};

/**
 * Converts 2D array to array of ScheduleEntry
 * @param lines contents of CSV files
 * @returns
 */
export const csvToScheduleData = (
  lines: string[][]
): ScheduleEntryAttributes[] => {
  return lines.map((l) => {
    return {
      employeeId: parseInt(l[1]),
      lastName: l[2],
      firstName: l[3],
      middleInitial: l[4],
      shiftDate: moment(l[5], "YYYYMMDD").toDate(),
      startTime: l[6],
      endTime: l[7],
      duration: l[8],
      shiftType: l[9],
      jobCode: l[13],
      costCenterId: parseInt(l[15]),
    };
  });
};

/**
 * Checks headers of CSV to ensure that CSV file is valid
 * @param schedule uploaded CSV file
 * @returns object indicating if schedule is valid, if schedule isn't valid object also contains error
 */
export const validateSchedule = (schedule: UploadedFile): any => {
  const content = schedule.data.toString();

  const defaultHeaders = [
    "Record Type",
    "Personnum",
    "Last Name",
    "First Name",
    "MI",
    "Shift Date",
    "Start Time",
    "End Date",
    "Duration",
    "Shift Type",
    "Null",
    "Null",
    "Processed Time",
    "Job Code",
    "q",
    "Worked Costs Center",
    "Facility ID\r",
  ];

  if (!content) {
    return { isValid: false, error: "File can't be empty" };
  }

  const headers = content.trim().split("\n")[0].split(",");

  // Check if CSV contains headers in correct order
  const isValid =
    headers.length === defaultHeaders.length &&
    headers.every((header, index) => header === defaultHeaders[index]);

  if (!isValid) {
    return { isValid: false, error: "File has incorrect format" };
  }

  return { isValid: true };
};
