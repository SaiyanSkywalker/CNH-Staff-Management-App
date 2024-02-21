import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";

// Converts CSV file to a 2D
export const csvToArray = (content: string): string[][] => {
  let lines = content.split("\n").slice(1); // Skip the header columns of the array
  return lines.map((l) => l.trim().split("\n"));
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
      shiftDate: l[5],
      startTime: l[6],
      endTime: l[7],
      duration: l[8],
      shiftType: l[9],
      jobCode: l[13],
      costCenterId: parseInt(l[15]),
    };
  });
};
