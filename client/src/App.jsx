import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ErrorPage from "./utils/ErrorPage";
import Dashboard from "./pages/DashboardPage";
import ContactMePage from "./pages/ContactMePage";
import SettingsPage from "./pages/SettingsPage";

import PageWrapper from "./components/PageWrapper";

function App() {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "black" : "white",
        minHeight: "100vh",
        color: isDarkMode ? "white" : "black",
      }}
    >
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <PageWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element=
              {
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/contact-us" element={<ContactMePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </PageWrapper>
      <Footer />
    </div>
  );
}

export default App;
