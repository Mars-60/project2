const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dns = require('dns').promises;
const disposableDomains = require('disposable-email-domains');

// Email format validation
const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return emailRegex.test(email);
};

// Email existence validation (disposable check + MX record)
const validateEmailExists = async (email) => {
  const domain = email.split('@')[1].toLowerCase();

  if (disposableDomains.includes(domain)) {
    return { valid: false, reason: 'Disposable email addresses are not allowed' };
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, reason: 'Email domain does not exist' };
    }
  } catch {
    return { valid: false, reason: 'Email domain does not exist or cannot receive emails' };
  }

  return { valid: true };
};

// Password validation
const validatePassword = (password) => {
  return password && password.length >= 4;
};

// SIGN UP
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!validateEmailFormat(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be at least 4 characters" });
    }

    // Check email actually exists
    const emailCheck = await validateEmailExists(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.reason });
    }

    // Check if already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered. Please login." });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Auto-login: generate token immediately after signup
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: "Signup successful!",
      token,
      email: user.email,
    });

  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered. Please login." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!validateEmailFormat(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, email: user.email });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};