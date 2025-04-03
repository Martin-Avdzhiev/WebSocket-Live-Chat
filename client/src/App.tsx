import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import UserList from "./components/UserList";
import { LoginResponse } from "./types";

import { useLogin } from "./hooks/useLogin";
function App() {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [receiverUsername, setReceiverUsername] = useState("");

  const submitHandler = (username: string) => {
    useLogin({ username, setUser });
  };
  return (
    <div className="flex flex-col border w-full h-screen">
      {user ? (
        <>
          <div className="flex h-full pt-4 px-4">
            <div className="flex w-fit h-fit">
              <UserList setReceiverUsername={setReceiverUsername} />
            </div>
            <div className="flex items-end justify-end w-full">
              {receiverUsername && (
                <Chat user={user} receiverUsername={receiverUsername} />
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
