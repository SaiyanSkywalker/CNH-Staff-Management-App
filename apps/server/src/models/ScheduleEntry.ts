import { DataTypes, Sequelize } from "sequelize";

const ScheduleEntry = (sequelize: Sequelize) => {
  return sequelize.define(
    "ScheduleEntry",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: DataTypes.INTEGER,
      lastName: DataTypes.STRING,
      firstName: DataTypes.STRING,
      middleInitial: DataTypes.STRING,
      shiftDate: DataTypes.STRING,
      startTime: DataTypes.STRING,
      endTime: DataTypes.STRING,
      duration: DataTypes.STRING,
      shiftType: DataTypes.STRING,
      jobCode: DataTypes.STRING,
      costCenter: DataTypes.STRING,
    },
    {
      modelName: "ScheduleEntry",
      tableName: "ScheduleEntry",
    }
  );
};
export default ScheduleEntry;
