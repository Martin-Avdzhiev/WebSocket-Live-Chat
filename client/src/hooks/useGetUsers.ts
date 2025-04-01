export type User = {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
const useGetUsers = async () : Promise<User[]> => {
    const response = await fetch('http://localhost:8000/users');
    const users: User[] = await response.json();
    return users
}

export default useGetUsers;