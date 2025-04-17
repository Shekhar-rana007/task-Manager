const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    const newUser = new userModel({ name, email, password, phone });
    await newUser.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (err) {
    return res.status(500).json({
      message: "Registration failed",
      error: err.message,
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", success: false });
    }

    const user = await userModel.findOne({ email });
    if (!user || user.action.isDeleted) {
      return res
        .status(404)
        .json({ message: "User not found or deleted", success: false });
    }

    const isMatch = await user.comparePassword(password);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message, success: false });
  }
};

module.exports = { registerUser, loginUser };



