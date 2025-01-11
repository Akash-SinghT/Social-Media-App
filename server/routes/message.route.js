import { getMessage, sendMessage } from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import express from "express";
const router = express.Router();
router.post("/sendmessage/:id", isAuthenticated, sendMessage);
router.get("/getmessage/:id", isAuthenticated, getMessage);
export default router;
