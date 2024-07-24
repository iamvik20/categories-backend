const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }).lean();
    console.log(user.name);

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const token = jwt.sign(
      { userId: user._id, userName: user.name, userType: user.userType },
      process.env.JWT_SECRET
    );

    res.json({ jwt: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json({ message: "Error logging in!", err: error.message });
  }
});

module.exports = router;
