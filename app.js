const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const mailRoutes = require("./routes/emailRoutes");
require("./jobs/overdueReminder");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api/email", mailRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;
