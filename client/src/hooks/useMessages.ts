import throttle from "lodash.throttle";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { MessagePayload } from "../types/payloadTypes";

type ThrottledFunction = ReturnType<typeof throttle<SendJsonMessage>>;

type Message = {
    username: string;
    currentMessage: string;
    receiverUsername: string;
    sendJsonMessageThrottled: React.RefObject<ThrottledFunction>
    setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
}
export const useMessages = ({ currentMessage, username, sendJsonMessageThrottled, setCurrentMessage, receiverUsername }: Message) => {
    return () => {
        if (!currentMessage.trim()) return;
        const payload: MessagePayload = {
            type: "message",
            data: {
                senderUsername: username,
                message: currentMessage.trim(),
                receiverUsername,
            }
        };

        //Sending the message
        sendJsonMessageThrottled.current(payload);

        setCurrentMessage("");
    }
};