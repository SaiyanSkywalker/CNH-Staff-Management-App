import { calculateDuration } from "server/src/util/dateUtils";

// This test is fialing right now, but that's fine
// just wanted to make sure that it ran properly
test("calculates duration properly", () => {
  const timeInterval = ["12:00", "19:00"];
  expect(calculateDuration(timeInterval)).toBe("07:00");
});
