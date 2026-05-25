import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/jwt.js";
import { Analyst } from "../models/index.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await Analyst.findOne({ where: { email: cleanEmail } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_style: user.avatar_style,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error.message);
    res.status(500).json({ message: "Failed to login" });
  }
};

const me = async (req, res) => {
  try {
    const user = await Analyst.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_style: user.avatar_style,
      },
    });
  } catch (error) {
    console.error("me error:", error.message);
    return res.status(500).json({ message: "Failed to get user" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { avatar_style } = req.body;

    const validStyles = [
      "bottts",
      "adventurer",
      "avataaars",
      "personas",
      "notionists",
      "open-peeps",
      "pixel-art",
      "shapes",
      "lorelei",
      "micah",
    ];
    if (!validStyles.includes(avatar_style)) {
      return res.status(400).json({ message: "Invalid avatar style" });
    }

    await Analyst.update({ avatar_style }, { where: { id: req.user.id } });

    const user = await Analyst.findOne({ where: { id: req.user.id } });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_style: user.avatar_style,
      },
    });
  } catch (error) {
    console.error("updateProfile error:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
};

export { loginUser, me, logoutUser, updateProfile };
