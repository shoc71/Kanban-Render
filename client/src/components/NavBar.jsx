import React from 'react';
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ isDarkMode, toggleTheme, isLoggedIn }) {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  };

  const handleSkipToContent = (event) => {
     event.preventDefault();

    // Manually collapse navbar if open
    const navbarToggler = document.querySelector(".navbar-collapse.show");
    if (navbarToggler) {
      navbarToggler.classList.remove("show");
    }

    // Find the first focusable element in main content
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" });
      mainContent.focus();
    }
  };

  return (
    <>
      {/* Skip to Main Content Link */}
      <a
        href="#main-content"
        className="skip-to-content-link"
        style={{
          position: "absolute",
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px",
          backgroundColor: "#000",
          color: "#fff",
          fontSize: "1rem",
          zIndex: "1000",
          textDecoration: "none",
          fontWeight: "bold",
          transition: "top 0.3s ease",
        }}
        onFocus={(e) => e.target.style.top = "0"}
        onBlur={(e) => e.target.style.top = "-60px"}
        onClick={handleSkipToContent}
        onKeyDown={(e) => e.key === "Enter" && handleSkipToContent(e)}
      >
        Skip to main content
      </a>

      <nav
        className={`navbar navbar-expand-lg ${
          isDarkMode ? "navbar-dark bg-primary" : "navbar-dark bg-primary"
        }`}
        aria-label="Main navigation"
      >
        <div className="container-fluid">
          <Link
            className="navbar-brand d-flex align-items-center"
            to="/"
            style={{ fontSize: "1.5rem" }}
            aria-label="Go to homepage"
          >
            <img
              src="https://shorturl.at/lepSy"
              alt="Logo"
              width="25"
              height="25"
              className="d-inline-block align-top me-2"
              aria-hidden="true"
            />
            <b>Mystery Orbs</b>
          </Link>

          {/* Mobile Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact-us"
                  style={{ fontSize: "1.2rem" }}
                  aria-label="Contact us"
                >
                  Contact Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/settings"
                  style={{ fontSize: "1.2rem" }}
                  aria-label="Go to settings"
                >
                  Settings
                </Link>
              </li>
              {/* Auth Button */}
              <li className="nav-item d-flex align-items-center">
                <button
                  className="btn btn-link nav-link"
                  onClick={handleAuthClick} f
                  title={isLoggedIn ? "Logged in" : "Go to Login"}
                  aria-label={isLoggedIn ? "Logged in" : "Go to Login"}
                >
                  {isLoggedIn ? (
                    <i
                      className="bi bi-check-circle"
                      style={{ fontSize: "1.2rem" }}
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      className="bi bi-person"
                      style={{ fontSize: "1.2rem" }}
                      aria-hidden="true"
                    ></i>
                  )}
                </button>
              </li>
            </ul>

            {/* Dark Mode Toggle Button */}
            <button
              className={`btn ${isDarkMode ? "btn-light" : "btn-light"}`}
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <i className="bi bi-moon" aria-hidden="true"></i>
              ) : (
                <i className="bi bi-sun" aria-hidden="true"></i>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

NavBar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
};

export default NavBar;
