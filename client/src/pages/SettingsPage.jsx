import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Alert } from "react-bootstrap";

const SettingsPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    setMessage("All data has been cleared!");
    setTimeout(() => {
      setMessage(""); // Remove message after 3 seconds
      window.location.reload(); // Refresh page to apply changes
    }, 3000);
  };

  return (
    <Container className="text-center mt-5 min-vh-100">
      <h2 className="display-4">Settings</h2>

      {username ? (
        <p className="lead">Logged in as: <strong>{username}</strong></p>
      ) : (
        <p className="lead">You are not logged in</p>
      )}

      {message && <Alert variant="success">{message}</Alert>}

      <div className="d-flex flex-column align-items-center gap-3 mt-4">
        {!username && (
          <Button variant="primary" className="btn-lg w-50" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
        {username && (
          <Button variant="danger" className="btn-lg w-50" onClick={handleLogout}>
            Logout
          </Button>
        )}
        <Button variant="success" className="btn-lg w-50" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
        <Button variant="warning" className="btn-lg w-50" onClick={clearLocalStorage}>
          Clear Data & Refresh
        </Button>
      </div>
    </Container>
  );
};

export default SettingsPage;
