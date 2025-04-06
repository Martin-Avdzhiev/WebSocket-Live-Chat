import { Router, Request, Response } from "express";

import prisma from '../prismaClient';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const userRouter = Router();

/**
 * @openapi
 * /users/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user with chat messages (send and received) with specific user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *       404:
 *         description: User is not found
 *       500:
 *         description: Internal server error
 */

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


/**
 * @openapi
 * /users/all:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success response
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal server error
 */

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

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: The user is successfully created
 *       400:
 *         description: Username is missing
 *       500:
 *         description: Internal server error
 */


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