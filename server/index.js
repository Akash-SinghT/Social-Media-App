import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import path from "path";
const app = express();
app.use(express.json());
app.use(cookieparser()); // parses cookies attach attch to client request conver cookie parse data inta js object
dotenv.config();
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const __dirname = path.resolve();
// api ayengi idhr
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/user", messageRoute);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Listen To ${PORT}`);
});
