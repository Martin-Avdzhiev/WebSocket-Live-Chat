//localhost:8000/users/?userId=3e677bb0-b97c-4b59-b0c0-9b7f01f509ea&receiverId=8670b104-a48e-4a7b-8ec7-552f21db06a2
import { ChatRoomsResponse } from "../../types/responseTypes";

type PopulatedChatRoomMessage = {
    id:string;
    content: string;
    createdAt: Date;
    sender: { username: string };
}
 type PopulatedChatRoom = {
    id: string;
    name: string;
    messages: PopulatedChatRoomMessage[];
    users: { username: string };
    // invites: ChatRoomInviteResponse[];
    createdAt: Date;
}

const useGetChatRoomDetails = async ({ id }: ChatRoomsResponse): Promise<PopulatedChatRoom> => {
    const response = await fetch(`http://localhost:8000/chatRooms/chatRoomDetails/${id}`);
    const populatedChatRoom: PopulatedChatRoom = await response.json();
    return populatedChatRoom
}

export { useGetChatRoomDetails };

export type { PopulatedChatRoom };