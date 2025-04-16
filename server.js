const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("join", room => {
    socket.join(room);
    socket.to(room).emit("user-joined", socket.id);
  });

  socket.on("signal", ({ room, data }) => {
    socket.to(room).emit("signal", { id: socket.id, data });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Signaling server running on port", PORT);
});