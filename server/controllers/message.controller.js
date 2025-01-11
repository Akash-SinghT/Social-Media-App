import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id; // logged in user
    const receiverId = req.params.id; // receiver id
    const { message } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }, // will check if any past conversation happend or not in participants array
    });
    // establish the conversation if not started yet
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId], // got the id's
      });
    }
    const newMessage = await Message.create({
      // creatd message
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id); // pushing new message in messages array
    await Promise.all([conversation.save(), newMessage.save()]); // ek document ko multiple time handle krna hi to promise

    // implement socket io for real time data transfer

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", sucess: false });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.find({
      participants: { $all: [senderId, receiverId] }, // find conversation if happend
    });

    if (!conversation)
      return res.status(200).json({
        // if not return nul
        success: true,
        messages: [],
      });

    return res.status(200).json({
      success: true,
      messages: conversation?.messages, // if conversation happened then return the messages
    });
    //The ?. is the optional chaining operator, which ensures that if conversation is null or undefined,
    //  it won't throw an error but instead return undefined.
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", sucess: false });
  }
};
