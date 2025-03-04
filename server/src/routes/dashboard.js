const router = require("express").Router();
const pool = require("../config/db");
const authorizeUser = require("../middleware/authorizingUser");

// get all tasks for logged-in users

router.get('/', authorizeUser, async (req, res) => {
    try {
        // res.json(req.user);

        const user = await pool.query("SELECT * FROM users WHERE user_id = $1",
            [req.user.id]
        );

        res.status(200).json({ success: true, data: result.rows })

    } catch (error) {
        console.error("Error fetching tasks:", error.message)
        res.status(500).json({ success: false, message: `Failed to fetch tasks: ${error}` });
    }
});

// POST to create a new task
router.post("/", async (req, res) => {
    const { title, status, userId } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO tasks (title, status, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, status, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// PUT to update task status
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            "UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating task status:", err);
        res.status(500).json({ error: "Failed to update task" });
    }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

module.exports = router;