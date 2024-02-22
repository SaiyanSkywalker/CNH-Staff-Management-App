import ScheduleData from "../../constants/ScheduleData";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { Op } from "sequelize";
import ScheduleEntry from "server/src/models/ScheduleEntry";
import { csvToScheduleData } from "server/src/util/CsvUtils";

export const getScheduleData = async (filter: string) => {
  //TODO: refactor code
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

/** Filters test data by cost center */
export const handleTestScheduleData = (filter: string) => {
  const costCenterId = parseInt(filter);
  const data = ScheduleData;
  const scheduleEntries: ScheduleEntryAttributes[] = csvToScheduleData(data);
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
