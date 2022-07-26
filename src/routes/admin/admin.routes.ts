import { Router, Request, Response } from "express";

const adminRouter = Router();

const baseUrl = "/admin"

adminRouter.get(`${baseUrl}/health`, async (req: Request, res: Response) => {
    res.status(200).send({ 
        uptime: process.uptime(),
        message: 'ok',
        timestamp: Date.now()
    })
})

export default adminRouter;