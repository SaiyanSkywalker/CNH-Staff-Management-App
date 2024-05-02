export default interface UserInformationAttributes {
  id?: number;
  employeeId: number;
  username: string;
  firstName: string;
  lastName: string;
  middleIntial?: string;
  password: string;
  roleId?: number;
  unitId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
