import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import UserList from "./components/UserList";
function App() {
  const [username, setUsername] = useState("");
  return (
    <div className="flex items-center justify-center flex-col border w-full h-screen">
      {username ? (
        <>
          <UserList />
          <Chat username={username} />
        </>
      ) : (
        <Login submitHandler={setUsername} />
      )}
    </div>
  );
}

export default App;
