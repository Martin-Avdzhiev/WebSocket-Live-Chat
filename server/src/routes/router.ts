import { Router } from "express";
import { Request, Response } from "express";
import userRouter from "./users";
const router = Router();

router.get("/", (req: Request, res: Response): void => {
    res.send("Hello World!");
});

router.use("/users", userRouter);


export default router;
