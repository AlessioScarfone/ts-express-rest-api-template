import 'jest';
import * as express from 'express';
import request from 'supertest';
import BootstrapHelpers from '../../tests/helper/integration-helpers';
import env from '../../config/env';

describe('Admin Router tests', () => {
    let app: express.Application;
    beforeAll(async () => {
        app = await BootstrapHelpers.getApp();
    });

    it('can get server health', async () => {
        const response = await request(app).get('/api/admin/health');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ok");
    });

    it('can open status page', async () => {
        // console.log(env.monitor);
        if (env.monitor.enabled && env.monitor.page && env.monitor.password && env.monitor.user) {
            const response = await request(app)
                .get(`/admin/${env.monitor.page}`)
                .auth(env.monitor.user, env.monitor.password);

            expect(response.statusCode).toBe(200);
        } else {
            console.log('TEST (can open status page): Status page not available');
        }
    })
});