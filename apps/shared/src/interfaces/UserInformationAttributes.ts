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
