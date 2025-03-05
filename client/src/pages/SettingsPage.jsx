import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const SettingsPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Retrieve username from localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/login"); // Redirect to login page
  };

  return (
    <Container className="text-center mt-5 min-vh-100">
      <h2 className="display-4">Settings</h2>

      {username ? (
        <p className="lead">Logged in as: <strong>{username}</strong></p>
      ) : (
        <p className="lead">You are not logged in</p>
      )}

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
      </div>
    </Container>
  );
};

export default SettingsPage;
