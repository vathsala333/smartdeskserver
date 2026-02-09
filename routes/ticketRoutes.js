import express from "express";
import Ticket from "../models/Ticket.js";
import auth from "../middleware/authMiddleware.js";
import {
  analyzeTicket,
  generateReply
} from "../controllers/aiController.js";

const router = express.Router();


// ======================================================
// CREATE TICKET + AI FIRST REPLY
// ======================================================
router.post("/", auth, async (req, res) => {
  try {
    const description = req.body.description || req.body.title;

    // 1️⃣ classify
    const ai = await analyzeTicket(description);

    // 2️⃣ create ticket
    const ticket = await Ticket.create({
      title: description,
      description,
      ...ai,
      user: req.user.id,
      status: "open",
      messages: [
        { sender: "user", text: description }
      ]
    });

    // 3️⃣ generate REAL reply (FIXED)
    const replyText = await generateReply(description);

    ticket.messages.push({
      sender: "agent",
      text: replyText
    });

    ticket.status = "in-progress";

    await ticket.save();

    res.json(ticket);

  } catch (err) {
    console.error(err);
    res.status(500).json("Ticket creation failed");
  }
});


// ======================================================
// GET (search + filter + pagination)
// ======================================================
router.get("/", auth, async (req, res) => {
  try {
    const { search, status, page = 1, limit = 5 } = req.query;

    const query = { user: req.user.id };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Ticket.countDocuments(query)
    ]);

    res.json({
      tickets,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });

  } catch (err) {
    res.status(500).json("Fetch failed");
  }
});


// ======================================================
// ADD MESSAGE + AI REPLY
// ======================================================
router.put("/:id/message", auth, async (req, res) => {
  try {
    const { text } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json("Ticket confirm not found");

    // save user message
    ticket.messages.push({
      sender: "user",
      text
    });

    ticket.status = "open";

    // 🔥 REAL AI reply (FIXED)
    const replyText = await generateReply(text);

    ticket.messages.push({
      sender: "agent",
      text: replyText
    });

    ticket.status = "in-progress";

    await ticket.save();

    res.json(ticket);

  } catch (err) {
    console.error(err);
    res.status(500).json("Message failed");
  }
});


// ======================================================
// CLOSE
// ======================================================
router.put("/:id/close", auth, async (req, res) => {
  const t = await Ticket.findByIdAndUpdate(
    req.params.id,
    { status: "closed" },
    { new: true }
  );

  res.json(t);
});


// ======================================================
// DELETE
// ======================================================
router.delete("/:id", auth, async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


export default router;
