import { MessageSquareText } from "lucide-react";
export const ChatRoomList = () => {
  return (
    <div>
      <p className="font-bold text-center">Chat Rooms</p>
      <div className="flex items-center justify-start cursor-pointer relative max-w-fit gap-1">
        <MessageSquareText size="1.5rem" />
        <p>1</p>
      </div>
    </div>
  );
};
