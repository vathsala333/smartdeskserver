import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

import ticketRoutes from "./routes/ticketRoutes.js";
import aiRoutes from "./routes/aiRoutes.js"; // ✅ ADD THIS

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://smartdeskclient.netlify.app"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
//app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/ai", aiRoutes); // ✅ ADD THIS
app.use("/api/auth", authRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
