import { useState } from "react";

const Login = ({
  submitHandler,
}: {
  submitHandler: (username: string) => void;
}) => {
  const [username, setUsername] = useState("");

  return (
    <div className="flex items-center justify-center flex-col px-2 py-8 border rounded-xl bg-white">
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler(username);
        }}
      >
        <div className="w-3/4">
          <label
            htmlFor="username"
            className="text-xl max-w-2/3 text-start"
          ></label>
          <input
            className="border w-full pl-1  py-1 border-t-0 border-r-0 border-l-0 border-b-2 border-gray-400 focus:outline-none focus:border-b-2 focus:border-blue-500"
            value={username}
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <button
          type="submit"
          className="text-xl w-3/4 border px-8 py-2 cursor-pointer bg-gradient-to-r bg-gradient-custom animate-gradient text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
