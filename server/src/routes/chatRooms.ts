import { Router } from "express";
import { Request, Response } from "express";
import prisma from "../prismaClient";

const chatRoomRouter = Router();

// Create Chatroom

// 1 create route to get all chat rooms for user

chatRoomRouter.get("/:userId", async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const data = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                chatRooms: true
            }
        })
        res.status(201).json(data?.chatRooms);
    } catch (error) {
        console.error("Error creating chat room:", error);
        res.status(500).json({ error: "Failed to create chat room" });
    }
});

// 2 create route to get chat room details

chatRoomRouter.get("/chatRoomDetails/:chatRoomId", async (req: Request, res: Response) => {
    const { chatRoomId } = req.params;
    try {
        const data = await prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
            select: {
                id: true,
                name: true,
                users: {
                    select: { username: true }
                },
                messages: {
                    select: {
                        id:true,
                        content: true,
                        createdAt: true,
                        sender: {
                            select: { username: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })
        res.status(201).json(data);
    } catch (error) {
        console.error("Error creating chat room:", error);
        res.status(500).json({ error: "Failed to create chat room" });
    }
});

// 3 create route to create chatroom

chatRoomRouter.post("/", async (req: Request, res: Response) => {
    const { userId, name } = req.body;
    try {
        const chatRoom = await prisma.chatRoom.create({
            data: {
                name,
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

// 3 create route to send message to chat room

// chatRoomRouter.post("/message", async (req: Request, res: Response) => {
//     const { senderId, chatRoomId, content } = req.body;


//     if (!senderId || !chatRoomId || !content) {
//         res.status(400).json({ error: "Missing required fields" });
//         return
//     }
//     try {
//         const message = await prisma.message.create({
//             data: {
//                 content,
//                 sender: { connect: { id: senderId } },
//                 ChatRoom: { connect: { id: chatRoomId } }
//             },
//             include: {
//                 sender: { select: { username: true } },
//                 ChatRoom: { select: { name: true } }
//             }
//         });

//         res.status(201).json(message);
//     } catch (error) {
//         console.error("Error sending message:", error);
//         res.status(500).json({ error: "Failed to send message" });
//     }
// });


// 4 create route to ask user to join chat room

chatRoomRouter.post('/askToJoin', async (req: Request, res: Response) => {
    const { inviteeId, chatRoomId } = req.body;
    try {
        const data = await prisma.chatRoom.update({
            where: {
                id: chatRoomId
            },
            data: {
                users: {
                    connect: [{ id: inviteeId }]
                }
            },
            include: {
                users: {
                    where: {
                        id: inviteeId
                    }
                }
            }
        }
        )
        res.status(201).json(data)
    }
    catch (error) {
        console.error("Error inviting user to chat room:", error);
        res.status(500).json({ error: "Error inviting user to chat room" });
    }
});
// 5 create websocket when user is logging to display notification if it's asked to join chatroom
// 6 create route to ask user to leave chatroom
// 7 create route to fetch all users and all messages from chatroom

export default chatRoomRouter;


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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the chat room
 *                 name:
 *                   type: string
 *                   description: The name of the chat room (can be null)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the chat room was created
 *       500:
 *         description: Internal server error
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the chat room
 *                 name:
 *                   type: string
 *                   description: The name of the chat room (can be null)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the chat room was created
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the user
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the user was created
 *                       username:
 *                         type: string
 *                         description: The username of the user
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the user was updated
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the user was deleted (can be null)
 *       500:
 *         description: Internal server error
 */