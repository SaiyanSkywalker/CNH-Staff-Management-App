import request from "supertest";
import express from "express";
import shiftCapacityRouter from "server/src/api/routes/shift-capacity";
import ShiftCapacityRequest from "@shared/src/interfaces/ShiftCapacityRequest";

jest.mock("server/src/models/ShiftCapacity", () => {
  const { ShiftCapacityMock } = require("server/__mocks__/sequelize");
  return ShiftCapacityMock;
});

jest.mock("server/src/models/DefaultCapacity", () => {
  const { DefaultCapacityMock } = require("server/__mocks__/sequelize");
  return DefaultCapacityMock;
});

jest.mock("server/src/models/Unit", () => {
  const { UnitMock } = require("server/__mocks__/sequelize");
  return UnitMock;
});

const app = express();
app.use(express.json());
app.use("/shift-capacity", shiftCapacityRouter);

describe("POST /shift-capacity", () => {
  it("empty body in POST request", async () => {
    const response = await request(app).post("/shift-capacity");
    expect(response.status).toBe(400);
  });

  it("post request with incorrect body types", async () => {
    const defaultCapacity = {
      shiftDate: "2024-05-28",
      shiftTime: "15:00 - 19:00",
      capacities: "30",
      isDefault: 1,
    };
    const response = await request(app)
      .post("/shift-capacity")
      .send(defaultCapacity);
    expect(response.status).toEqual(400);
    expect(response.body.msg).toStrictEqual(
      "shiftTime property in request's body should be a string and capacities should be an object of keys of type strings and values of type number"
    );
  });

  describe("Posting a default capacity", () => {
    it("post a default capacity for a four hour shift", async () => {
      const defaultCapacity: ShiftCapacityRequest = {
        shiftDate: "2024-05-28",
        shiftTime: "15:00 - 19:00",
        capacities: { "1": 20 },
        isDefault: true,
      };
      const response = await request(app)
        .post("/shift-capacity")
        .send(defaultCapacity);
      expect(response.status).toEqual(200);
      expect(response.body.updatedShifts).toStrictEqual([
        { id: 1, unitId: 1, shift: "15:00 - 19:00", capacity: 20 },
      ]);
    });

    it("post a default capacity for an overnight shift", async () => {
      const defaultCapacity: ShiftCapacityRequest = {
        shiftDate: "2024-05-28",
        shiftTime: "15:00 - 07:00",
        capacities: { "1": 20 },
        isDefault: true,
      };
      const response = await request(app)
        .post("/shift-capacity")
        .send(defaultCapacity);
      expect(response.status).toEqual(200);
      expect(response.body.updatedShifts).toStrictEqual([
        { id: 1, unitId: 1, shift: "15:00 - 19:00", capacity: 20 },
        { id: 2, unitId: 1, shift: "19:00 - 23:00", capacity: 20 },
        { id: 3, unitId: 1, shift: "23:00 - 03:00", capacity: 20 },
        { id: 4, unitId: 1, shift: "03:00 - 07:00", capacity: 20 },
        { id: 5, unitId: 1, shift: "15:00 - 07:00", capacity: 20 },
      ]);
    });

    it("post a non-existent capacity", async () => {
      const defaultCapacity: ShiftCapacityRequest = {
        shiftDate: "2024-05-28",
        shiftTime: "03:00 - 07:00",
        capacities: { "3": 30 },
        isDefault: true,
      };
      const response = await request(app)
        .post("/shift-capacity")
        .send(defaultCapacity);
      expect(response.status).toBe(200);
      expect(response.body.updatedShifts).toStrictEqual([
        { id: 1, unitId: 3, shift: "03:00 - 07:00", capacity: 30 },
      ]);
    });
  });

  describe("Posting a shift capacity", () => {
    it("post a non-existent shift capacity", async () => {
      const shiftCapacity: ShiftCapacityRequest = {
        shiftDate: "2024-05-28",
        shiftTime: "03:00 - 07:00",
        capacities: { "3": 30 },
        isDefault: false,
      };
      const response = await request(app)
        .post("/shift-capacity")
        .send(shiftCapacity);
      expect(response.status).toBe(200);
      expect(response.body.updatedShifts).toStrictEqual([
        {
          id: 1,
          unitId: 3,
          shift: "03:00 - 07:00",
          capacity: 30,
          shiftDate: "2024-05-28",
        },
      ]);
    });

    it("post an existing shift capacity", async () => {
      const shiftCapacity: ShiftCapacityRequest = {
        shiftDate: "2024-05-28",
        shiftTime: "03:00 - 07:00",
        capacities: { "1": 40 },
        isDefault: false,
      };
      const response = await request(app)
        .post("/shift-capacity")
        .send(shiftCapacity);
      expect(response.status).toBe(200);
      expect(response.body.updatedShifts).toStrictEqual([
        {
          id: 2,
          unitId: 1,
          shift: "03:00 - 07:00",
          capacity: 40,
          shiftDate: "2024-05-28",
        },
      ]);
    });

    it("post shift capacity for multiple existing units", async () => {
      const shiftCapacity: ShiftCapacityRequest = {
        shiftDate: "2024-05-28",
        shiftTime: "03:00 - 07:00",
        capacities: { "1": 40, "2": 40 },
        isDefault: false,
      };
      const response = await request(app)
        .post("/shift-capacity")
        .send(shiftCapacity);
      expect(response.status).toBe(200);
      expect(response.body.updatedShifts).toStrictEqual([
        {
          id: 2,
          unitId: 1,
          shift: "03:00 - 07:00",
          capacity: 40,
          shiftDate: "2024-05-28",
        },
        {
          id: 4,
          unitId: 2,
          shift: "03:00 - 07:00",
          capacity: 40,
          shiftDate: "2024-05-28",
        },
      ]);
    });
  });

  it("post request with no corresponding id", async () => {
    const shiftCapacity = {
      shiftDate: "2024-05-28",
      capacities: { "1": 40, "2": 40 },
      isDefault: true,
    };
    const response = await request(app)
      .post("/shift-capacity")
      .send(shiftCapacity);
    expect(response.status).toBe(400);
    expect(response.body.msg).toStrictEqual(
      "Need a shift time and capacity configured for at least one unit!"
    );
  });

  it("post shift where next day is beginning of next month", async () => {
    const shiftCapacity: ShiftCapacityRequest = {
      shiftDate: "2024-04-30",
      shiftTime: "23:00 - 07:00",
      capacities: { "1": 50, "2": 50 },
      isDefault: false,
    };
    const response = await request(app)
      .post("/shift-capacity")
      .send(shiftCapacity);
    expect(response.status).toBe(200);
    expect(response.body.updatedShifts[0].shiftDate).toStrictEqual(
      "2024-04-30"
    );
    expect(response.body.updatedShifts[1].shiftDate).toStrictEqual(
      "2024-05-01"
    );
  });

  it("post shift where next day is beginning of next year", async () => {
    const shiftCapacity: ShiftCapacityRequest = {
      shiftDate: "2024-12-31",
      shiftTime: "23:00 - 07:00",
      capacities: { "1": 50, "2": 50 },
      isDefault: false,
    };
    const response = await request(app)
      .post("/shift-capacity")
      .send(shiftCapacity);
    expect(response.status).toBe(200);
    expect(response.body.updatedShifts[0].shiftDate).toStrictEqual(
      "2024-12-31"
    );
    expect(response.body.updatedShifts[1].shiftDate).toStrictEqual(
      "2025-01-01"
    );
  });
});

describe("GET /shift-capacity/admin", () => {
  it("get a shift capacity from admin site", async () => {
    const response = await request(app).get("/shift-capacity/admin");
    expect(response.status).toEqual(200);
  });
});

describe("GET /shift-capacity/mobile", () => {
  it("get a shift capacity from mobile site without costCenterId", async () => {
    const response = await request(app).get(
      "/shift-capacity/mobile?date=2024-05-28"
    );
    expect(response.status).toEqual(400);
    expect(response.body.msg).toEqual(
      "costCenterId should be a valid integer, and date should be a string in format: 'YYYY-MM-DD'"
    );
  });

  it("get a shift capacity from mobile site without date", async () => {
    const response = await request(app).get(
      "/shift-capacity/mobile?costCenterId=1"
    );
    expect(response.status).toEqual(400);
    expect(response.body.msg).toEqual(
      "costCenterId should be a valid integer, and date should be a string in format: 'YYYY-MM-DD'"
    );
  });

  it("get a shift capacity from mobile site with valid query parameters", async () => {
    const response = await request(app).get(
      "/shift-capacity/mobile?costCenterId=1&date=2024-05-28"
    );
    expect(response.status).toEqual(200);
  });
});
