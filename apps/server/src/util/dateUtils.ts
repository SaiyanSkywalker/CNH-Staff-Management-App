/**
 * File: dateUtils.ts
 * Purpose: contains utility functions that help with performing operations
 * involving dates and date strings
 */

/**
 * Used to build string representing duration (in hours and minutes)
 * between two times
 * @param interval time interval in the format  `startTime-endTime`
 * @returns
 */
export const calculateDuration = (interval: string[]): string => {
  // Parse interval to make start and end times
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

  // Account for shifts that go into the next day
  if (end.getTime() < start.getTime()) {
    end = new Date(end.setDate(end.getDate() + 1));
  }

  // Get the duration of time between shifts
  const duration = end.getTime() - start.getTime();
  const hourInMilliseconds = 1000 * 60 * 60;
  const hours = Math.floor(duration / hourInMilliseconds);
  const minutes = Math.floor((duration % hourInMilliseconds) / 60);
  const hourString = `${hours < 10 ? `0${hours}` : hours}`;
  const minuteString = `${
    minutes < 10 ? `0${minutes}` : String(minutes).slice(0, 2)
  }`;
  return `${hourString}:${minuteString}`;
};
