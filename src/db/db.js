const mongoose = require("mongoose");

function connectToDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Error: MONGO_URI is not defined in environment variables!");
    process.exit(1);
  }

  mongoose
    .connect(mongoUri) // no options required
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
}

module.exports = connectToDb;
