
export default interface ScheduleEntryAttributes {
  id?: number;
  employeeId: number;
  lastName: string;
  firstName: string;
  middleInitial?: string;
  shiftDate: Date;
  startTime: string;
  endTime: string;
  duration: string;
  shiftType: string;
  jobCode?: string;
  costCenterId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
