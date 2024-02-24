export default interface ShiftCapacityAttributes {
  id?: number;
  unitId: number;
  shift: string;
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
  shiftDate: Date;
}
