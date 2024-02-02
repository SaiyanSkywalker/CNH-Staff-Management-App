import { Sequelize } from "sequelize";
import ScheduleEntry from "./ScheduleEntry";
import UnitAndShiftCapacity from "./UnitAndShiftCapacity";

const createModels = (sequelize: Sequelize) => {
  
  return {
    ScheduleEntry: ScheduleEntry(sequelize)    
  };
};

export default createModels;
