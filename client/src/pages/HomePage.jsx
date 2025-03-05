import React from 'react';

import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";

function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100"
    >
      <Row className="w-100">
        <Col md={8} className="mx-auto">
          <h1 className="display-2 fw-bold text-primary">
            Welcome to Kanban Render
          </h1>
          <p className="lead mt-3">
            The ultimate task management tool for teams and individuals.
            Organize your work efficiently and collaborate seamlessly.
          </p>
          {isLoggedIn ? (
            <>
              <p className="mt-4">
                Return back to dashboards here
              </p>
              <Button
                variant="primary"
                size="lg"
                className="mt-2 px-5 py-3 fw-bold"
                onClick={() => navigate("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="mt-4 px-5 py-3 fw-bold"
              onClick={() => navigate("/login")}
            >
              Login to Get Started
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
