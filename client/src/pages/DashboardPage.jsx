import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("user_id");
  const isDarkMode = localStorage.getItem("darkmode");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [taskEdits, setTaskEdits] = useState({}); // Store edited tasks separately
  const [showAutoSaveAlert, setShowAutoSaveAlert] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    // Fetch tasks only if there's a valid user ID and token
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    fetch(`/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTasks(data.data);
          localStorage.setItem("tasks", JSON.stringify(data.data));
        } else {
          console.error("Error fetching tasks:", data.message);
        }
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      setShowAutoSaveAlert(true);
      setTimeout(() => setShowAutoSaveAlert(false), 3000); // Alert disappears after 3 seconds
    }, 20000); // Every 20 seconds

    return () => clearInterval(interval);
  }, [tasks]);

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
          Authorization: `Bearer ${token}`, // Use token for "Authorization"
        },
        body: JSON.stringify(task),
      });

      const updatedData = await res.json();

      if (updatedData.success) {
        setTasks((prevTasks) => [...prevTasks, updatedData.data]); // Update state with new task
        setNewTask(""); // Clear input
      } else {
        console.error("Error updating task:", updatedData.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const editTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!taskEdits[id]?.trim() || !token) return;

    if (!token) {
      console.error("No token found in localStorage!");
      return;
    }

    // console.log("Sending token:", token); // Debugging line

    if (!editedTask.trim()) return;

    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskEdits[id], status: currentTask.status }),
      });

      const updatedData = await res.json();
      if (updatedData.success) {
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, title: taskEdits[id] } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem(
          "tasks",
          JSON.stringify(
            tasks.map((task) =>
              task.id === id ? { ...task, title: taskEdits[id] } : task
            )
          )
        );
        setEditingTaskId(null); // Exit edit mode
        setTaskEdits((prev) => {
          const updatedEdits = { ...prev };
          delete updatedEdits[id]; // Remove from edits after saving
          return updatedEdits;
        });
      } else {
        console.error("Error updating task:", updatedData.message);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include token for "Authorization"
        },
      });
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Remove deleted task from state
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const updateTaskStatus = async (id, direction) => {
    const statusMap = {
      "To-Do": "In-Progress",
      "In-Progress": "Done",
      Done: "To-Do",
    };

    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    const newStatus =
      direction === "forward"
        ? statusMap[currentTask.status]
        : Object.keys(statusMap).find(
            (key) => statusMap[key] === currentTask.status
          );

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedData = await res.json();
      if (updatedData.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
      } else {
        console.error("Error updating task:", updatedData.message);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const saveAllTasks = async () => {
    const promises = Object.keys(taskEdits).map((taskId) => editTask(taskId));
    await Promise.all(promises);
  };

  const getColumnBackgroundColor = (status) => {
    const lightModeColors = {
      "To-Do": "#f0f8ff",
      "In-Progress": "#fffacd",
      Done: "#d3ffd3",
    };
    const darkModeColors = {
      "To-Do": "#2c3e50",
      "In-Progress": "#f39c12",
      Done: "#27ae60",
    };
    return isDarkMode ? darkModeColors[status] : lightModeColors[status];
  };

  const startEditing = (id, currentTitle) => {
    setEditingTaskId(id);
    setTaskEdits((prev) => ({ ...prev, [id]: currentTitle }));
  };

  const filteredTasks = tasks.filter(
    (task) =>
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
      <Button className="mb-3" onClick={saveAllTasks} variant="info">
        Save All Changes
      </Button>
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
                        onChange={(e) =>
                          setTaskEdits((prev) => ({
                            ...prev,
                            [task.id]: e.target.value,
                          }))
                        }
                        onBlur={() => editTask(task.id)} // Update on blur
                        autoFocus
                      />
                    ) : (
                      <Card.Text>{task.title}</Card.Text>
                    )}
                    {/* <Card.Text>{task.title}</Card.Text> */}
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
      {showAutoSaveAlert && (
        <Alert
          variant="success"
          className="position-fixed top-0 start-50 translate-middle-x"
        >
          Your work has been auto-saved and will continue to do so every 30
          seconds.
        </Alert>
      )}
    </Container>
  );
};

// const getColumnBackgroundColor = (status) => {
//   switch (status) {
//     case "To-Do":
//       return "#f0f8ff"; // Light Blue
//     case "In-Progress":
//       return "#fffacd"; // Light Yellow
//     case "Done":
//       return "#d3ffd3"; // Light Green
//     default:
//       return "#ffffff";
//   }
// };

export default Dashboard;
