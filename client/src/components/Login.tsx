import { useState } from "react";

const Login = ({
  submitHandler,
}: {
  submitHandler: (username: string) => void;
}) => {
  const [username, setUsername] = useState("");

  return (
    <form
      className="flex flex-col items-center gap-2 border"
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler(username);
      }}
    >
      <label htmlFor="username">Login with your username</label>
      <input
        className="border w-[70%] rounded-2xl pl-2"
        value={username}
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
      />
      <input type="submit" />
    </form>
  );
};

export default Login;
