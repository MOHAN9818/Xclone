const mongoose = require('mongoose');

const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/twitterclone');
  console.log('MongoDB connected');
};

module.exports = connectDb;
