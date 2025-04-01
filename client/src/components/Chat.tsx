import { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";

const WS_URL = "ws://localhost:8000/";

const Chat = ({ username }: { username: string }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    { username: string; message: string }[]
  >([]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{
    username: string;
    message: string;
  }>(WS_URL, { share: true, queryParams: { username } });

  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, 50));

  //Handling incoming messages
  useEffect(() => {
    if (lastJsonMessage?.message && lastJsonMessage?.username !== username) {
      setMessages((prevMessages) => [...prevMessages, lastJsonMessage]);
    }
  }, [lastJsonMessage, username]);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage = { username, message: currentMessage.trim() };

    //Sending the message
    sendJsonMessageThrottled.current(newMessage);

    //Locally adding the message only if WebSocket is not going to return it
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setCurrentMessage("");
  };

  return (
    <div className="flex justify-center items-center flex-col border w-60">
      <div className=" w-full flex-col gap-2">
        <div className="flex justify-center">
          <p className="p-2 font-bold">{username}</p>
        </div>
        <div className="flex items-end justify-center flex-col max-h-60 overflow-y-auto">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`p-2 w-[${
                msg.username.length + msg.message.length + 2
              }ch] max-w-[80%] break-words whitespace-normal border rounded ${
                msg.username === username
                  ? "bg-blue-200 text-right"
                  : "bg-gray-100"
              }`}
            >
              <strong>{msg.username}:</strong> {msg.message}
            </p>
          ))}
        </div>
      </div>
      <div className="border p-2 w-full">
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
