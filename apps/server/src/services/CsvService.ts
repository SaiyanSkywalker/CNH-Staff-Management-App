import { ScheduleData } from "../models/ScheduleEntry";

export default class CsvService {
  constructor() {}
  csvToScheduleData(csv: string): ScheduleData[] {
    const lines: string[] = csv.split("\n").slice(1);
    return lines.map((line) => {
      const fields = line.split(",");
      return {
        employeeId: parseInt(fields[1]),
        lastName: fields[2],
        firstName: fields[3],
        middleInitial: fields[4],
        shiftDate: fields[5],
        startTime: fields[6],
        endTime: fields[7],
        duration: fields[8],
        shiftType: fields[9],
        jobCode: fields[13],
        costCenter: fields[15],
      };
    });
  }
}
