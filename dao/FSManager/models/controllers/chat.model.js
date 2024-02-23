import mongoose from "mongoose";

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true, max: 50 },
  message: { type: String, required: true, max: 100 },
});

const chatModel = mongoose.model(messagesCollection, messageSchema);

export default chatModel;