import { LoginResponse } from "../types";

export type User = {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
const useGetUsers = async (user: LoginResponse | null): Promise<User[]> => {
    const response = await fetch('http://localhost:8000/users/all');
    const users: User[] = (await response.json()).filter((u: User) => u.username !== user?.username);
    return users
}

export default useGetUsers;