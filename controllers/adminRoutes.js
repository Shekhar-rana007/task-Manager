const userModel = require("../models/userModel");

const getAllUser = async (req, res) => {
  try {
    const users = await userModel
      .find({ "action.isDeleted": false })
      .select("-password");
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching users",
        error: err.message,
      });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(id, updates, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User updated", user: updatedUser });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Update failed", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByIdAndUpdate(
      id,
      { "action.isDeleted": true, "action.deletedAt": new Date() },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User soft-deleted", user });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Delete failed", error: err.message });
  }
};

const permanentDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User permanently deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Permanent delete failed",
        error: err.message,
      });
  }
};

const getDeleUser = async (req, res) => {
  try {
    const deletedUsers = await userModel
      .find({ "action.isDeleted": true })
      .select("-password");
    return res.status(200).json({ success: true, users: deletedUsers });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching deleted users",
        error: err.message,
      });
  }
};

module.exports = {
  getAllUser,
  updateUser,
  deleteUser,
  permanentDelete,
  getDeleUser,
};
