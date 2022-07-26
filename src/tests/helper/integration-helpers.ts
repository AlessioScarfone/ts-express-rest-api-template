import * as express from 'express';
import createApp from '../../app';

export default class BootstrapHelpers {
    public static appInstance: express.Express;

    public static async getApp(): Promise<express.Application> {
        if (this.appInstance) {
            return this.appInstance;
        }
        const app = createApp();
        // await app.init();
        this.appInstance = app;
        return this.appInstance;
    }
}