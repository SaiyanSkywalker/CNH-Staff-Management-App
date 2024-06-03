import request from "supertest";
import express from "express";
import shiftHistoryRouter from "server/src/api/routes/shift-history";

jest.mock("server/src/models/ShiftHistory", () => {
  const { ShiftHistoryMock } = require("server/__mocks__/sequelize");
  return ShiftHistoryMock;
});

jest.mock("server/src/models/Unit", () => {
  const { UnitMock } = require("server/__mocks__/sequelize");
  return UnitMock;
});

jest.mock("server/src/models/UserInformation", () => {
  const { UserInformationMock } = require("server/__mocks__/sequelize");
  return UserInformationMock;
});

const app = express();
app.use(express.json());
app.use("/shift-history", shiftHistoryRouter);

const employeeId1: number = 1;
const employeeId2: number = 2;
const employeeId3: number = 3;
const employeeId4: number = 4;

const employeeName1: string = "First User";
const employeeName2: string = "Second User";
const employeeName3: string = "Third User";
const employeeName4: string = "Fourth User";

const unit1: string = "ECMO";
const unit3: string = "NICU";

const shiftHistory1 = {
  id: 1,
  shift: "07:00 - 11:00",
  status: "Accepted",
  employeeId: employeeId1,
  employeeName: employeeName1,
  unit: unit1,
  dateRequested: "04/30/2024",
  createdAt: "04/30/2024",
};
const shiftHistory2 = {
  id: 2,
  shift: "07:00 - 11:00",
  status: "Rejected",
  employeeId: employeeId2,
  employeeName: employeeName2,
  unit: unit1,
  dateRequested: "05/10/2024",
  createdAt: "05/02/2024",
};
const shiftHistory3 = {
  id: 3,
  shift: "15:00 - 19:00",
  status: "Accepted",
  employeeId: employeeId3,
  employeeName: employeeName3,
  unit: unit3,
  dateRequested: "05/11/2024",
  createdAt: "05/03/2024",
};
const shiftHistory4 = {
  id: 4,
  shift: "15:00 - 19:00",
  status: "Pending",
  employeeId: employeeId1,
  employeeName: employeeName1,
  unit: unit1,
  dateRequested: "05/11/2024",
  createdAt: "05/03/2024",
};
const shiftHistory5 = {
  id: 5,
  shift: "19:00 - 23:00",
  status: "Accepted",
  employeeId: employeeId3,
  employeeName: employeeName3,
  unit: unit3,
  dateRequested: "05/11/2024",
  createdAt: "05/03/2024",
};
const shiftHistory6 = {
  id: 6,
  shift: "19:00 - 23:00",
  status: "Rejected",
  employeeId: employeeId2,
  employeeName: employeeName2,
  unit: unit1,
  dateRequested: "05/11/2024",
  createdAt: "05/03/2024",
};
const shiftHistory7 = {
  id: 7,
  shift: "23:00 - 03:00",
  status: "Accepted",
  employeeId: employeeId3,
  employeeName: employeeName3,
  unit: unit3,
  dateRequested: "05/12/2024",
  createdAt: "05/04/2024",
};
const shiftHistory8 = {
  id: 8,
  shift: "23:00 - 03:00",
  status: "Accepted",
  employeeId: employeeId4,
  employeeName: employeeName4,
  unit: unit3,
  dateRequested: "05/12/2024",
  createdAt: "05/04/2024",
};
const shiftHistory9 = {
  id: 9,
  shift: "15:00 - 19:00",
  status: "Pending",
  employeeId: employeeId4,
  employeeName: employeeName4,
  unit: unit3,
  dateRequested: "05/12/2024",
  createdAt: "05/05/2024",
};
let shiftHistories = [
  shiftHistory1,
  shiftHistory2,
  shiftHistory3,
  shiftHistory4,
  shiftHistory5,
  shiftHistory6,
  shiftHistory7,
  shiftHistory8,
  shiftHistory9,
];

describe("GET /shift-history", () => {
  it("route with no query parameters", async () => {
    const response = await request(app).get("/shift-history");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(shiftHistories);
  });

  it("route with employeeId query parameter", async () => {
    const response = await request(app).get("/shift-history?employeeId=1");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter((shiftHistory) => shiftHistory.employeeId === 1)
    );
  });

  it("route with employeeName query parameter", async () => {
    const response = await request(app).get(
      "/shift-history?employeeName=First User"
    );
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter(
        (shiftHistory) => shiftHistory.employeeName === "First User"
      )
    );
  });

  it("route with shift query parameter", async () => {
    const response = await request(app).get(
      "/shift-history?shift=07:00 - 11:00"
    );
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter(
        (shiftHistory) => shiftHistory.shift === "07:00 - 11:00"
      )
    );
  });

  it("route with status query parameter", async () => {
    const response = await request(app).get("/shift-history?status=Pending");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter((shiftHistory) => shiftHistory.status === "Pending")
    );
  });

  it("route with requestedDate date query parameter", async () => {
    const response = await request(app).get(
      "/shift-history?requestedDate=2024-05-11"
    );
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter(
        (shiftHistory) => shiftHistory.createdAt === "05/11/2024"
      )
    );
  });

  it("route with shiftDate query parameter", async () => {
    const response = await request(app).get(
      "/shift-history?shiftDate=2024-05-03"
    );
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter(
        (shiftHistory) => shiftHistory.dateRequested === "2024-05-03"
      )
    );
  });

  it("route with unit query parameter", async () => {
    const response = await request(app).get("/shift-history?unit=ECMO");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter((shiftHistory) => shiftHistory.unit === "ECMO")
    );
  });

  it("route with multiple query parameters", async () => {
    const response = await request(app).get(
      "/shift-history?employeeName=First User&shift=07:00 - 11:00"
    );
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter(
        (shiftHistory) =>
          shiftHistory.employeeName === "First User" &&
          shiftHistory.shift === "07:00 - 11:00"
      )
    );
  });

  it("route with all query parameters", async () => {
    const response = await request(app).get(
      "/shift-history?employeeId=1&employeeName=First User&shift=07:00 - 11:00&status=Accepted&unit=ECMO&requestedDate=2024-04-30&shiftDate=2024-04-30"
    );
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(
      shiftHistories.filter(
        (shiftHistory) =>
          shiftHistory.employeeName === "First User" &&
          shiftHistory.shift === "07:00 - 11:00" &&
          shiftHistory.employeeId === 1 &&
          shiftHistory.status === "Accepted" &&
          shiftHistory.unit === "ECMO" &&
          shiftHistory.dateRequested === "04/30/2024" &&
          shiftHistory.createdAt === "04/30/2024"
      )
    );
  });
});
