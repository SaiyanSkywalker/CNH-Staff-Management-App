import { Sequelize } from "sequelize";

export function buildScheduleEntry(sequelize: Sequelize, DataTypes: any) {
    const ScheduleEntry = sequelize.define('ScheduleEntry', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employeeId: DataTypes.INTEGER,
        lastName:  {
            type: DataTypes.STRING,
            defaultValue: "Abdullah"
        },
        firstName: {
            type: DataTypes.STRING,
            defaultValue: "Fahid",
        },
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
        tableName: 'ScheduleEntries',
        modelName: 'ScheduleEntry'
    });        
    return ScheduleEntry;
}
