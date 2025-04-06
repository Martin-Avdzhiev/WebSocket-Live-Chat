import express, { json } from "express";
import { createServer } from "http";
import cors from 'cors';

import { setupSwaggerDocs } from "./docs/swagger";
import router from "./routes/router";
import { setupWebSocketServer } from "./websocket/websocket";

const app = express();
app.use(cors());
app.use(json());
setupSwaggerDocs(app);
app.use(router);
const port = 8000;
const server = createServer(app);

setupWebSocketServer(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
