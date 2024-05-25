/**
 * File: ScheduleEntryService.ts
 * Purpose: service that handles operations with database involving ScheduleEntry
 */
import { UploadedFile } from "express-fileupload";
import ScheduleData from "../../constants/ScheduleData";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { Op } from "sequelize";
import ScheduleEntry from "server/src/models/ScheduleEntry";
import { csvToArray, csvToScheduleData } from "server/src/util/CsvUtils";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";
import { error } from "console";

/**
 * Used in mobile app, gets all shifts for a particular unit
 * @param date date string
 * @param costCenterId id for cost center
 * @returns list of shifts
 */
export const getUnitScheduleData = async (
  date: string,
  costCenterId: number
) => {
  try {
    const unit = await Unit.findOne({
      where: {
        id: costCenterId,
      },
    });

    const shifts = await ScheduleEntry.findAll({
      where: {
        costCenterId: unit?.laborLevelEntryId,
        shiftDate: new Date(date),
      },
    });
    return shifts;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves data about shifts (within the last two weeks) from the db
 * @param filter costCenterId, used to filter shifts
 * @returns dictioanry where
 * key: costCenterId
 * value: list of shifts under that cost center
 */
export const getScheduleData = async (filter: string) => {
  try {

    // Sets a date range of 2 weeks to retrieve shifts
    const upperDateBound: Date = new Date();
    const lowerDateBound = new Date(upperDateBound);
    lowerDateBound.setDate(lowerDateBound.getDate() - 14);
    const id = parseInt(filter, 10);
    if (!id) {
      // If filter is undefined, get shifts from all cost centers
      const scheduleEntries: ScheduleEntry[] = await ScheduleEntry.findAll({
        where: {
          [Op.and]: [
            {
              shiftDate: {
                [Op.gte]: lowerDateBound,
                [Op.lte]: upperDateBound,
              },
            },
            { shiftType: "REG" },
          ],
        },
      });
      return scheduleEntries.reduce((acc, val) => {
        if (!acc[val.costCenterId]) {
          acc[val.costCenterId] = [];
        }
        acc[val.costCenterId].push(val);
        return acc;
      }, {} as { [key: string]: ScheduleEntryAttributes[] });
    } else {
      // Get shifts from a specific call center
      const scheduleEntries: ScheduleEntry[] = await ScheduleEntry.findAll({
        where: {
          [Op.and]: [
            { costCenterId: filter },
            {
              shiftDate: {
                [Op.gte]: lowerDateBound,
                [Op.lte]: upperDateBound,
              },
            },
            { shiftType: "REG" },
          ],
        },
      });
      let entriesByCostCenter: { [key: string]: ScheduleEntryAttributes[] } =
        {};
      entriesByCostCenter[id] = scheduleEntries as ScheduleEntryAttributes[];
      return entriesByCostCenter;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Gets all shifts a nurse is scheduled for
 * @param username name that user uses to log in to mobile application
 */
export const getScheduleDataForUser = async (username: string) => {
  try {
    const user: UserInformation | null = await UserInformation.findOne({
      where: { username: username },
    });
    if (!user) {
      throw error;
    }
    const scheduleEntries: ScheduleEntryAttributes[] =
      await ScheduleEntry.findAll({
        where: {
          employeeId: user.employeeId,
        },
      });
    return scheduleEntries;
  } catch (error) {
    console.log(error);
  }
};
/**
 * saves shifts to database using data from CSV file
 * @param file file containing schedule data
 */
export const saveScheduleData = async (file: UploadedFile): Promise<void> => {
  try {
    const schedule: ScheduleEntryAttributes[] = csvToScheduleData(
      csvToArray(file.data.toString())
    );

    const primaryKeys = schedule.map((data) => {
      return {
        employeeId: data.employeeId,
        shiftDate: data.shiftDate,
        shiftType: data.shiftType,
        costCenterId: data.costCenterId,
      };
    });
    // Remove all exisiting entries in table that are on incoming CSV
    await ScheduleEntry.destroy({
      where: {
        [Op.or]: primaryKeys,
      },
    });

    // Add all new data to db
    await ScheduleEntry.bulkCreate(schedule);
  } catch (error) {
    throw new Error("Error saving data to UserInformation table");
  }
};

/**
 * Gets shifts (from test data file)
 * @param filter costCenterId, used to filter shifts
 * @returns dictioanry where each key is a costCenterId and every value is a
 * list of shifts under that cost center
 */
export const handleTestScheduleData = (
  filter: string
): { [key: string]: ScheduleEntryAttributes[] } => {
  const costCenterId = parseInt(filter);
  const data = ScheduleData;
  const scheduleEntries: ScheduleEntryAttributes[] = csvToScheduleData(
    data
  ).filter((schedule) => schedule.shiftType === "REG");
  let entriesByCostCenter: { [key: string]: ScheduleEntryAttributes[] } = {};

  // If no filter is applied return all the shifts across all cost centers
  if (!costCenterId) {
    entriesByCostCenter = scheduleEntries.reduce((acc, value) => {
      const key = value.costCenterId;
      if (!acc[value.costCenterId]) {
        acc[key] = [];
      }
      acc[key].push(value);
      return acc;
    }, {} as { [key: string]: ScheduleEntryAttributes[] });
  } else {
    entriesByCostCenter[costCenterId] = scheduleEntries.filter(
      (x) => x.costCenterId === costCenterId
    );
  }
  return entriesByCostCenter;
};
