const express = require("express");
const cors = require("cors");
const { readDB, writeDB } = require("./utils");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running." });
});

// 获取全部记录
app.get("/records", (req, res) => {
  const db = readDB();
  res.json(db.records);
});

// 获取最近一条记录
app.get("/records/latest", (req, res) => {
  const db = readDB();
  const latest = db.records[0] || null;
  res.json(latest);
});

// 根据 id 获取单条记录
app.get("/records/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const record = db.records.find((item) => item.id === id);

  if (!record) {
    return res.status(404).json({ message: "Record not found." });
  }

  res.json(record);
});

// 保存一条记录
app.post("/records", (req, res) => {
  const newRecord = req.body;

  if (!newRecord || !newRecord.id) {
    return res.status(400).json({ message: "Invalid record data." });
  }

  const db = readDB();
  db.records.unshift(newRecord);
  writeDB(db);

  res.status(201).json({
    message: "Record saved successfully.",
    record: newRecord,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});