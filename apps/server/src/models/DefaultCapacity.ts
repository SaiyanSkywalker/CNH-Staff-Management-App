import {
    Model,
    Column,
    Table,
    DataType,
    BelongsTo,
  } from "sequelize-typescript";
  import DefaultCapacityAttributes from "@shared/src/interfaces/DefaultCapacityAttributes";
  import Unit from "./Unit";
  
  @Table({ tableName: "DefaultCapacity" })
  class DefaultCapacity extends Model<DefaultCapacityAttributes> {
    @Column({
      primaryKey: true,
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
    })
    id!: number;
  
    @BelongsTo(() => Unit, { targetKey: "id", foreignKey: "unitId", onDelete: "CASCADE" })
    unit!: Unit;
  
    @Column(DataType.STRING)
    shift!: string;
    @Column(DataType.INTEGER)
    capacity!: number;
  }
  export default DefaultCapacity;
  