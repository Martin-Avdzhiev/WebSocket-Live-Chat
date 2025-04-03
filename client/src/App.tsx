import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import UserList from "./components/UserList";
function App() {
  const [username, setUsername] = useState("");
  const [chatUsername, setChatUsername] = useState("");
  return (
    <div className="flex flex-col border w-full h-screen">
      {username ? (
        <>
          <div className="flex h-full pt-4 px-4">
            <div className="flex w-fit h-fit">
              <UserList setChatUsername={setChatUsername} />
            </div>
            <div className="flex items-end justify-end w-full">
              {chatUsername && (
                <Chat username={username} chatUsername={chatUsername} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex justify-center items-center">
          <Login submitHandler={setUsername} />
        </div>
      )}
    </div>
  );
}

export default App;
