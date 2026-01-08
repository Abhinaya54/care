const User = require("../models/user"); // ✅ lowercase (Linux-safe)
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Simple GET /api/auth handler for health/info
exports.authInfo = (req, res) => {
  res.status(200).json({
    message: "Auth API is running",
    endpoints: ["POST /login", "POST /signup", "POST /register"]
  });
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Role validation (extra safety)
    if (!["government", "supervisor", "staff"].includes(role)) {
      return res.status(403).json({ message: "Role not authorized" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Success response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic || null
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// SIGNUP / REGISTER
exports.signup = async (req, res) => {
  try {
    const { name, email, gender, age, password, role, profilePic } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Role validation
    if (!["government", "supervisor", "staff"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        const user = new User({
          name,
          email,
          gender,
          age,
          password: hashedPassword,
          role,
          profilePic: profilePic || null
        });
    
        await user.save();
    
        // Generate JWT
        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
            name: user.name
          },
          process.env.JWT_SECRET,
          { expiresIn: "8h" }
        );
    
        res.status(201).json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic || null
          }
        });
      } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ message: "Server error" });
      }
    };