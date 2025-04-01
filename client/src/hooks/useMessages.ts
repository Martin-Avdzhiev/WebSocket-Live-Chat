import throttle from "lodash.throttle";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

type ThrottledFunction = ReturnType<typeof throttle<SendJsonMessage>>;

type Message = {
    username: string;
    currentMessage: string;
    sendJsonMessageThrottled: React.RefObject<ThrottledFunction>
    setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
    setMessages: React.Dispatch<React.SetStateAction<{
        username: string;
        message: string;
    }[]>>;
}
export const useMessages = ({ currentMessage, username, sendJsonMessageThrottled, setMessages, setCurrentMessage }: Message) => {
    return () => {
        if (!currentMessage.trim()) return;

        const newMessage = { username, message: currentMessage.trim() };

        //Sending the message
        sendJsonMessageThrottled.current(newMessage);

        //Locally adding the message only if WebSocket is not going to return it
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        setCurrentMessage("");
    }
};