import { useState, useEffect } from "react";
import { MessageSquareText } from "lucide-react";
import { LoginResponse, ChatRoomsResponse } from "../types/responseTypes";

import useGetAllUserChatRooms from "../hooks/chatRoom/useGetAllUserChatRooms";

type ChatRoomListProps = {
  user: LoginResponse;
};
export const ChatRoomList = ({ user }: ChatRoomListProps) => {
  const [chatRooms, setChatRooms] = useState<ChatRoomsResponse[]>([]);
  useEffect(() => {
    useGetAllUserChatRooms(user.id)
      .then((chatRooms) => setChatRooms(chatRooms))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      {chatRooms.length > 0 && (
        <>
          <p className="font-bold text-center">Chat Rooms</p>
          <div className="flex items-center justify-start cursor-pointer max-w-fit gap-1">
            {chatRooms.map((chatRoom) => (
              <div
                className="flex items-center cursor-pointer gap-1 font-bold text-lg"
                key={chatRoom.id}
              >
                <MessageSquareText size="1.25rem" />
                <p>{chatRoom.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
