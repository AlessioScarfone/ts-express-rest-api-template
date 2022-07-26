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

const logRegisteredRoutes = (app: Express) => {
  console.log("== Registered Routes ==")
  const routes = app._router.stack.map((middleware: any) => {
    if (middleware.route)
      return { path: middleware?.route?.path, methods: middleware?.route?.methods }
    else if (middleware.name == 'router') {
      console.log(middleware)
      //routes attached to a router
      return middleware.handle.stack.map((handler: any) => {
        return { path: handler?.route?.path, methods: handler?.route?.methods }
      })
    }
  }).flat(Infinity).filter((e: any) => e)

  // app._router.stack.forEach(function (middleware: any) {
  //   if (middleware.route) { // routes registered directly on the app
  //     console.log(">", middleware.route)
  //     routes.push(middleware.route);
  //   } else if (middleware.name === 'router') { // router middleware 
  //     middleware.handle.stack.forEach(function (handler: any) {
  //       console.log(">>", handler.route)
  //       if (handler.route)
  //         routes.push(handler.route);
  //     });
  //   }
  // });
  console.log(routes);
  console.log("=======================")
}


const createApp = (logRoute = true): Express => {
  const app: Express = express();
  loadExpressMiddleware(app);

  // attach router
  app.use('/', Routers.adminRouter);
  
  if(logRoute)
    logRegisteredRoutes(app);

  return app;
}

export default createApp;


