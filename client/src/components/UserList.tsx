import { useState, useEffect } from "react";
import useGetUsers, { User } from "../hooks/useGetUsers";
import { LoginResponse } from "../types/responseTypes";

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
    <div className="  w-fit flex flex-col gap-2 py-2 px-4 bg-[#D0E7FF] shadow-lg rounded-lg p-4 border border-white/50">
      <div className="flex justify-center text-center w-full">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch]">
          Logged as {user?.username}
        </p>
      </div>
      {!error ? (
        users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-start h-8 w-fit gap-2 cursor-pointer"
            onClick={() => handleChatUsername(user)}
          >
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <img
                src="/profile.png"
                alt="profile img"
                className="h-auto w-full object-cover"
              />
            </div>
            <p className="w-full max-w-fit font-bold text-xl">
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
