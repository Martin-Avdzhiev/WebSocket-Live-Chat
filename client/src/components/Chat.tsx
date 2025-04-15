import { useEffect, useRef, useState } from "react";
import { ChatRoomsResponse, LoginResponse } from "../types/responseTypes";
import { Socket } from "socket.io-client";
import { usePersonalMessagesWebsocket } from "../hooks/usePersonalMessagesWebsocket";
import { usePersonalMessagesHistory } from "../hooks/usePersonalMessagesHistory";

type ChatProps = {
  user: LoginResponse;
  receiver: LoginResponse;
  setReceiver: React.Dispatch<React.SetStateAction<LoginResponse | null>>;
  setChatRoom: React.Dispatch<React.SetStateAction<ChatRoomsResponse | null>>;
  socket: Socket;
};

const Chat = ({
  user,
  receiver,
  setReceiver,
  setChatRoom,
  socket,
}: ChatProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { messages, setMessages } = usePersonalMessagesHistory(user, receiver);

  usePersonalMessagesWebsocket({ socket, setMessages });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [messages]);

  const sendMessage = () => {
    const payload = {
      senderUsername: user.username,
      receiverUsername: receiver.username,
      message: currentMessage,
    };
    socket.emit("sendedPersonalMessage", { ...payload });
    setCurrentMessage("");
  };

  const closeChatHandler = () => {
    setReceiver(null);
  };
  return (
    <div className="flex justify-center items-center flex-col w-60 bg-gradient-to-br from-[#B8D7FF] to-[#D7B8FF] border-white/50 shadow-md rounded-lg">
      <div className="w-full flex-col gap-2">
        <div className="relative flex items-center justify-between px-4 py-2">
          <div className="w-6"></div>
          <p className="absolute left-1/2 transform -translate-x-1/2 font-bold">
            {receiver.username}
          </p>
          <p
            className="w-6 font-bold text-lg text-center cursor-pointer hover:opacity-50 text-[#b625ff99]"
            onClick={closeChatHandler}
          >
            X
          </p>
        </div>

        {/* <div className="flex flex-wrap justify-center">
        </div> */}
        <div className="flex flex-col h-60 overflow-y-auto w-full gap-2">
          {messages.map((msg) => (
            <p
              key={msg.id}
              className={`p-2 max-w-[80%] break-words whitespace-normal border rounded ${
                msg.senderId === user.id
                  ? "bg-blue-200 self-start text-left"
                  : "bg-gray-100 self-end text-right"
              }`}
            >
              <strong>
                {msg.senderId === user.id ? user.username : receiver.username}:
              </strong>{" "}
              {msg.content}
            </p>
          ))}
          {messages.length === 0 && (
            <div className="h-full flex items-end text-center text-gray-900">
              <p>
                You dont't have a chat history with{" "}
                <strong>{receiver.username}</strong>
              </p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="p-2 w-full rounded-lg">
        <input
          className="border w-full p-1"
          type="text"
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
