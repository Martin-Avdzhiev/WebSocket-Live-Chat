import { io, Socket } from "socket.io-client";

export const useLogin = (username: string): Socket => {
  const socket: Socket = io("http://localhost:3001", {
    extraHeaders: {
      username,
    },
  });
  return socket;
};
