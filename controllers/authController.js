import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================
// helpers
// ============================
const createAccessToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (id) => {
  if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET missing");
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// ============================
// REGISTER
// ============================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json("All fields required");

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json("Email already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
    });

    res.json({
      accessToken: createAccessToken(user._id),
      refreshToken: createRefreshToken(user._id),
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json("Server error");
  }
};

// ============================
// LOGIN
// ============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json("Email & password required");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json("Invalid credentials");

    res.json({
      accessToken: createAccessToken(user._id),
      refreshToken: createRefreshToken(user._id),
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json("Server error");
  }
};

// ============================
// REFRESH
// ============================
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json("No token");

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    res.json({
      accessToken: createAccessToken(decoded.id),
    });

  } catch (err) {
    console.error("REFRESH ERROR:", err);
    res.status(401).json("Session expired");
  }
};
