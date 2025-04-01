import { WebSocket } from "ws";
type User = {
    username: string;
};

export type Connections = {
    [uuid: string]: { socket: WebSocket; user: User };
};