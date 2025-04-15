import { LoginResponse } from "../types/responseTypes";

const useGetUsers = async (user: LoginResponse | null): Promise<LoginResponse[]> => {
    const response = await fetch('http://localhost:3000/users');
    const users: LoginResponse[] = (await response.json()).filter((u: LoginResponse) => u.username !== user?.username);
    return users
}

export default useGetUsers;