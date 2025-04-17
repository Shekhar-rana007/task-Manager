const express = require("express");
const {
  getAllUser,
  deleteUser,
  updateUser,
  permanentDelete,
  getDeleUser,
} = require("../controllers/adminRoutes");

const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/users", verifyToken, authorizeRoles("admin"), getAllUser);
router.put("/user/:id", verifyToken, authorizeRoles("admin"), updateUser);
router.delete("/user/:id", verifyToken, authorizeRoles("admin"), deleteUser);
router.delete(
  "/user/permanent/:id",
  verifyToken,
  authorizeRoles("admin"),
  permanentDelete
);
router.get("/deleted-users", verifyToken, authorizeRoles("admin"), getDeleUser);

module.exports = router;
