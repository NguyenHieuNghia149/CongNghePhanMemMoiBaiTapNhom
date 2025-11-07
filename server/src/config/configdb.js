const mongoose = require('mongoose');
const config = require('./config.json');

const env = process.env.NODE_ENV || 'development';
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/baitapnhom1';

async function connectDB() {
  try {
    await mongoose.connect(uri, { autoIndex: true });
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
  }
}

module.exports = connectDB;
