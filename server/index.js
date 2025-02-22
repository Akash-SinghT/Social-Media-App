import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // 🔥 Fix: Capital 'P' in 'cookieParser'
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js"; // Getting express app from socket.js

// ✅ Load environment variables first
dotenv.config();

// ✅ Connect to Database
connectDB();

// ✅ Middleware (Order Matters)
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies

// ✅ CORS Configuration
app.use(
  cors({
    origin: process.env.URL,
    credentials: true,
  })
);

// ✅ Define API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// ✅ Serve Frontend (Vite/React)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
