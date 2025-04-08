import throttle from "lodash.throttle";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { ChatMessagePayload } from "../../types/payloadTypes";

type ThrottledFunction = ReturnType<typeof throttle<SendJsonMessage>>;

type ChatRoomMessage = {
  senderId: string;
  currentMessage: string;
  chatRoomId: string;
  sendJsonChatRoomMessageThrottled: React.RefObject<ThrottledFunction>
  setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
}
export const useChatRoomMessages = ({ currentMessage, setCurrentMessage, senderId, sendJsonChatRoomMessageThrottled, chatRoomId }: ChatRoomMessage) => {
  return () => {
    if (!currentMessage.trim()) return;
    const payload: ChatMessagePayload = {
      type: "chatRoomMessage",
      data: {
        chatRoomId,
        content: currentMessage,
        senderId
      }
    };

    //Sending the message
    sendJsonChatRoomMessageThrottled.current(payload);

    setCurrentMessage("");
  }
};