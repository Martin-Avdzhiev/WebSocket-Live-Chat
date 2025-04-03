import { WebSocket } from "ws";
type User = {
    username: string;
};

export type Message = {
    username: string;
    message: string;
    receiverUsername: string;
};

export type Connections = {
    [uuid: string]: { socket: WebSocket; user: User };
};