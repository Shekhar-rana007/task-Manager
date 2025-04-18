const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  deleteTaskPermanently,
  filterTasks,
  paginateTasks,
} = require("../controllers/taskController");

const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, createTask);

router.get("/getalltasks", getTasks);

router.put("/update/:id/:userId", verifyToken, updateTask);

router.delete("/softdelete/:id/:userId", verifyToken, deleteTask);
router.delete("/deleteTaskPermanently/:id/:userId", verifyToken, deleteTaskPermanently);
router.get("/filter", verifyToken, filterTasks);
router.get('/paginate', paginateTasks);
module.exports = router;
