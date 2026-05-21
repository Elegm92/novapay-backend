import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/jwt.js";

const mockUsers = [
  {
    id: "1",
    name: "Ana García",
    email: "analyst@novapay.com",
    password: "$2b$10$uHyl5O.H/BDTK3qHDwnpGO3N2uvj39XX6cDOO7otque3X.G.YWrRq", // 1234
    role: "analyst",
  },
];

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

    const user = mockUsers.find((u) => u.email === cleanEmail);

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
      },
    });
  } catch (error) {
    console.error("loginUser error:", error.message);
    res.status(500).json({ message: "Failed to login" });
  }
};

const me = async (req, res) => {
  try {
    const user = mockUsers.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("me error:", error.message);
    return res.status(500).json({ message: "Failed to get user" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
};

export { loginUser, me, logoutUser };
