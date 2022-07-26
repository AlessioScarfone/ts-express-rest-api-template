import express, { Express, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import * as Routers from "./routes";
import requestIDMiddleware from "./middlewares/request-id.middleware";
import env from "./config/env";
import loadMonitorPage from "./loaders/loadMonitorPage";
import loadHelmetMiddleware from "./loaders/loadHelmetMiddleware";

const loadExpressMiddleware = (app: Express) => {
    if (env.monitor.enabled && env.monitor.user && env.monitor.page && env.monitor.password)
        loadMonitorPage(app)

    loadHelmetMiddleware(app);
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
loadExpressMiddleware(app);

// attach router
app.use('/admin', Routers.adminRouter);

//start server
app.listen(
    env.port,
    () => {
        console.log(`🚀 Server ready at http://localhost:${env.port}`);
        console.log(`🗒 Node Env: ${env.node_env}`)
    }
);


