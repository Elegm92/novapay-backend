const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body; // Mock temporal hasta tener bbdd

  if (email === "analyst@novapay.com" && password === "1234") {
    return res.json({
      message: "Login successful",
      user: {
        id: "1",
        name: "Ana García",
        email: "analyst@novapay.com",
        role: "analyst",
      },
      token: "mock_token_123",
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;
