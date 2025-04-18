# Task Manager API

A simple task manager built using **Node.js**, **Express**, and **MongoDB**. It lets users register, log in, manage their tasks, and get email reminders before their tasks are due.

## Features

- User registration & login (JWT auth)
- Create, update, delete tasks
- Only admins can see all tasks, users see their own
- Sends email reminders 10 mins before a task is due
- API to manually send emails

## Tech Used

- Node.js
- Express
- MongoDB + Mongoose
- JWT for login tokens
- Bcrypt to hash passwords
- Nodemailer (uses Ethereal for testing)
- node-cron to schedule reminders
- dotenv for environment config

## How to Use

1. Clone this project and install dependencies:

```bash
git clone https://github.com/Shekhar-rana007/task-Manager.git
cd task-manager-api
npm install
```
