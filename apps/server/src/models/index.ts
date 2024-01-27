import { Sequelize } from "sequelize";
import ScheduleEntry from "./ScheduleEntry";

const createModels = (sequelize: Sequelize) => {
  return {
    ScheduleEntry: ScheduleEntry(sequelize),
  };
};

export default createModels;
