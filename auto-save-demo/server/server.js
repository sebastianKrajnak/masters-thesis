const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("get-document", (id) => {
    const data = "";

    socket.join(id);
    console.log(`ayo joined ${id} to the room`);
    socket.emit("load-document", data);

    socket.on("send-changes", (text) => {
      // Broadcast the updated text to all clients with the same id
      socket.broadcast.to(id).emit("receive-changes", text);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
