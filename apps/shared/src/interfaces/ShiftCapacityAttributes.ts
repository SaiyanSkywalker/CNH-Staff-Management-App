/**
 * File: ShiftCapacityAttributes.ts
 * Purpose: define shape of data for staff capacities for a particular unit
 *  (based off ShiftCapacity model)
 */
export default interface ShiftCapacityAttributes {
  id?: number;
  unitId?: number;
  shift: string;
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
  shiftDate?: string;
  laborLevelEntryId?: number;
}
