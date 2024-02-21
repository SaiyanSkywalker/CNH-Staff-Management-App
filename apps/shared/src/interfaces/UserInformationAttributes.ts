export default interface UserInformationAttributes {
  id?: number;
  username: string;
  password: string;
  roleId: number;
  unitId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
