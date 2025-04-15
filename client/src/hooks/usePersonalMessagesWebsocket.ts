import { Socket } from "socket.io-client";
import { MessageResponse } from "../types/responseTypes";
import { useEffect } from "react";
type PersonalMessageWebsocket = {
    socket: Socket;
    setMessages: React.Dispatch<React.SetStateAction<MessageResponse[]>>;
}

export const usePersonalMessagesWebsocket = ({ socket, setMessages }: PersonalMessageWebsocket) => {

    useEffect(() => {
        const handler = (data: MessageResponse) => {
            console.log(data)
          setMessages((prevMessages) => [...prevMessages, data]);
        };
    
        socket.on("receivedPersonalMessage", handler);
    
        return () => {
          socket.off("receivedPersonalMessage", handler);
        };
      }, [socket]);
}