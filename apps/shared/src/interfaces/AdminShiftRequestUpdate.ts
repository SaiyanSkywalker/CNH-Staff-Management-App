/**
 * File: AdminShiftRequestUpdate.ts
 * Purpose: defines shape of data for object sent through socket 
 * when admin accepts/denies shift request
 */
import ShiftHistoryClient from "./ShiftHistoryClient";

export default interface AdminShiftRequestUpdate {
  shiftHistory: ShiftHistoryClient;
  isAccepted: boolean;
}
