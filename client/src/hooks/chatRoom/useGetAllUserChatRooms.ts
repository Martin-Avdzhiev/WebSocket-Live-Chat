import { UserChatRoomsResponse } from "../../types/responseTypes";

const useGetAllUserChatRooms = async (userId: string): Promise<UserChatRoomsResponse> => {
    const response = await fetch(`http://localhost:3000/users/${userId}/chatRooms`);
    const chatRooms: UserChatRoomsResponse = await response.json();
    return chatRooms;
}

export default useGetAllUserChatRooms;