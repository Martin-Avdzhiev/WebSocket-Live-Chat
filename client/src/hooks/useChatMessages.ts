import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Message } from "../types";
import { User } from "./useGetUsers";
import useGetUserDetails from "./useGetUserDetails";

type ChatMessagesArgs = {
  userId: string;
  userUsername: string;
  receiver: User;
};

export default function useChatMessages({ userId, userUsername, receiver }: ChatMessagesArgs) {
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [messages, setMessages] = useState<
    { senderUsername: string; message: string; receiverUsername: string }[]
  >([]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{
    senderUsername: string;
    message: string;
    receiverUsername: string;
  }>("ws://localhost:8000/", {
    share: true,
    queryParams: { username: userUsername },
  });

  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, 50));

  useEffect(() => {
    useGetUserDetails(userId, receiver.id, setPreviousMessages);
  }, [userId, receiver.id]);

  useEffect(() => {
    if (lastJsonMessage?.message) {
      setMessages((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  return {
    previousMessages,
    messages,
    sendJsonMessageThrottled,
    setMessages,
  };
}
