import { Router, Request, Response } from "express";

import prisma from '../prismaClient';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const userRouter = Router();

userRouter.get("/user", async (req: Request, res: Response): Promise<void> => {
    const { userId, receiverId } = req.query;
    try {
        if (typeof userId !== "string" || typeof receiverId !== "string") return;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                sentMessages: {
                    where: {
                        senderId: userId,
                        receiverId: receiverId
                    }
                },
                receivedMessages: {
                    where: {
                        senderId: receiverId,
                        receiverId: userId
                    }
                },
                chatRooms: true
            }
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("No user found");
        }

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

userRouter.get("/all", async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        if (users.length === 0) {
            res.status(404).send("No users found");
        } else {
            res.status(200).json(users);
        }

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

userRouter.post("", async (req: Request, res: Response): Promise<void> => {
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
        if (error.code === "P2002") {
            try {
                const existingUser = await prisma.user.findUnique({
                    where: {
                        username: user.username
                    }
                })
                res.status(200).json(existingUser);
                return
            } catch (error) {
                res.status(500).json({ error: "Failed to create user" });
                return;
            }
        }
        res.status(500).json({ error: "Failed to create user" });
    }
});

export default userRouter;