import request from 'supertest';
import express from 'express';
import fileUpload from 'express-fileupload';
import CNHSocket from "@shared/src/interfaces/CNHSocket";
import { Server, Socket } from "socket.io";
import scheduleRouter from 'server/src/api/routes/schedule';
import path from 'path';

jest.mock('server/src/models/ScheduleEntry', () => {
    const { ScheduleEntryMock } = require('server/__mocks__/sequelize');
    return ScheduleEntryMock;
});

jest.mock('server/src/models/Unit', () => {
    const { UnitMock } = require('server/__mocks__/sequelize');
    return UnitMock;
});

jest.mock('server/src/models/UserInformation', () => {
    const { UserInformationMock } = require('server/__mocks__/sequelize');
    return UserInformationMock;
});

jest.mock('server/src/sockets/socketHandler', () => {
    const mobileSocketMapMock = new Map<string, Map<string, CNHSocket>>();
    const adminSocketMapMock = new Map<string, Map<string, CNHSocket>>();
    const socketHandlerMock = (io: Server, socket: CNHSocket) => {}
    return {adminSocketMap: adminSocketMapMock, mobileSocketMap: mobileSocketMapMock, socketHandler: socketHandlerMock}
});

const app = express();
app.use(fileUpload());
app.use('/schedule', scheduleRouter);

describe('POST /schedule', () => {
    
    it('empty body in post request', async () => {
        const response = await request(app)
        .post('/schedule');
        expect(response.status).toBe(400);
    });

    it('no files paramter in post request', async () => {
        const response = await request(app)
        .post('/schedule');
        expect(response.status).toBe(400);
    });

    it('no schedule paramater in req.files post request', async () => {
        const response = await request(app)
        .post('/schedule')
        .attach('edhjek', '');
        expect(response.status).toBe(400);
    });

    fit('non-csv file req.files.schedule in post request', async () => {
        const filePath = path.join(__dirname, '../__files__/kronos_export_mock.txt');
        console.log(`filePath is ${filePath}`);
        const response = await request(app)
        .post('/schedule')
        .attach('schedule', filePath)
        .field('username', 'testuser');
        expect(response.status).toBe(400);
    });

    it('empty csv file req.files.schedule in post request', async () => {
        const response = await request(app)
        .post('/schedule');
        expect(response.status).toBe(400);
    });

    it('csv file with invalid headers in req.files.schedule in post request', async () => {
        const response = await request(app)
        .post('/schedule');
        expect(response.status).toBe(400);
    });

    it('upload invalid data types in csv file in post request', async () => {
        const response = await request(app)
        .post('/schedule');
        expect(response.status).toBe(400);
    });

});

describe('/GET schedule', () => {
    it('no query parameters in get request', async () => {

    });
    it('query costCenterId in get request', async () => {

    });
    it('non-numeric costCenterId in get request', async () => {

    });

    it('numeric costCenterId in get request', async () => {

    });
    it('get schedule with nonexistent id', async () => {

    });
    it('get schedule with nonexisting username', async () => {

    });
    it('get schedule with valid username', async () => {

    });
    it('get schedule with no query parameters', async () => {

    });
    it('get schedule with invalid unit query parameter', async () => {

    });
    it('get schedule with valid unit query parameter', async () => {

    });
});
