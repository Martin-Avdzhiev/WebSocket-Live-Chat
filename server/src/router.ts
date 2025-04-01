import { Router } from "express";
import { Request, Response } from "express";
import prisma from "./prismaClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.post("/users", async (req: Request, res: Response): Promise<void> => {
    const user = req.body;

    if (!user || !user.username) {
        res.status(400).send("Missing username");
        return;
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                username: user.username,
            },
        });
        res.status(201).json(newUser);
    } catch (error: PrismaClientKnownRequestError | any) {
        console.error("Error creating user:", error);
        if(error.code === "P2002") res.status(409).json({ error: "User already exists" });
        res.status(500).json({ error: "Failed to create user" });
    }
});

export default router;
