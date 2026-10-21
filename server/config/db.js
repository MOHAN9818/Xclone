const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers to resolve MongoDB Atlas SRV records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // Ignore if custom DNS cannot be set
}

const connectDb = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/twitterclone';
  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
};

module.exports = connectDb;
