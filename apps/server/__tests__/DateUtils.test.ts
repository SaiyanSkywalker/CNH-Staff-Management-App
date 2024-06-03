import { calculateDuration } from "server/src/util/dateUtils";


test("calculates duration properly", () => {
  const timeInterval = ["12:00", "19:00"];
  expect(calculateDuration(timeInterval)).toBe("07:00");
});

test("calculates duration for next day", () => {
  const timeInterval = ["23:00", "07:00"];
  expect(calculateDuration(timeInterval)).toBe("08:00");
});

test("calculates duration for 10 hour or greater interval", () => {
  const timeInterval = ["23:00", "15:00"];
  expect(calculateDuration(timeInterval)).toBe("16:00");
});

test("calculates duration for 10 minute or greater interval", () => {
  const timeInterval = ["23:00", "15:30"];
  expect(calculateDuration(timeInterval)).toBe("16:30");
});
