import { Router } from "express";
import { Request, Response } from "express";
import prisma from "../prismaClient";

const chatRoomRouter = Router();

// Create Chatroom

// 1 create route to create chatroom

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

// 2 create route to ask user to join chatroom

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