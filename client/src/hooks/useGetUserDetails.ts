//localhost:8000/users/?userId=3e677bb0-b97c-4b59-b0c0-9b7f01f509ea&receiverId=8670b104-a48e-4a7b-8ec7-552f21db06a2
import { MessageResponse } from "../types/responseTypes";
type PopulatedUser = {
    id: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    sentMessages: MessageResponse[];
    receivedMessages: MessageResponse[];
    chatRooms: [];
}

type SetPreviousMessages = React.Dispatch<React.SetStateAction<MessageResponse[]>>

const useGetUserDetails = async (userId: string, receiverId: string, setPreviousMessages: SetPreviousMessages): Promise<Partial<PopulatedUser>> => {
    const response = await fetch(`http://localhost:8000/users/user?userId=${userId}&receiverId=${receiverId}`);
    const user: PopulatedUser = await response.json();
    const messages = user.sentMessages.concat(user.receivedMessages).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setPreviousMessages(messages)
    return { sentMessages: user.sentMessages, receivedMessages: user.receivedMessages }
}

export default useGetUserDetails;