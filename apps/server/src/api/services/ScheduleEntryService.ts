import { UploadedFile } from "express-fileupload";
import ScheduleData from "../../constants/ScheduleData";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { Op } from "sequelize";
import ScheduleEntry from "server/src/models/ScheduleEntry";
import { csvToArray, csvToScheduleData } from "server/src/util/CsvUtils";

/**
 * Retrieves data about shifts from the db
 * @param filter costCenterId, used to filter shifts
 * @returns dictioanry where each key is a costCenterId and every value is a
 * list of shifts under that cost center
 */
export const getScheduleData = async (filter: string) => {
  try {
    const upperDateBound: Date = new Date();
    const lowerDateBound = new Date(upperDateBound);
    lowerDateBound.setDate(lowerDateBound.getDate() - 14);
    const id = parseInt(filter, 10);
    if (!id) {
      // Get shifts from all cost centers if filter is undefined
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
 * saves shifts to database using data from CSV file
 * @param file file containing schedule data
 */
export const saveScheduleData = async (file: UploadedFile): Promise<void> => {
  try {
    const schedule: ScheduleEntryAttributes[] = csvToScheduleData(
      csvToArray(file.data.toString())
    );
    const batchSize = 500;

    //TODO: Come up with a more performant way to do this
    for (let i = 0; i < schedule.length; i += batchSize) {
      const batch: ScheduleEntryAttributes[] = schedule.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (data: ScheduleEntryAttributes) => {
          await ScheduleEntry.upsert(data);
        })
      );
    }
  } catch (error) {
    console.log(error);
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
