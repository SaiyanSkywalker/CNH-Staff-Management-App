/**
 * File: ShiftCapacityConfig.ts
 * Purpose: defines shape of request body when sending shift capacities
 */
export default interface ShiftCapacityConfig {
  shiftDate: Date;
  shift: string;
  capacities: { [key: string]: number };
}
