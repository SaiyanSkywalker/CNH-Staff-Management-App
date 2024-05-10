/**
 * Used to build string representing duration (in hours and minutes)
 * between two times
 * @param interval time interval in the format  `startTime-endTime`
 * @returns
 */
export const calculateDuration = (interval: string[]): string => {
  console.log(interval);
  const start: Date = new Date();
  const startTokens: number[] = interval[0]
    .split(":")
    .map((x: string) => Number(x.trim()));
  start.setHours(startTokens[0]);
  start.setMinutes(startTokens[1]);

  let end: Date = new Date();
  const endTokens: number[] = interval[1]
    .split(":")
    .map((x: string) => Number(x.trim()));
  end.setHours(endTokens[0]);
  end.setMinutes(endTokens[1]);

  if (end.getTime() < start.getTime()) {
    end = new Date(end.setDate(end.getDate() + 1));
  }
  const duration = end.getTime() - start.getTime();
  const hourInMilliseconds = 1000 * 60 * 60;
  const hours = Math.floor(duration / hourInMilliseconds);
  const minutes = (duration % hourInMilliseconds) / 60;
  const hourString = `${hours < 10 ? `0${hours}` : hours}`;
  const minuteString = `${minutes < 10 ? `0${minutes}` : minutes}`;
  return `${hourString}:${minuteString}`;
};
