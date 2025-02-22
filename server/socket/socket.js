import { Server } from "socket.io"; // import server
import express from "express";
import http from "http"; // default http

const app = express();

const server = http.createServer(app); // creating a  express http server

const io = new Server(server, {
  // new instance of server
  cors: {
    // need a parse a url so cors policy can be avoided
    origin: process.env.URL, // origin
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // this map stores socket id corresponding the user id; userId -> socketId  user ki socket id rakhne ke liye ek object me

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]; // getting receiver id from socket function

io.on("connection", (socket) => {
  // setting a io connection
  const userId = socket.handshake.query.userId; // getting user id  when he enters in application or connect with app
  if (userId) {
    userSocketMap[userId] = socket.id; // user logged in hai when get user id and putting it inside socket map
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // disconneting connection
    if (userId) {
      delete userSocketMap[userId]; // deleting user id from map
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // emit-> listen getOnlineUsers event from client and return key value pair inside socket map
  });
});

export { app, server, io };
