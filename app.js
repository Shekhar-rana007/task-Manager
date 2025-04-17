const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;
