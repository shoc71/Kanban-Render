const express = require("express");
const router = express.Router();
const Task = require("../models"); 
const authorizeUser = require("../middleware/authorizingUser"); // Ensure authentication

// 📌 Create a new task (Protected Route)
router.post("/", authorizeUser, async (req, res) => {
  try {
    const { title, status } = req.body;
    if (!title || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const validStatuses = ["To-Do", "In-Progress", "Done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const newTask = await Task.create({ title, status, user_id: req.user.id });
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    console.error("Error creating task:", error.stack);
    res.status(500).json({ success: false, message: "Internal Server Error: Could not create task" });
  }
});

// 📌 Get tasks for a specific user (Protected Route)
router.get("/", authorizeUser, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { user_id: req.user.id } });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error.stack);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Update task status (Protected Route)
router.put("/:id", authorizeUser, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["To-Do", "In-Progress", "Done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    task.status = status;
    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    console.error("Error updating task:", error.stack);
    res.status(500).json({ success: false, message: "Error updating task status" });
  }
});

// 📌 Delete a task (Protected Route)
router.delete("/:id", authorizeUser, async (req, res) => {
  try {
    const deletedTask = await Task.destroy({ where: { id: req.params.id, user_id: req.user.id } });
    if (!deletedTask) return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error.stack);
    res.status(500).json({ success: false, message: "Error deleting task" });
  }
});

module.exports = router;
