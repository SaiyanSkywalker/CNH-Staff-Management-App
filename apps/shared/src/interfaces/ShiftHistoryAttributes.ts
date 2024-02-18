export default interface ShiftHistoryAttributes {
  id?: number;
  shiftTime: string;
  status: string;
  usertId: number;
  unitId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
