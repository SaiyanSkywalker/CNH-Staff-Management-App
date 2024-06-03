/**
 * File: RoleAttributes.ts
 * Purpose: define shape of data for user roles (based off Role model)
 */
export default interface RoleAttributes {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
