const mongoose = require('mongoose');
const dns = require('dns');

// On Windows, resolve MongoDB Atlas SRV records reliably using public DNS
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    // Ignore if custom DNS cannot be set
  }
}

const connectDb = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/twitterclone';

  if (!process.env.MONGO_URI) {
    console.warn(
      '⚠️ WARNING: MONGO_URI environment variable is not defined. Falling back to localhost:27017. ' +
      'If you are deploying on Render, please add MONGO_URI in your Render Dashboard -> Environment.'
    );
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
};

module.exports = connectDb;
