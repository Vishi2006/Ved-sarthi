const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET in server .env");

  return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
};

const register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, password are required" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({
    name: String(name),
    email: String(email).toLowerCase(),
    password: String(password),
  });

  const token = signToken(user._id.toString());
  return res.status(201).json({ token, user: user.toSafeJSON() });
};

const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  const ok = await user.comparePassword(String(password));
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = signToken(user._id.toString());
  return res.json({ token, user: user.toSafeJSON() });
};

const me = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user: user.toSafeJSON() });
};

module.exports = { register, login, me };
