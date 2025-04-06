import { Router } from "express";
import { Request, Response } from "express";

import userRouter from "./users";
import chatRoomRouter from "./chatRoom";
const router = Router();

router.get("/", (req: Request, res: Response): void => {
    res.send("Hello World!");
});

router.use("/users", userRouter);
router.use('/chatRooms', chatRoomRouter)

export default router;