const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = `mongodb+srv://${
  process.env.MONGO_USERNAME
}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_HOST}/${
  process.env.MONGO_DB_NAME
}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
