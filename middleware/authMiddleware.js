import jwt from "jsonwebtoken";

export default function (req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header)
      return res.status(401).json("No token");

    // ✅ Expect: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const token = header.split(" ")[1];

    if (!token)
      return res.status(401).json("Token malformed");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json("Invalid or expired token");
  }
}
