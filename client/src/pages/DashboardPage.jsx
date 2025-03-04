import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = { id: Date.now(), title: newTask, status: "To-Do" };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id, direction) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          if (direction === "forward") {
            return {
              ...task,
              status:
                task.status === "To-Do"
                  ? "In-Progress"
                  : task.status === "In-Progress"
                  ? "Done"
                  : "Done",
            };
          } else if (direction === "backward") {
            return {
              ...task,
              status:
                task.status === "Done"
                  ? "In-Progress"
                  : task.status === "In-Progress"
                  ? "To-Do"
                  : "To-Do",
            };
          }
        }
        return task;
      })
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  const statuses = ["To-Do", "In-Progress", "Done"];
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
        {statuses.map((status) => (
          <Col
            key={status}
            md={4}
            style={{ backgroundColor: getColumnBackgroundColor(status) }}
          >
            <h4 className="text-center bg-info text-muted">{status}</h4>
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
