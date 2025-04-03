import throttle from "lodash.throttle";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

type ThrottledFunction = ReturnType<typeof throttle<SendJsonMessage>>;

type Message = {
    username: string;
    currentMessage: string;
    receiverUsername: string;
    sendJsonMessageThrottled: React.RefObject<ThrottledFunction>
    setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
}
export const useMessages = ({ currentMessage, username, sendJsonMessageThrottled, setCurrentMessage,receiverUsername }: Message) => {
    return () => {
        if (!currentMessage.trim()) return;

        const newMessage = {
            username,
            message: currentMessage.trim(),
            receiverUsername,
          };

        //Sending the message
        sendJsonMessageThrottled.current(newMessage);

        setCurrentMessage("");
    }
};