/* const mongoose = require("mongoose");
const Document = require("./Document");

mongoose.connect("mongodb://localhost:27017/test-db");
mongoose.connection
  .once("open", () => console.log("Connected to MongoDB"))
  .on("error", (error) => {
    console.warn("Warning: error connecting to MongoDB:", error);
  }); */

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
/* const defaultData = "";

async function findOrCreate(documentId) {
  if (documentId == null) return;

  const doc = await Document.findById(documentId);
  if (doc) return doc;

  return await Document.create({ _id: documentId, data: defaultData });
} */

io.on("connection", (socket) => {
  console.log("User connected");

  /* socket.on("get-document", async (id) => {
    console.log("ID: ", id);

    const document = await findOrCreate(id);

    socket.join(id);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (text) => {
      // Broadcast the updated text to all clients with the same id
      socket.broadcast.to(id).emit("receive-changes", text);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(id, { data });
    });
  }); */

  socket.on("move-card", ({ row, col }) => {
    console.log("card moved");
    socket.broadcast.emit("card-moved", { row, col });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
