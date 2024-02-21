import { Column, DataType, Model, Table } from "sequelize-typescript";
import UnitAttributes from "@shared/src/interfaces/UnitAttributes";

@Table({ tableName: "Unit" })
class Unit extends Model<UnitAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  laborLevelEntryId!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  description!: string;
}

export default Unit;
