const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  deleteTaskPermanently,
} = require("../controllers/taskController");

const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, createTask);

router.get("/getalltasks", getTasks);

router.put("/update/:id/:userId", verifyToken, updateTask);

router.delete("/softdelete/:id/:userId", verifyToken, deleteTask);
router.delete("/deleteTaskPermanently/:id/:userId", verifyToken, deleteTaskPermanently);

module.exports = router;
