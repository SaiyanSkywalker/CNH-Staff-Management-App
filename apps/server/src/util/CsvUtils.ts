import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { UploadedFile } from "express-fileupload";
import moment from "moment";
import path from "path";
// Converts CSV file to a 2D
export const csvToArray = (content: string): string[][] => {
  let lines = content.split("\n").slice(1); // Skip line with header columns
  return lines.map((l) => l.trim().split(","));
};

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

export const validateSchedule = (schedule: UploadedFile): any => {
  const extension = path.extname(schedule.name);
  if (extension !== ".csv") {
    return {
      isValid: false,
      error: "File type is invalid. Only CSV files can be uploaded",
    };
  }
  if (!schedule || !schedule.data || schedule.data.length === 0) {
    return { isValid: false, error: "File can't be empty" };
  }

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
    "Facility ID",
  ];

  const fileContent = content.trim().split("\n");

  const headers: string[] = fileContent[0]
    .split(",")
    .map((x) => x.trim().replace(/\r/g, ""));

  const isValid =
    headers.length === defaultHeaders.length &&
    headers.every((header, index) => header === defaultHeaders[index]);

  if (!isValid) {
    return { isValid: false, error: "File of incorrect format" };
  }

  const data: string[][] = fileContent
    .slice(1, fileContent.length)
    .reduce((array: string[][], line: string) => {
      array.push(line.split(","));
      return array;
    }, []);

  for (let line of data) {
    if (
      isNaN(Number(line[1])) ||
      isNaN(Number(line[5])) ||
      isNaN(Number(line[14])) ||
      isNaN(Number(line[15]))
    ) {
      return {
        isValid: false,
        error:
          "Make sure Personnum, Shift Date, q, Worked Costs Center are all numeric",
      };
    }
    if (
      line[6].length !== 5 ||
      line[6][2] !== ":" ||
      line[7].length !== 5 ||
      line[7][2] !== ":" ||
      line[7].length !== 5 ||
      line[7][2] !== ":"
    ) {
      return {
        isValid: false,
        error: "Make sure all time strings follow HH:MM format",
      };
    }
  }
  return { isValid: true };
};
