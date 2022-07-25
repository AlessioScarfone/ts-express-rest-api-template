import { Router, Request, Response } from "express";

const adminRouter = Router();

adminRouter.get('/health', async (req: Request, res: Response) => {
    res.status(200).send({ result: 'success' })
})

export default adminRouter;