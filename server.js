import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";


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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
