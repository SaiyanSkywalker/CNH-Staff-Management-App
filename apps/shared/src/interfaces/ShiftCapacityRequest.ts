/**
 * File: ShiftCapacityRequest.ts
 * Purpose: define shape of data for the request body for post requests involving
 * ShiftCapacity
 */

export default interface ShiftCapacityRequest {
  shiftDate: string;
  shiftTime: string;
  capacities: { [key: string]: number };
  isDefault: boolean;
}
