import { useRef, useEffect, useState, useCallback } from "react";
import { ChatRoomsResponse, LoginResponse } from "../types/responseTypes";
import useChatRoomMessagesWebsocket from "../hooks/chatRoom/useChatRoomMessagesWebsocket";
import { useChatRoomMessages } from "../hooks/chatRoom/useChatRoomMessages";

type ChatRoomProps = {
  user: LoginResponse;
  chatRoom: ChatRoomsResponse;
  setChatRoom: React.Dispatch<React.SetStateAction<ChatRoomsResponse | null>>;
};

const ChatRoom = ({ user, chatRoom, setChatRoom }: ChatRoomProps) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const { messages, populatedChatRoom, sendJsonChatRoomMessageThrottled } =
    useChatRoomMessagesWebsocket({ chatRoom });

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    return () => {
      setCurrentMessage("");
      setChatRoom(null);
    };
  }, [chatRoom]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [populatedChatRoom?.messages.length]);

  const closeChatHandler = useCallback(() => {
    setCurrentMessage("");
    setChatRoom(null);
  }, [setChatRoom]);

  const sendMessage = useChatRoomMessages({
    currentMessage,
    senderId: user.id,
    chatRoomId: chatRoom.id,
    setCurrentMessage,
    sendJsonChatRoomMessageThrottled,
  });

  return (
    <div className="flex justify-center items-center flex-col w-60 bg-gradient-to-br from-[#B8D7FF] to-[#D7B8FF] border-white/50 shadow-md rounded-lg">
      <div className="w-full flex-col gap-2">
        <div className="relative flex items-center justify-between px-4 py-2">
          <div className="w-6"></div>
          <p className="absolute left-1/2 transform -translate-x-1/2 font-bold">
            {chatRoom.name}
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
        <div className="flex flex-col h-60 overflow-y-auto w-full">
          {populatedChatRoom?.messages.map((msg) => (
            <p
              key={msg.id}
              className={`p-2 max-w-[80%] break-words whitespace-normal border rounded ${
                msg.sender.username === user.username
                  ? "bg-blue-200 self-start text-left"
                  : "bg-gray-100 self-end text-right"
              }`}
            >
              <strong>{msg.sender.username}:</strong> {msg.content}
            </p>
          ))}
          {/* {messages.map((msg, index) => (
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
          ))} */}
          {populatedChatRoom?.messages.length === 0 && (
            <div className="h-full flex items-end text-center text-gray-900">
              <p>You dont't have a chat history</p>
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

export default ChatRoom;
