import { ChatRoomsResponse, LoginResponse } from "../../types/responseTypes";

type CreateChatRoomArgs = {
    roomName: string;
    user: LoginResponse;
    setRoomName: React.Dispatch<React.SetStateAction<string>>;
    setChatRooms: React.Dispatch<React.SetStateAction<ChatRoomsResponse[]>>;
}

const useCreateChatRoom = async ({ roomName, user, setRoomName, setChatRooms }: CreateChatRoomArgs) => {
    const response = await fetch("http://localhost:3000/users/createChatRoom", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            roomName: roomName,
            ownerId: user.id,
            username: user.username,
        }),
    });
    const data: ChatRoomsResponse = await response.json();
    setRoomName("");
    setChatRooms((prevChatRooms) => [...prevChatRooms, data]);
};

export default useCreateChatRoom;