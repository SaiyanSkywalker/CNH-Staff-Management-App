export default interface UserInformationAttributes {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId?: number;
  unitId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
