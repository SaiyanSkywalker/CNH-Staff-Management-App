import ShiftHistoryAttributes from "./ShiftHistoryAttributes";

export default interface ShiftRequestUpdate {
  username: string;
  message: string;
  isAccepted: boolean;
  shift: ShiftHistoryAttributes;
}
