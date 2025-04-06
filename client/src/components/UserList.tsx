import { useState, useEffect } from "react";
import useGetUsers, { User } from "../hooks/useGetUsers";
import { LoginResponse } from "../types/responseTypes";
import { SquareUserRound } from "lucide-react";
type UserListProps = {
  user: LoginResponse | null;
  setReceiver: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserList = ({ user, setReceiver }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChatUsername = (user: User) => {
    setReceiver(user);
  };

  useEffect(() => {
    useGetUsers(user)
      .then((users) => setUsers(users))
      .catch((err) => setError(err));
  }, []);
  return (
    <div className="w-fit flex flex-col gap-2">
      <div className="flex justify-center text-center w-full">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch]">
          Logged as <strong>{" " + user?.username}</strong>
        </p>
      </div>
      {!error ? (
        users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-start cursor-pointer relative max-w-fit gap-1"
            onClick={() => handleChatUsername(user)}
          >
            <SquareUserRound size={"1.25rem"} />
            <p className="w-full max-w-fit font-bold text-lg">
              {user.username}
            </p>
          </div>
        ))
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default UserList;
