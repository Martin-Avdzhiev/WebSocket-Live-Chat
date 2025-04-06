import { ChatRoomsResponse } from "../../types/responseTypes";

const useGetAllUserChatRooms = async (userId: string): Promise<ChatRoomsResponse[]> => {
    const response = await fetch(`http://localhost:8000/chatRooms/${userId}`);
    const chatRooms: ChatRoomsResponse[] = await response.json();
    return chatRooms;
}

export default useGetAllUserChatRooms;