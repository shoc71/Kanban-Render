import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("user_id");
  const isDarkMode = localStorage.getItem("darkmode") === "true";
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  useEffect(() => {
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (res.ok) {
        const { success, data } = await res.json();
        if (success) {
          setTasks((prevTasks) => [
            { ...data, id: data.id || Date.now() },
            ...prevTasks,
          ]);
          setNewTask("");
        }
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
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
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
          Authorization: `Bearer ${token}`,
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
        setEditingTaskId(null);
        setEditedTask("");
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
      <Row>
        {["To-Do", "In-Progress", "Done"].map((status) => (
          <Col
            key={status}
            md={4}
            className="mb-2"
            style={{ backgroundColor: getColumnBackgroundColor(status) }}
          >
            <h4 className="text-center text-white">{status}</h4>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <Card key={task.id} className="p-2">
                  <Card.Body>
                    {editingTaskId === task.id ? (
                      <Form.Control
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                      />
                    ) : (
                      <Card.Text>{task.title}</Card.Text>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => startEditing(task.id, task.title)}
                    >
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
