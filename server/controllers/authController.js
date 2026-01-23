const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGN UP
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered. Please login.",
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // 4️⃣ Send clean response (NO password)
    res.status(201).json({
      message: "Signup successful",
      userId: user._id,
    });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered. Please login.",
      });
    }
    
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ msg: "No user found" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" }); // Fixed: was checking !user instead of !match

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};