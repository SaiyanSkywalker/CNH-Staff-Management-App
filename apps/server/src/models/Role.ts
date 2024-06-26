/**
 * File: Role.ts
 * Purpose: defines Role Sequelize model,
 * which corresponds to Role table in the db
 */

import { Column, DataType, Model, Table } from "sequelize-typescript";
import RoleAttributes from "@shared/src/interfaces/RoleAttributes";
@Table({ tableName: "Role" })
class Role extends Model<RoleAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;

  @Column
  name!: string;
}
export default Role;
