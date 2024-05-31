import request from 'supertest';
import express from 'express';
import loginRouter from 'server/src/api/routes/login';

jest.mock('server/src/models/UserInformation', () => {
    const { UserInformationMock } = require('server/__mocks__/sequelize');
    return UserInformationMock;
});

jest.mock('server/src/models/Role', () => {
    const { RoleMock } = require('server/__mocks__/sequelize');
    return RoleMock;
});

jest.mock('server/src/models/Unit', () => {
    const { UnitMock } = require('server/__mocks__/sequelize');
    return UnitMock;
});

jest.mock('server/src/models/Channel', () => {
    const { ChannelMock } = require('server/__mocks__/sequelize');
    return ChannelMock;
});

const app = express();
app.use(express.json());
app.use('/login', loginRouter);

describe('POST /login', () => {
    it('empty body in post request', async () => {
        const response = await request(app)
        .post('/login');
        expect(response.status).toBe(400);
    });

    fit('post request from mobile user', async () => {
        const body = {
            isMobile: "1"
        }
        const response = await request(app)
        .post('/login')
        .send(body);
        expect(response.status).toBe(400);
    });
})