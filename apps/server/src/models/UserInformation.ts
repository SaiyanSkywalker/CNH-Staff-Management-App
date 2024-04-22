import {
  DataType,
  Table,
  Column,
  BelongsTo,
  Model,
} from "sequelize-typescript";
import Unit from "./Unit";
import Role from "./Role";
import UserInformationAttributes from "@shared/src/interfaces/UserInformationAttributes";

@Table({ tableName: "UserInformation" })
class UserInformation extends Model<UserInformationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  employeeId!: number;
  @Column({ type: DataType.STRING, allowNull: false })
  username!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  firstName!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  lastName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @BelongsTo(() => Unit, { foreignKey: "unitId", targetKey: "id" })
  unit?: Unit;
  @BelongsTo(() => Role, { foreignKey: "roleId", targetKey: "id" })
  role?: Role;
}
export default UserInformation;
