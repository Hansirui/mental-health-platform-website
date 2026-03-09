const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.json");

function readDB() {
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return { records: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  readDB,
  writeDB,
};