/**
 * File: ShiftRequestUpdate.ts
 * Purpose: interface that shows structure of info related 
 * to object sent to mobile user when shift request is accepted or denied
 */

export default interface ShiftRequestUpdate {
  message: string;
  isAccepted: boolean;
}
