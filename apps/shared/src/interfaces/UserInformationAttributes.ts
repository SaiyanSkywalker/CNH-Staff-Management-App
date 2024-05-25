/**
 * File: UnitAttributes.ts
 * Purpose: interface that shows structure of info related 
 * to users (based on UserInformation model)
 */

import RoleAttributes from "./RoleAttributes";
import UnitAttributes from "./UnitAttributes";

export default interface UserInformationAttributes {
  id?: number;
  employeeId: number;
  username: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  middleIntial?: string;
  password: string;
  roleId?: number;
  role?: RoleAttributes;
  unitId?: number;
  unit?: UnitAttributes;
  createdAt?: Date;
  updatedAt?: Date;
}
