const cron = require("node-cron");
const Task = require("../models/taskModel");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const tenMinLater = new Date(now.getTime() + 10 * 60 * 1000);
    console.log("Cron job for overdue reminders is running...");

    const tasks = await Task.find({
      isDeleted: false,
      isMailSent: false,
      dueDate: { $gte: now, $lte: tenMinLater },
    }).populate("createdBy", "email");

    for (let task of tasks) {
      const userEmail = task.createdBy?.email;
      if (!userEmail) continue;
      const subject = `Reminder: Task "${task.title}" is almost due!`;
      const message = `Your task "${
        task.title
      }" is due at ${task.dueDate.toLocaleString()}`;

      await sendEmail(userEmail, subject, message);

      task.isMailSent = true;
      await task.save();
    }

    if (tasks.length > 0) {
      console.log(`Sent reminders for ${tasks.length} task(s)`);
    }
  } catch (err) {
    console.error("Cron Job Error:", err.message);
  }
});

