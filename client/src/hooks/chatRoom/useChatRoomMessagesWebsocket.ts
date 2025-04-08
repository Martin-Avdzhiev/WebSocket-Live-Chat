import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { DebouncedFunc } from 'lodash';
import { PopulatedChatRoom, useGetChatRoomDetails } from "./useGetChatRoomDetails";
import { ChatRoomsResponse } from "../../types/responseTypes";

type ChatMessagesArgs = {
  chatRoom: ChatRoomsResponse
};

export type ReturnChatMessages = {
  messages: {
    senderUsername: string;
    message: string;
    receiverUsername: string;
  }[];
  sendJsonChatRoomMessageThrottled: React.RefObject<DebouncedFunc<SendJsonMessage>>;
  setMessages: React.Dispatch<
    React.SetStateAction<
      {
        senderUsername: string;
        message: string;
        receiverUsername: string;
      }[]
    >
  >;
  populatedChatRoom: PopulatedChatRoom | null;
}

export default function useChatRoomMessagesWebsocket({chatRoom}: ChatMessagesArgs): ReturnChatMessages {
  const [messages, setMessages] = useState<
    { senderUsername: string; message: string; receiverUsername: string }[]
  >([]);
  const [populatedChatRoom, setPopulatedChatRoom] = useState<PopulatedChatRoom | null>(null);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{
    senderUsername: string;
    message: string;
    receiverUsername: string;
  }>("ws://localhost:8000/", {
    share: true,
  });

  const sendJsonChatRoomMessageThrottled = useRef(throttle(sendJsonMessage, 50));


  useEffect(() => {
   useGetChatRoomDetails(chatRoom).then((data) => setPopulatedChatRoom(data)).catch((err) => console.error(err));
  }, [chatRoom]);

  useEffect(() => {
    if (lastJsonMessage?.message) {
      setMessages((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  return {
    messages,
    setMessages,
    populatedChatRoom,
    sendJsonChatRoomMessageThrottled,
  };
}
