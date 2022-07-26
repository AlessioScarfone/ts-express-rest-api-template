import 'jest';
import * as express from 'express';
import request from 'supertest';
import BootstrapHelpers from '../../tests/helper/integration-helpers';

describe('admin healt tests', () => {
    let app: express.Application;
    beforeAll(async() => {
        app = await BootstrapHelpers.getApp();
    });

    it('can get server health', async () => {
        const response = await request(app).get('/admin/health');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ok");
    });
});