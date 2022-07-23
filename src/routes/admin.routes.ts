import { Router, Request, Response, NextFunction } from "express";

const adminRouter = Router();

adminRouter.get('/health', async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ result: 'success' })
})

export default adminRouter;