const mongosse = require('mongoose');

async function connectDB(url) {
  try {
    await mongosse.connect(url);
  } catch (err) {
    throw err;
  }
}

module.exports = connectDB;
