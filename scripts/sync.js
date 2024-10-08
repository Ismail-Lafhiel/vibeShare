const sequelize = require("../config/database");
const User = require("../models/User");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const ArticleLikes = require('../models/ArticleLikes');

async function syncDatabase() {
  try {
    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Sync the models
    await sequelize.sync({ force: true });
    console.log("Database synced");

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (err) {
    console.error("Sync error:", err);
  }
}

// Export the sync function
module.exports = syncDatabase;
