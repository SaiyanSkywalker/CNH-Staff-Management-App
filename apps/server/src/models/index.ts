import { Sequelize } from "sequelize";
import ScheduleEntry from "./ScheduleEntry";
import Announcement from "./Announcement";
import ShiftHistory from "./ShiftHistory";
import Role from "./Role";
import ShiftCapacity from "./ShiftCapacity";
import Unit from "./Unit";
import UserInformation from "./UserInformation";

const createModels = (sequelize: Sequelize) => {
  const models = [
    ScheduleEntry,
    Unit,
    Role,
    ShiftCapacity,
    UserInformation,
    ShiftHistory,
    Announcement,
  ];
  models.forEach((m) => m(sequelize));
};

export default createModels;
