
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// Connect to DB before handling requests
let isDbConnected = false;

async function ensureDbConnected() {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
}

module.exports = async (req, res) => {
  await ensureDbConnected();
  app(req, res);
};
