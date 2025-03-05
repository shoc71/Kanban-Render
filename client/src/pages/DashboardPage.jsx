import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("user_id");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Check if there's a valid user ID and JWT token in localStorage before fetching tasks
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (!userId || !token) return; // Avoid fetching if no user or token is available

    fetch(`/api/tasks?user_id=${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,  // Use the token from localStorage for auth
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
    }, [userId]); // Depend on userId for re-fetching tasks if it changes

  const addTask = async () => {
    const userId = localStorage.getItem("user_id");
    console.log("user_id before sending task:", userId);  // Should not be null
    if (!newTask.trim()) return;

    if (!userId) {
      console.error("User ID is missing. Cannot add task.");
      return;  // Don't proceed without user ID
    }

    const task = { title: newTask, status: "To-Do", user_id: userId };
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,  // Use the token from localStorage
        },
        body: JSON.stringify(task),
      });
      if (res.ok) {
      const newTaskFromDB = await res.json();
      setTasks([...tasks, newTaskFromDB]);
      setNewTask("");
    } else {
      const errorData = await res.json();
      console.error("Error adding task:", errorData.message);
    }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,  // Add the token here
        },
      });
      setTasks(tasks.filter((task) => task.id !== id));
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
    const newStatus = direction === "forward" ? statusMap["To-Do"] : statusMap["Done"];
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Add the token here
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedTask = await res.json();
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
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
