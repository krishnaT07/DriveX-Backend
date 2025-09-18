const mongoose = require('mongoose');

function connectToDb() {
  const mongoUri = process.env.MONGO_URI; // Make sure this matches your Render env variable
  if (!mongoUri) {
    console.error('Error: MONGO_URI is not defined in environment variables!');
    process.exit(1);
  }

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

module.exports = connectToDb;
