import { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { useMessages } from "../hooks/useMessages";
import { LoginResponse } from "../types";

const WS_URL = "ws://localhost:8000/";

type ChatProps = {
  user: LoginResponse;
  receiverUsername: string;
};

const Chat = ({ user, receiverUsername }: ChatProps) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >([]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{
    username: string;
    message: string;
    receiverUsername: string;
  }>(WS_URL, { share: true, queryParams: { username: user.username } });

  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, 50));

  //Handling incoming messages
  useEffect(() => {
    if (lastJsonMessage?.message) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: user.username, message: lastJsonMessage.message },
      ]);
    }
  }, [lastJsonMessage, user.username]);

  const sendMessage = useMessages({
    currentMessage,
    username: user.username,
    receiverUsername,
    sendJsonMessageThrottled,
    setCurrentMessage,
  });

  return (
    <div className="flex justify-center items-center flex-col w-60 bg-gradient-to-br from-[#B8D7FF] to-[#D7B8FF] border-white/50 shadow-md rounded-lg">
      <div className=" w-full flex-col gap-2">
        <div className="flex justify-center">
          <p className="p-2 font-bold">{receiverUsername}</p>
        </div>
        <div className="flex items-end justify-center flex-col max-h-60 overflow-y-auto">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`p-2 w-[${
                msg.username.length + msg.message.length + 2
              }ch] max-w-[80%] break-words whitespace-normal border rounded ${
                msg.username === user.username
                  ? "bg-blue-200 text-right"
                  : "bg-gray-100"
              }`}
            >
              <strong>{msg.username}:</strong> {msg.message}
            </p>
          ))}
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
