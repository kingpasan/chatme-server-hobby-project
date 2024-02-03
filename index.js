import { server as WebSocketServer } from "websocket";
import { createServer } from "http";

const server = createServer((req, res) => {
  console.log(new Date() + "Received request for " + req.url);
  res.writeHead(404);
  res.end();
});

server.listen(3001, () => {
  console.log("Server is listening on port: 3001");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

const originIsAllowed = (origin) => {
  return true;
};

wsServer.on("request", (req) => {
  if (!originIsAllowed(req.origin)) {
    req.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  const connection = req.accept("echo-protocol", req.origin);

  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on("close", (code, desc) => {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
