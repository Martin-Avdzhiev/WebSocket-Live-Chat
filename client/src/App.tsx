import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import UserList from "./components/UserList";
import { LoginResponse } from "./types";

import { useLogin } from "./hooks/useLogin";
import { User } from "./hooks/useGetUsers";
function App() {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);

  const submitHandler = (username: string) => {
    useLogin({ username, setUser });
  };
  return (
    <div className="flex flex-col border w-full h-screen">
      {user ? (
        <>
          <div className="flex h-full pt-4 px-4">
            <div className="flex w-fit h-fit">
              <UserList setReceiver={setReceiver} user={user} />
            </div>
            <div className="flex items-end justify-end w-full">
              {receiver && (
                <Chat
                  user={user}
                  receiver={receiver}
                  setReceiver={setReceiver}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex justify-center items-center">
          <Login submitHandler={submitHandler} />
        </div>
      )}
    </div>
  );
}

export default App;
