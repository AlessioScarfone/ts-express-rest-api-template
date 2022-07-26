import 'jest';
import * as express from 'express';
import request from 'supertest';
import BootstrapHelpers from '../../tests/helper/integration-helpers';
import { STATUS_CODES } from 'http';

describe('admin healt tests', () => {
    let app: express.Application;
    beforeAll(async() => {
        app = await BootstrapHelpers.getApp();
    });

    it('can get server health', async () => {
        const response = await request(app).get('/admin/health');
        console.log(">>", response.statusCode)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ok");
    });
});