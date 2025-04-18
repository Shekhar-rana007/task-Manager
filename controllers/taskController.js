const taskModel = require("../models/taskModel");
const mongoose = require("mongoose");

// create task
const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, createdBy } = req.body;
    if (!title || !description || !status || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "all the details are required",
      });
    }
    const task = await taskModel.create({
      title,
      description,
      status,
      dueDate,
      createdBy: new mongoose.Types.ObjectId(createdBy),
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
// get all tasks of all users with populate user details
const getTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find({ isDeleted: false }).populate({
      path: "createdBy",
      select: "name email phone",
      match: { "action.isDeleted": false },
    });
    if (!tasks) {
      return res.status(400).json({
        success: false,
        message: "your task system is blank please add some tasks first",
      });
    }
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// paginate task
const paginateTasks = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const totalTasks = await taskModel.countDocuments({ isDeleted: false });
    const tasks = await taskModel
      .find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
      tasks,
    });
  } catch (error) {
    console.error("Pagination Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
// update task
const updateTask = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { isDeleted, dueDate, status, description, title } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Please provide a task ID",
        success: false,
      });
    }

    const newBody = {};
    if (typeof isDeleted === "boolean") newBody.isDeleted = isDeleted;
    if (dueDate) newBody.dueDate = dueDate;
    if (status) newBody.status = status;
    if (description) newBody.description = description;
    if (title) newBody.title = title;

    const task = await taskModel.findById(id);

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      (!task.createdBy || task.createdBy.toString() !== userId.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { $set: newBody },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const filterTasks = async (req, res) => {
  try {
    const { status, createdBy, title, dueDate } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;
    if (title) filter.title = { $regex: title, $options: "i" };
    if (dueDate) {
      const date = new Date(dueDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      filter.dueDate = {
        $gte: date,
        $lt: nextDay,
      };
    }

    const tasks = await taskModel.find(filter);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// soft delete task
const deleteTask = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a task ID",
      });
    }

    const task = await taskModel.findById(id);

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      (!task.createdBy || task.createdBy.toString() !== userId.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    task.isDeleted = true;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteTaskPermanently = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a task ID",
      });
    }

    const task = await taskModel.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      (!task.createdBy || task.createdBy.toString() !== userId.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await taskModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  deleteTaskPermanently,
  updateTask,
  deleteTask,
  filterTasks,
  paginateTasks,
};
