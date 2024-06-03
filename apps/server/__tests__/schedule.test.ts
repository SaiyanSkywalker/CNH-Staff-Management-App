import request from "supertest";
import express from "express";
import fileUpload from "express-fileupload";
import CNHSocket from "@shared/src/interfaces/CNHSocket";
import { Server, Socket } from "socket.io";
import scheduleRouter from "server/src/api/routes/schedule";
import path from "path";

jest.mock("server/src/models/ScheduleEntry", () => {
  const { ScheduleEntryMock } = require("server/__mocks__/sequelize");
  return ScheduleEntryMock;
});

jest.mock("server/src/models/Unit", () => {
  const { UnitMock } = require("server/__mocks__/sequelize");
  return UnitMock;
});

jest.mock("server/src/models/UserInformation", () => {
  const { UserInformationMock } = require("server/__mocks__/sequelize");
  return UserInformationMock;
});

jest.mock("server/src/sockets/socketHandler", () => {
  const mobileSocketMapMock = new Map<string, Map<string, CNHSocket>>();
  const adminSocketMapMock = new Map<string, Map<string, CNHSocket>>();
  const socketHandlerMock = (io: Server, socket: CNHSocket) => {};
  return {
    adminSocketMap: adminSocketMapMock,
    mobileSocketMap: mobileSocketMapMock,
    socketHandler: socketHandlerMock,
  };
});

const app = express();
app.use(fileUpload());
app.use("/schedule", scheduleRouter);

describe("POST /schedule", () => {
  it("empty body in post request", async () => {
    const response = await request(app).post("/schedule");
    expect(response.status).toBe(400);
  });

  it("no files paramter in post request", async () => {
    const response = await request(app).post("/schedule");
    expect(response.status).toBe(400);
  });

  it("no schedule paramater in req.files post request", async () => {
    const response = await request(app).post("/schedule").attach("edhjek", "");
    expect(response.status).toBe(400);
  });

  it("non-csv file req.files.schedule in post request", async () => {
    const filePath = path.join(
      __dirname,
      "../__files__/kronos_export_mock.txt"
    );
    const response = await request(app)
      .post("/schedule")
      .attach("schedule", filePath)
      .field("username", "testuser");
    expect(response.status).toBe(400);
  });

  it("empty csv file req.files.schedule in post request", async () => {
    const filePath = path.join(
      __dirname,
      "../__files__/kronos_export_mock_empty.csv"
    );
    const response = await request(app)
      .post("/schedule")
      .attach("schedule", filePath)
      .field("username", "testuser");
    expect(response.status).toBe(400);
  });

  it("csv file with invalid headers in req.files.schedule in post request", async () => {
    const filePath = path.join(
      __dirname,
      "../__files__/kronos_export_mock_invalid_headers.csv"
    );
    const response = await request(app)
      .post("/schedule")
      .attach("schedule", filePath)
      .field("username", "testuser");
    expect(response.status).toBe(400);
  });

  it("upload invalid data types in csv file in post request", async () => {
    const filePath = path.join(
      __dirname,
      "../__files__/kronos_export_mock_invalid_data.csv"
    );
    const response = await request(app)
      .post("/schedule")
      .attach("schedule", filePath)
      .field("username", "testuser");
    expect(response.status).toBe(400);
    expect(response.body.error).toStrictEqual("Make sure Personnum, Shift Date, q, Worked Costs Center are all numeric");
  });
});

describe("/GET schedule", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("no query parameters in get request", async () => {
    const response = await request(app).get("/schedule");
    expect(response.status).toBe(200);
  });
  
  it("non-numeric costCenterId in get request", async () => {
    const response = await request(app).get("/schedule?costCenterId=3frq");
    expect(response.status).toBe(400);
    expect(response.body.err).toStrictEqual("costCenterId needs to be numeric if included");
  });
  
  it("get schedule with nonexistent id", async () => {
    const response = await request(app).get("/schedule?costCenterId=45");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({});
  });
  
  it("get schedule with nonexisting username", async () => {
    const response = await request(app).get("/schedule/asdf");
    expect(response.status).toBe(400);
    expect(response.body.err).toStrictEqual("User does not exist!");
  });
    
  it("get schedule with invalid costCenterId query parameter on unit route", async () => {
    console.log("Right here!");
    const response = await request(app).get("/schedule/unit?costCenterId=45");
    expect(response.status).toBe(400);
    expect(response.body.err).toStrictEqual("Unit does not exist!");
  });
  
});
