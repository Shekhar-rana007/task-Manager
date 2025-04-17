const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      required: [true, "Please enter an email"],
      type: String,
      unique: true,
    },
    action: {
      isActive: { type: Boolean, default: true },
      isDeleted: { type: Boolean, default: false },
    },
    name: {
      required: [true, "Please enter a name"],
      type: String,
    },
    phone: {
      required: [true, "Please enter a phone number"],
      type: String,
    },
    password: {
      required: [true, "Please enter a password"],
      type: String,
    },
    role: {
      required: true,
      enum: ["user", "admin"],
      default: "user",
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
