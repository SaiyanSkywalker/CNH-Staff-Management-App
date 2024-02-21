import ScheduleData from "../../constants/ScheduleData";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { csvToScheduleData } from "server/src/util/CsvUtils";

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
