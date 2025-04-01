import { useState, useEffect } from "react";
import useGetUsers, { User } from "../hooks/useGetUsers";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    useGetUsers()
      .then((users) => setUsers(users))
      .catch((err) => setError(err));
  }, []);
  return (
    <div>
      {!error ? (
        users.map((user) => <div key={user.id}>{user.username}</div>)
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default UserList;
