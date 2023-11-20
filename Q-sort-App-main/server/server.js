const mongoose = require("mongoose");
const TableQueue = require("./TableQueue");

mongoose.connect("mongodb://mongo-db:27017/test-db");
mongoose.connection
  .once("open", () => console.log("Connected to MongoDB"))
  .on("error", (error) => {
    console.warn("Warning: error connecting to MongoDB:", error);
  });

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

async function findOrCreateEntry(tableQueueId) {
  if (tableQueueId == null) return;

  const tqData = await TableQueue.findById(tableQueueId);
  if (tqData) return tqData;

  return await TableQueue.create({ _id: tableQueueId, table: "", queue: "" });
}

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("get-card-data", async (roomId) => {
    console.log("ID: ", roomId);

    const tqData = await findOrCreateEntry(roomId);

    socket.join(roomId);
    socket.emit("load-card-data", tqData);

    socket.on("send-changes", (text) => {
      // Broadcast the updated text to all clients with the same id
      socket.broadcast.to(roomId).emit("receive-changes", text);
    });

    socket.on("move-card", ({ id, row, col }) => {
      socket.broadcast.to(roomId).emit("card-moved", { id, row, col });
    });

    socket.on("remove-card", ({ id, row, col }) => {
      socket.broadcast.to(roomId).emit("card-removed", { id, row, col });
    });

    socket.on("swap-card", ({ destID, sourceID, sourceRow, sourceCol }) => {
      socket.broadcast
        .to(roomId)
        .emit("card-swapped", { destID, sourceID, sourceRow, sourceCol });
    });

    socket.on("save-card-data", async ({ table, queue }) => {
      await TableQueue.findByIdAndUpdate(roomId, { table, queue });
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
