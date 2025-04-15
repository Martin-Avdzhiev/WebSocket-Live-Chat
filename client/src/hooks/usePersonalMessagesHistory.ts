import { useEffect, useState } from "react";
import { LoginResponse, MessageResponse } from "../types/responseTypes";

export const usePersonalMessagesHistory = (user: LoginResponse, receiver: LoginResponse) => {
    const [messages, setMessages] = useState<MessageResponse[]>([]);

    useEffect(() => {
        fetch(
            `http://localhost:3000/users/personalMessages?senderId=${user.id}&receiverId=${receiver.id}`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch messages");
                }
                return res.json();
            })
            .then((data) => {
                setMessages(data);
            })
            .catch((err) => {
                console.error("Error fetching messages:", err);
            });
    }, [receiver?.id]);

    return { messages, setMessages };
}