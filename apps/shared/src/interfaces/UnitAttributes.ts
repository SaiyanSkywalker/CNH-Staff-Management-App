/**
 * File: UnitAttributes.ts
 * Purpose: interface that shows structure of info related 
 * to cost centers (based on Unit model)
 */
export default interface UnitAttributes {
  id?: number;
  laborLevelEntryId: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
