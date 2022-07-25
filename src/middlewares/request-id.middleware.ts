import { NextFunction, Request, Response, RequestHandler } from "express";
import { nanoid } from 'nanoid';

/**
 * 
 * @param generator fuction used for generate requestID (Default `nanoid`)
 * @param headerName name of header to set (Default `X-Request-Id`)
 * @param setHeader add header to response (Default `true`)
 * @returns 
 */
export default function requestIDMiddleware(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generator = (req: Request) => nanoid(),
    headerName = 'X-Request-Id',
    setHeader = true,
): RequestHandler {
    return (request: Request, response: Response, next: NextFunction) => {
        const oldValue = request.get(headerName);
        const id = oldValue === undefined ? generator(request) : oldValue;

        if (setHeader) {
            response.set(headerName, id);
        }

        request.requestID = id;

        next();
    };
}