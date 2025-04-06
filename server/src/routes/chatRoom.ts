import { Router } from "express";
import { Request, Response } from "express";
import prisma from "../prismaClient";

const chatRoomRouter = Router();

// Create Chatroom

// 1 create route to create chatroom

/**
 * @openapi
 * /chatRooms/{userId}:
 *   post:
 *     tags:
 *       - Chat Rooms
 *     summary: Create a new chatroom and add the user to it
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Chat room created successfully
 *       500:
 *         description: Internal server error
 */

chatRoomRouter.post("/:userId", async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const chatRoom = await prisma.chatRoom.create({
            data: {
                users: {
                    connect: [{ id: userId }],
                },
            },
        });
        res.status(201).json(chatRoom);
    } catch (error) {
        console.error("Error creating chat room:", error);
        res.status(500).json({ error: "Failed to create chat room" });
    }
});

// 2 create route to ask user to join chat room

/**
 * @openapi
 * /chatRooms/askToJoin:
 *   post:
 *     tags:
 *       - Chat Rooms
 *     summary: Create a new invitation to chat room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inviteeId
 *               - chatRoomId
 *             properties:
 *               inviteeId:
 *                 type: string
 *                 description: The ID of the user being invited
 *               chatRoomId:
 *                 type: string
 *                 description: The ID of the chat room
 *     responses:
 *       201:
 *         description: Invitation to chat room created successfully
 *       500:
 *         description: Internal server error
 */

chatRoomRouter.post('/askToJoin', async(req: Request, res: Response) => {
    const {inviteeId, chatRoomId} = req.body;
    try {
        const chatRoom = await prisma.chatRoom.update({
            where: {
                id: chatRoomId
            },
            data: {
                users: {
                    connect: [{id: inviteeId}]
                }
            }
            }
        )
    }
    catch (error) {
        console.error("Error inviting user to chat room:", error);
        res.status(500).json({ error: "Error inviting user to chat room" });
    }
});
// 3 create websocket when user is logging to display notification if it's asked to join chatroom
// 4 create route to ask user to leave chatroom
// 5 create route to fetch all users and all messages from chatroom

export default chatRoomRouter;