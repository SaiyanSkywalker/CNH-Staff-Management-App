/**
 * File: DefaultCapacityAttributes.ts
 * Purpose: define shape of data for JWT payloads used in project
 * Attaches user info to JWT token
 */

export default interface DefaultCapacityAttributes {
  id?: number;
  unitId: number;
  shift: string;
  capacity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
