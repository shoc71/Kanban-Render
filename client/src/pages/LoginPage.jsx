import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import { Button, Form, Alert } from "react-bootstrap";

function LoginPage() {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser(emailOrUsername, password);
      console.log("Response from loginUser:", res); // Log the full response
      if (res.success && res.data) {
        localStorage.setItem("token", res.data.token); // Store the token
        localStorage.setItem("user_id", res.data.user_id); // Store the user_id
        console.log("Token:", res.data.token);
        console.log("User ID:", res.data.user_id);
        navigate("/dashboard");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(`Login failed. Please check your credentials. ${err}`);
    }
  };

  return (
    <div className="container-sm mt-5 p-5 min-vh-100">
      <h2 className="display-2">
        <b>Login</b>
      </h2>
      <Form className="bg-primary rounded mt-5 p-5 ">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId="emailOrUsername">
          <Form.Label className="text-white h4">Email or Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email or username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
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
        <div className="d-flex gap-2 mt-2 mb-3">
          <Button
            variant="primary"
            className="border border-dark mt-3 btn-lg"
            onClick={handleLogin}
          >
            <b>Login</b>
          </Button>
          <Button
            variant="secondary"
            className="border border-dark mt-3 btn-lg"
            onClick={() => navigate("/register")}
          >
            <b>Register</b>
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
