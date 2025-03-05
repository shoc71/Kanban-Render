const express = require("express");
const router = express.Router();
const { Task } = require("../models/tasks"); // Import the Task model
const { Sequelize } = require('sequelize');

// 📌 Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, status, user_id } = req.body;  // Assuming user_id is also passed for associating with a user

    if (!title || !status || !user_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Create a new task using Sequelize
    const newTask = await Task.create({
      title,
      status: status || "To-Do",  // Default status is 'To-Do'
      user_id  // Assuming we are associating a user with the task
    });

    res.json({ success: true, data: newTask });
  } catch (err) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// 📌 Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      order: [["id", "ASC"]],  // Order by task ID ascending
    });
    res.json({ success: true, data: tasks });
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

    // Update the task's status using Sequelize
    const updatedTask = await Task.update(
      { status },  // Update status field
      { where: { id }, returning: true, plain: true }  // Use `returning: true` to get the updated task
    );

    if (updatedTask[0] === 0) {  // If no rows were affected, task wasn't found
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: updatedTask[1] });  // Return the updated task
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 📌 Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the task using Sequelize
    const deletedTask = await Task.destroy({
      where: { id }
    });

    if (deletedTask === 0) {  // If no rows were deleted, task wasn't found
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
