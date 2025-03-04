const express = require("express");
const router = express.Router();
const pool = require("../config/db")

// 📌 Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, status } = req.body;
    const newTask = await pool.query(
      "INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *",
      [title, status || "To-Do"]
    );
    res.json({ success: true, data: newTask.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json({ success: true, data: tasks.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Update task status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, data: updatedTask.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTask = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    if (deleteTask.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
