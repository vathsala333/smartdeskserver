import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// ============================
// helpers
// ============================
const createAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const createRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });


// ============================
// REGISTER
// ============================
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json("Email already exists");

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash
  });

  res.json({
    accessToken: createAccessToken(user._id),
    refreshToken: createRefreshToken(user._id)
  });
};


// ============================
// LOGIN
// ============================
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json("Invalid credentials");

  res.json({
    accessToken: createAccessToken(user._id),
    refreshToken: createRefreshToken(user._id)
  });
};


// ============================
// REFRESH (silent login)
// ============================
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccess = createAccessToken(decoded.id);

    res.json({ accessToken: newAccess });
  } catch {
    res.status(401).json("Session expired");
  }
};
