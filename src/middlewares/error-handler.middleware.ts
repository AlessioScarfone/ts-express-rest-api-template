import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import HttpException from "../models/HttpException";

const errorHandlerMiddleware: ErrorRequestHandler = (error: HttpException, request: Request, response: Response, next: NextFunction): void => {
    const start = new Date()
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    console.error(`[${start.toISOString()}] - ${request.requestID}- ${error.name} - status: ${status} - msg: ${message}`);
    response.status(status).json({ status, message });
}


export { errorHandlerMiddleware }