import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import * as Routers from "./routes";
import requestIDMiddleware from "./middlewares/request-id.middleware";
import monitor from 'express-status-monitor';
import monitorConfig from "./config/monitor.config";
import expressBasicAuth from "express-basic-auth";
import { nanoid } from "nanoid";

const NODE_ENV = process.env.NODE_ENV || "production";
const PORT = process.env.PORT || 8080;
const STATUS_PAGE = process.env.STATUS_PAGE;
const STATUS_PAGE_PWD = process.env.STATUS_PAGE_PWD;
const STATUS_PAGE_USER = process.env.STATUS_PAGE_USER;

const initHelmetMiddleware = (app: Express): Express => {
    //https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#security-headers
    app.use(helmet.contentSecurityPolicy({ //sets the Content-Security-Policy header which helps mitigate cross-site scripting attacks
        useDefaults: true,
        directives: {
            frameAncestors: 'none'
        }
    }));
    app.use(helmet.hidePoweredBy()); //removes the X-Powered-By header, which is set by default in some frameworks (like Express)
    app.use(helmet.hsts());          //sets the Strict-Transport-Security header which tells browsers to prefer HTTPS over insecure HTTP
    app.use(helmet.expectCt());      //sets the Expect-CT header which helps mitigate misissued SSL certificates
    app.use(helmet.noSniff());       //sets the X-Content-Type-Options header to nosniff. This mitigates MIME type sniffing which can cause security vulnerabilities.
    app.use(helmet.frameguard({ action: "deny" })); //sets the X-Frame-Options header to help you mitigate clickjacking attacks
    return app;
}

const initMonitorPage = (app: Express) => {
    if (STATUS_PAGE_USER && STATUS_PAGE_PWD && STATUS_PAGE) {
        const statusMonitor = monitor(monitorConfig([
            {
                protocol: 'http',
                host: 'localhost',
                path: '/admin/health',
                port: PORT
            }
        ], ''));
        app.use((statusMonitor as any).middleware); // use the "middleware only" property to manage websockets
        const users: { [key: string]: string } = {}
        users[STATUS_PAGE_USER] = STATUS_PAGE_PWD;
        const realm = nanoid();
        // console.log("STATUS PAGE - realm: " + realm);
        app.get('/admin/status', expressBasicAuth({
            users,
            challenge: true,
            realm
        }), (statusMonitor as any).pageRoute); // use the pageRoute property to serve the dashboard html page
        // app.use(monitor(monitorConfig(PORT, '/status')));
    } else {
        console.log("STATUS PAGE NOT INITIALIZED")
    }
}

const initExpressMiddleware = (app: Express) => {
    if (STATUS_PAGE == 'true' && STATUS_PAGE_PWD && STATUS_PAGE_USER)
        initMonitorPage(app)

    initHelmetMiddleware(app);
    app.use(cors());
    app.use(requestIDMiddleware());
    app.use(compression());
    app.use(express.text());
    app.use(express.json());
    app.use(errorHandlerMiddleware);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    morgan.token('body', (req: Request, res: Response): string => JSON.stringify(req.body));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    morgan.token('requestID', (req: Request, res: Response): string => req.requestID);
    app.use(morgan('[:date[clf]] :method :url :status [:requestID] :response-time ms - body = :body'));
}


const app: Express = express();
initExpressMiddleware(app);

app.use('/admin', Routers.adminRouter);


app.listen(
    PORT,
    () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}`);
        console.log(`🗒 Node Env: ${NODE_ENV}`)
    }
);


