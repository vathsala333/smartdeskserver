import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: String, // user | agent
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: String,
    description: String,

    category: String,
    priority: String,
    sentiment: String,

    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open"
    },

    // ✅ REPLACED reply with messages
    messages: [messageSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
