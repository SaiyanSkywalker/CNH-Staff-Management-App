import request from 'supertest';
import express from 'express';
import unitRouter from 'server/src/api/routes/unit';
import UnitAttributes from '@shared/src/interfaces/UnitAttributes';

jest.mock('server/src/models/Unit', () => {
    const { UnitMock } = require('server/__mocks__/sequelize');
    return UnitMock;
});

const app = express();
app.use(express.json());
app.use('/unit', unitRouter);

let units: UnitAttributes[] = [
    {id: 1, laborLevelEntryId: 53040, name: 'ECMO', description: ''},
    {id: 2, laborLevelEntryId: 42125, name: 'CICU', description: ''},
    {id: 3, laborLevelEntryId: 42150, name: 'PICU', description: ''}
]

describe('GET /unit', () => {

    it('get all units', async () => {
        const response = await request(app)
        .get('/unit');
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(units);
    });

    it('get all models of specified unit', async () => {
        const response = await request(app)
        .get('/unit/2');
        expect(response.body).toStrictEqual([units[1]]);
    });

    it('get no units if unit id does not exist', async () => {
        const response = await request(app)
        .get('/unit/4');
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([]);
    });
});
