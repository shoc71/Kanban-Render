import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("user_id"); // Ensuring user ID is used

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");

  // Fetch tasks for the logged-in user
  useEffect(() => {
    if (!userId) return; // Avoid fetching if no user is logged in

    fetch(`/api/tasks?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTasks(data.data);
        } else {
          console.error("Error fetching tasks:", data.message);
        }
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [userId]);

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return;

    const task = { title: newTask, status: "To-Do", user_id: userId };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      if (data.success) {
        setTasks([...tasks, data.data]);
        setNewTask("");
      } else {
        console.error("Error adding task:", data.message);
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        console.error("Error deleting task:", data.message);
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Update task status
  const updateTaskStatus = async (id, currentStatus, direction) => {
    const statusMap = {
      "To-Do": "In-Progress",
      "In-Progress": "Done",
      "Done": "To-Do",
    };

    const newStatus =
      direction === "forward"
        ? statusMap[currentStatus]
        : currentStatus === "To-Do"
        ? "Done"
        : "To-Do";

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)));
      } else {
        console.error("Error updating task:", data.message);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Filter tasks by keyword
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container className="mt-4 min-vh-100">
      <h2 className="text-center">Welcome, {username}!</h2>

      {/* Task Input */}
      <Form className="mt-4 d-flex">
        <Form.Control
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button onClick={addTask} className="ms-2">
          Add Task
        </Button>
      </Form>

      {/* Filter Input */}
      <div className="mt-3">
        <Form.Label>
          <strong>Filter tasks using keywords:</strong>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Type to filter tasks..."
          className="mb-3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Task Columns */}
      <Row>
        {["To-Do", "In-Progress", "Done"].map((status) => (
          <Col key={status} md={4} style={{ backgroundColor: getColumnBackgroundColor(status) }}>
            <h4 className="text-center">{status}</h4>
            {filteredTasks
              .filter((task) => task.status === status)
              .map((task) => (
                <Card key={task.id} className="mb-2 p-2">
                  <Card.Body>
                    <Card.Text>{task.title}</Card.Text>
                    <div className="d-flex justify-content-between">
                      {status !== "To-Do" && (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => updateTaskStatus(task.id, task.status, "backward")}
                        >
                          &larr; Back
                        </Button>
                      )}
                      {status !== "Done" && (
                        <Button
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, task.status, "forward")}
                        >
                          Move Forward &rarr;
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

// Function to get background color based on task status
const getColumnBackgroundColor = (status) => {
  switch (status) {
    case "To-Do":
      return "#f0f8ff"; // Light Blue
    case "In-Progress":
      return "#fffacd"; // Light Yellow
    case "Done":
      return "#d3ffd3"; // Light Green
    default:
      return "#ffffff";
  }
};

export default Dashboard;
