import { useRef, useEffect, useState } from "react";
import { LoginResponse } from "../types";
import { User } from "../hooks/useGetUsers";
import useChatMessages from "../hooks/useChatMessages";
import { useMessages } from "../hooks/useMessages";

type ChatProps = {
  user: LoginResponse;
  receiver: User;
};

const Chat = ({ user, receiver }: ChatProps) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const { previousMessages, messages, sendJsonMessageThrottled } =
    useChatMessages({
      userId: user.id,
      userUsername: user.username,
      receiver,
    });

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [previousMessages.length]);

  const sendMessage = useMessages({
    currentMessage,
    username: user.username,
    receiverUsername: receiver.username,
    sendJsonMessageThrottled,
    setCurrentMessage,
  });

  return (
    <div className="flex justify-center items-center flex-col w-60 bg-gradient-to-br from-[#B8D7FF] to-[#D7B8FF] border-white/50 shadow-md rounded-lg">
      <div className="w-full flex-col gap-2">
        <div className="flex flex-wrap justify-center">
          <p className="p-2 font-bold w-full">{receiver.username}</p>
        </div>
        <div className="flex flex-col h-60 overflow-y-auto w-full">
          {previousMessages.map((msg, index) => (
            <p
              key={index}
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
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`p-2 max-w-[80%] break-words whitespace-normal border rounded ${
                msg.senderUsername === user.username
                  ? "bg-blue-200 self-start text-left"
                  : "bg-gray-100 self-end text-right"
              }`}
            >
              <strong>{msg.senderUsername}:</strong> {msg.message}
            </p>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="p-2 w-full rounded-lg">
        <input
          className="border w-full p-1"
          type="text"
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
