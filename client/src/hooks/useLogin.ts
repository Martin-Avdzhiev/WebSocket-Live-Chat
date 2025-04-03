import { LoginResponse } from "../types";
type Login = {
    username: string
    setUser: React.Dispatch<React.SetStateAction<LoginResponse | null>>
}

export const useLogin = ({ username, setUser }: Login): void => {
    const login = async (): Promise<void> => {
        try {
            const res = await fetch("http://localhost:8000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            if (!res.ok) {
                throw new Error("Failed to login");
            }

            const data: LoginResponse = await res.json();
            setUser(data);
            return
        } catch (error) {
            console.error(error);
        }
    };
    login();
};