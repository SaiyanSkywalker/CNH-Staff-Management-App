/**
 * File: ShiftCapacityRequest.ts
 * Purpose: define shape of data for the request body for post requests involving
 * ShiftCapacity
 */

import ShiftCapacityAttributes from "./ShiftCapacityAttributes";

export default interface ShiftCapacityResponse {
  default: ShiftCapacityAttributes[];
  updated: ShiftCapacityAttributes[];
}
