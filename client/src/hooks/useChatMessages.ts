import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Message } from "../types";
import { User } from "./useGetUsers";
import useGetUserDetails from "./useGetUserDetails";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { DebouncedFunc } from 'lodash';

type ChatMessagesArgs = {
  userId: string;
  userUsername: string;
  receiver: User;
};

export type ReturnChatMessages = {
  previousMessages: Message[];
  messages: {
    senderUsername: string;
    message: string;
    receiverUsername: string;
  }[];
  sendJsonMessageThrottled: React.RefObject<DebouncedFunc<SendJsonMessage>>;
  setMessages: React.Dispatch<
    React.SetStateAction<
      {
        senderUsername: string;
        message: string;
        receiverUsername: string;
      }[]
    >
  >;
  setPreviousMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function useChatMessages({ userId, userUsername, receiver }: ChatMessagesArgs): ReturnChatMessages {
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
    setPreviousMessages
  };
}
