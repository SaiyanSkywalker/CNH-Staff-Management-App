import request from "supertest";
import express from "express";
import loginRouter from "server/src/api/routes/login";

jest.mock("server/src/models/UserInformation", () => {
  const { UserInformationMock } = require("server/__mocks__/sequelize");
  return UserInformationMock;
});

jest.mock("server/src/models/Role", () => {
  const { RoleMock } = require("server/__mocks__/sequelize");
  return RoleMock;
});

jest.mock("server/src/models/Unit", () => {
  const { UnitMock } = require("server/__mocks__/sequelize");
  return UnitMock;
});

jest.mock("server/src/loaders/dbLoader", () => {
  const { sequelizeMock } = require("server/__mocks__/sequelize");
  return { __esModule: true, sequelize: sequelizeMock };
});

const app = express();
app.use(express.json());
app.use("/login", loginRouter);

describe("POST /login", () => {
  it("empty body in post request", async () => {
    const response = await request(app).post("/login");
    expect(response.status).toBe(400);
  });

  it("post request with missing username", async () => {
    const body = {
      isMobile: "1",
      password: "1234",
    };
    const response = await request(app).post("/login").send(body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Request body does not contain all required params (username, password, isMobile)"
    );
  });

  it("post request with missing password", async () => {
    const body = {
      isMobile: "1",
      username: "fa484",
    };
    const response = await request(app).post("/login").send(body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Request body does not contain all required params (username, password, isMobile)"
    );
  });

  it("post request with missing isMobile parameter", async () => {
    const body = {
      username: "fa484",
      password: "5678",
    };
    const response = await request(app).post("/login").send(body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Request body does not contain all required params (username, password, isMobile)"
    );
  });

  it("post request from user that doesn't exist", async () => {
    const body = {
      username: "fa484",
      password: "5678",
      isMobile: "1",
    };
    const response = await request(app).post("/login").send(body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
  });
  it("post request from user that does exist", async () => {
    const body = {
      username: "firstUser",
      password: "1234",
      isMobile: "1",
    };
    const expectedResponse = {
      employeeId: 1,
      username: "firstUser",
      firstName: "First",
      lastName: "User",
      password: "1234",
      get: jest.fn().mockResolvedValue(this),
    };
    const response = await request(app).post("/login").send(body);
    expect(response.status).toBe(200);
  });
});
