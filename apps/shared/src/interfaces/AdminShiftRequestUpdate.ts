import ShiftHistoryClient from "./ShiftHistoryClient";

export default interface AdminShiftRequestUpdate {
  shiftHistory: ShiftHistoryClient;
  isAccepted: boolean;
}
