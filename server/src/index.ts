import express, { json } from "express";
import { createServer } from "http";

import router from "./router";
import { setupWebSocketServer } from "./websocket/websocket";

const app = express();
app.use(json());
app.use(router);
const port = 8000;
const server = createServer(app);

setupWebSocketServer(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
