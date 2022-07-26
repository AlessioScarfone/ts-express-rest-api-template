import { Express } from "express";
import env from "../config/env";
import { nanoid } from "nanoid";
import monitor from 'express-status-monitor';
import monitorConfig from "../config/monitor.config";
import expressBasicAuth from "express-basic-auth";

const loadMonitorPage = (app: Express) => {
    if (env.monitor.enabled && env.monitor.user && env.monitor.page && env.monitor.password) {
        const statusMonitor = monitor(monitorConfig([
            {
                protocol: 'http',
                host: 'localhost',
                path: '/admin/health',
                port: env.port
            }
        ], ''));
        app.use((statusMonitor as any).middleware); // use the "middleware only" property to manage websockets

        const users: { [key: string]: string } = {
            [env.monitor.user]: env.monitor.password
        }

        const realm = nanoid();
        // console.log("STATUS PAGE - realm: " + realm);
        app.get(`/admin/${env.monitor.page}`, expressBasicAuth({
            users,
            challenge: true,
            realm
        }), (statusMonitor as any).pageRoute); // use the pageRoute property to serve the dashboard html page
        // app.use(monitor(monitorConfig(PORT, '/status')));
    } else {
        console.log("STATUS PAGE NOT INITIALIZED")
    }
}

export default loadMonitorPage;