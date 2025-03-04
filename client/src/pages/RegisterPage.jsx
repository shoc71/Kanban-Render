import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";
import { Button, Form, Alert } from "react-bootstrap";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser(username, email, password);

      if (!res.success) {
        // Ensure proper error handling
        setError(res.message || "Registration failed");
        return;
      }

      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="text-align-center container-sm mt-5 p-5 min-vh-100 ">
      <h2 className="display-2">
        <b>Register</b>
      </h2>
      <Form className="bg-primary rounded mt-5 p-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form.Group controlId="username" className="mt-3">
          <Form.Label className="text-white h4">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="email" className="mt-3">
          <Form.Label className="text-white h4">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="mt-3">
          <Form.Label className="text-white h4">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" className="mt-3">
          <Form.Label className="text-white h4">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="d-flex gap-2 mt-2 mb-3">
          <Button
            variant="primary"
            className="border border-dark mt-3 btn-lg"
            onClick={handleRegister}
          >
            <b>Register</b>
          </Button>
          <Button
            variant="secondary"
            className="border border-dark mt-3 btn-lg"
            onClick={() => navigate("/login")}
          >
            <b>Login</b>
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default RegisterPage;
