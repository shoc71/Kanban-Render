import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("user_id");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Fetch tasks only if there's a valid user ID and token
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    fetch(`/api/tasks`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
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

  const addTask = async () => {
    const token = localStorage.getItem("token");

    if (!newTask.trim()) return;

    if (!userId) {
      console.error("User ID is missing. Cannot add task.");
      return;
    }

    // Optimistically update UI with a temporary task
    const tempId = Date.now(); // Temporary unique ID
    const tempTask = { id: tempId, title: newTask, status: "To-Do", created_at: new Date().toISOString() };

    setTasks((prevTasks) => [tempTask, ...prevTasks]); // Show task immediately
    setNewTask(""); // Clear input field

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Use token for authorization
        },
        body: JSON.stringify({ title: newTask, status: "To-Do", user_id: userId }),
      });

      if (res.ok) {
        const newTaskFromDB = await res.json();

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === tempId ? newTaskFromDB : task)) // Replace temp task with real one
        );
      } else {
        const errorData = await res.json();
        console.error("Error adding task:", errorData.message);

        // If API fails, remove the temporary task
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== tempId));
      }
    } catch (err) {
      console.error("Error adding task:", err);

      // If API fails, remove the temporary task
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== tempId));
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Include token for authorization
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // Remove deleted task from state
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const updateTaskStatus = async (id, direction) => {
    const statusMap = {
      "To-Do": "In-Progress",
      "In-Progress": "Done",
      "Done": "To-Do",
    };

    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    const newStatus =
      direction === "forward"
        ? statusMap[currentTask.status]
        : Object.keys(statusMap).find((key) => statusMap[key] === currentTask.status);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedData = await res.json();
      if (updatedData.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
        );
      } else {
        console.error("Error updating task:", updatedData.message);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title && task.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container className="mt-4 min-vh-100">
      <h2 className="text-center">Welcome, {username}!</h2>
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
      <Row>
        {["To-Do", "In-Progress", "Done"].map((status) => (
          <Col key={status} md={4} style={{ backgroundColor: getColumnBackgroundColor(status) }}>
            <h4 className="text-center bg-dark text-white">{status}</h4>
            {filteredTasks
              .filter((task) => task.status === status)
              .map((task) => (
                <Card key={task.id} className="mb-2 p-2">
                  <Card.Body>
                    <Card.Text>{task.title}</Card.Text>
                    <small className="text-muted">
                      Created: {new Date(task.created_at).toLocaleString()}
                    </small>
                    <div className="d-flex justify-content-between">
                      {status !== "To-Do" && (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => updateTaskStatus(task.id, "backward")}
                        >
                          &larr; Back
                        </Button>
                      )}
                      {status !== "Done" && (
                        <Button
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, "forward")}
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
