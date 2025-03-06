import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("user_id");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");
   const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");

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

    const task = { title: newTask, status: "To-Do", user_id: userId };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Use token for authorization
        },
        body: JSON.stringify(task),
      });

      if (res.ok) {
        const newTaskFromDB = await res.json();
        setTasks((prevTasks) => [newTaskFromDB, ...prevTasks]); // Add new task directly to state
        setNewTask(""); // Reset input field
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

  const editTask = async (id) => {
    const token = localStorage.getItem("token");

    if (!editedTask.trim()) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editedTask }),
      });

      const updatedData = await res.json();
      if (updatedData.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, title: editedTask } : task
          )
        );
        setEditingTaskId(null); // Exit edit mode
      } else {
        console.error("Error updating task:", updatedData.message);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const startEditing = (id, currentTitle) => {
    setEditingTaskId(id);
    setEditedTask(currentTitle);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title && task.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container className="mt-4 min-vh-100">
      <h2 className="text-center">Welcome, {username}!</h2>
      <p className="text-center">
        Sometimes adding tasks don't update on-screen (immediately). Hit the
        darkmode button in topright to refresh.
      </p>
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
          <Col
            key={status}
            md={4}
            style={{ backgroundColor: getColumnBackgroundColor(status) }}
          >
            <h4 className="text-center bg-dark text-white">{status}</h4>
            {filteredTasks
              .filter((task) => task.status === status)
              .map((task) => (
                <Card key={task.id} className="mb-2 p-2">
                  <Card.Body>
                    {editingTaskId === task.id ? (
                      <Form.Control
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        onBlur={() => editTask(task.id)} // Update on blur
                        autoFocus
                      />
                    ) : (
                      <Card.Text>{task.title}</Card.Text>
                    )}
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
                      {editingTaskId === task.id ? (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => editTask(task.id)}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => startEditing(task.id, task.title)}
                        >
                          Edit
                        </Button>
                      )}
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
