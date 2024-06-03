/**
 * File: ShiftHistoryAttributes.ts
 * Purpose: define shape of data for history of shift requests
 *  (based off ShiftHistory model)
 */
export default interface ShiftHistoryAttributes {
  id?: number;
  shiftTime: string;
  status: string;
  userId: number;
  unitId: number;
  createdAt?: Date;
  updatedAt?: Date;
  dateRequested: string;
}
