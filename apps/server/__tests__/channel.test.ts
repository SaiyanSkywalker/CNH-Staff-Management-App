import request from 'supertest';
import express from 'express';
import channelRouter from 'server/src/api/routes/channel';
import ChannelAttributes from '@shared/src/interfaces/ChannelAttributes';

// Override the original models with mocks
jest.mock('server/src/models/Channel', () => {
    const { ChannelMock } = require('server/__mocks__/sequelize');
    return ChannelMock;
});

jest.mock('server/src/models/Announcement', () => {
    const { AnnouncementMock } = require('server/__mocks__/sequelize');
    return AnnouncementMock;
});

jest.mock('server/src/models/UserInformation', () => {
    const { UserInformationMock } = require('server/__mocks__/sequelize');
    return UserInformationMock;
});

const app = express();
app.use(express.json());
app.use('/channel', channelRouter);

describe('GET /channel', () => {

    it('get channel with non-numeric id', async () => {
        const response = await request(app)
        .get('/channel/abc')
        .set('unitid', '1')
        .set('roleid', '2');
        expect(response.status).toBe(400);
    });

    it('should return unauthorized if no role is defined', async () => {
        const response = await request(app)
        .get('/channel')
        .set('unitid', '2');
        expect(response.status).toBe(401);
    });

    it('should return error if unit is not numeric', async () => {
        const response = await request(app)
        .get('/channel')
        .set('unitid', 'da35j')
        .set('roleid', '2');
        expect(response.status).toBe(401);
    });

    it('should return error if unit is not numeric', async () => {
        const response = await request(app)
        .get('/channel')
        .set('unitid', '3')
        .set('roleid', 'da35j');
        expect(response.status).toBe(401);
    });


    it('should return all rooms for an Admin', async () => {
        const response = await request(app)
        .get('/channel')
        .set('unitid', '2')
        .set('roleid', '2');
        let expectedChannels: ChannelAttributes[] = [
            {
                id: 10,
                name: 'Non-undefined channel',
                unitRoomId: null
            },
            {
                id: 20,
                name: 'Two Non-undefined channel',
                unitRoomId: null
            },
            {
                id: 30,
                name: 'Unit Channel',
                unitRoomId: 3
            },
            {
                id: 40,
                name: 'Unit Two Channel',
                unitRoomId: 4
            }
        ];
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedChannels);
    });

    it('should return all rooms for an Admin with no unit', async () => {
        const response = await request(app)
        .get('/channel')
        .set('roleid', '2');
        let expectedChannels: ChannelAttributes[] = [
            {
                id: 10,
                name: 'Non-undefined channel',
                unitRoomId: null
            },
            {
                id: 20,
                name: 'Two Non-undefined channel',
                unitRoomId: null
            },
            {
                id: 30,
                name: 'Unit Channel',
                unitRoomId: 3
            },
            {
                id: 40,
                name: 'Unit Two Channel',
                unitRoomId: 4
            }
        ];
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedChannels);
    });
    
    it('should return room corresponding to all non-unit channels and no unit channels for employee with a unit which no channel exists for', async () => {
        const response = await request(app)
        .get('/channel')
        .set('unitid', '2')
        .set('roleid', '3');
        let expectedChannels: ChannelAttributes[] = [
            {
                id: 10,
                name: 'Non-undefined channel',
                unitRoomId: null
            },
            {
                id: 20,
                name: 'Two Non-undefined channel',
                unitRoomId: null
            }
        ];
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedChannels);
    });
    
    it('should return room corresponding to unit of employee and all other non-unit channels', async () => {
        const response = await request(app)
        .get('/channel')
        .set('unitid', '4')
        .set('roleid', '3');
        let expectedChannels: ChannelAttributes[] = [
            {
                id: 40,
                name: 'Unit Two Channel',
                unitRoomId: 4
            },
            {
                id: 10,
                name: 'Non-undefined channel',
                unitRoomId: null
            },
            {
                id: 20,
                name: 'Two Non-undefined channel',
                unitRoomId: null
            }
        ];
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedChannels);
    });

    it('should return room corresponding to all non-unit channels and no unit channels for nurse manager with a unit which no channel exists for', async () => {
        const response = await request(app)
        .get('/channel')
        .set('unitid', '1')
        .set('roleid', '3');
        let expectedChannels: ChannelAttributes[] = [
            {
                id: 10,
                name: 'Non-undefined channel',
                unitRoomId: null
            },
            {
                id: 20,
                name: 'Two Non-undefined channel',
                unitRoomId: null
            }
        ];
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedChannels);
    });
    
    it('should return room corresponding to unit of nurse manager and all other non-unit channels', async () => {
        const response = await request(app)
        .get('/channel')
        .set('unitid', '3')
        .set('roleid', '3');
        let expectedChannels: ChannelAttributes[] = [
            {
                id: 30,
                name: 'Unit Channel',
                unitRoomId: 3
            },
            {
                id: 10,
                name: 'Non-undefined channel',
                unitRoomId: null
            },
            {
                id: 20,
                name: 'Two Non-undefined channel',
                unitRoomId: null
            }
        ];
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(expectedChannels);
    });

    it('get channel for an employee looking for a non-unit channel', async() => {
        const response = await request(app)
        .get('/channel/2')
        .set('unitid', '1')
        .set('roleid', '1');
        expect(response.status).toBe(200);
    })

    it('get channel for an employee looking for a channel for their unit', async() => {
        const response = await request(app)
        .get('/channel/1')
        .set('unitid', '1')
        .set('roleid', '1');
        expect(response.status).toBe(200);
    })

    it('get channel for an employee looking for a channel for a unit they do not belong to', async() => {
        const response = await request(app)
        .get('/channel/3')
        .set('unitid', '1')
        .set('roleid', '1');
        expect(response.status).toBe(401);
    })

    it('get channel for a nurse manager looking for a non-unit channel', async() => {
        const response = await request(app)
        .get('/channel/2')
        .set('unitid', '1')
        .set('roleid', '3');
        expect(response.status).toBe(200);
    })

    it('get channel for a nurse manager looking for a channel for their unit', async() => {
        const response = await request(app)
        .get('/channel/1')
        .set('unitid', '1')
        .set('roleid', '3');
        expect(response.status).toBe(200);
    })

    it('get channel for a nurse manager looking for a channel for a unit they do not belong to', async() => {
        const response = await request(app)
        .get('/channel/3')
        .set('unitid', '1')
        .set('roleid', '3');
        expect(response.status).toBe(401);
    })

    it('get channel with id that does not exist', async () => {
        const response = await request(app)
        .get('/channel/45')
        .set('roleid', '2');
        expect(response.status).toBe(400);
    });

});


describe('POST /channel', () => {
    it('should create a channel that does not exist', async () => {
        const body = {
            name: 'nonExistingUser'
        };
        const response = await request(app)
        .post('/channel')
        .send(body);
        expect(response.status).toBe(201);
    });

    it('should not create a channel that does exist', async () => {
        const body = {
            name: 'existingRoom'
        };
        const response = await request(app)
        .post('/channel')
        .send(body);
        expect(response.status).toBe(400);
    });

    it('error should be raised when name is not provided', async () => {
        const response = await request(app)
        .post('/channel');
        expect(response.status).toBe(400);
    });
});
