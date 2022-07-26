import { Express } from "express";
import helmet from "helmet";

const loadHelmetMiddleware = (app: Express): Express => {
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

export default loadHelmetMiddleware;