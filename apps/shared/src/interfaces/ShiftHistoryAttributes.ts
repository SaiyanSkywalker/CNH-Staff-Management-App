export default interface ShiftHistoryAttributes {
  id?: number;
  shiftTime: string;
  status: string;
  userId: number;
  unitId: number;
  createdAt?: Date;
  updatedAt?: Date;
  dateRequested: Date;
}
