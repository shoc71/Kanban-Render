const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const authorizeUser = require("./middleware/authorizingUser");
const sequelize = require("./config/database"); 

require("dotenv").config();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

app.use("/auth", require("./routes/jwtAuthUser"));
app.use("/dashboard", require('./routes/dashboard'));
app.use("/api/tasks", authorizeUser, require("./routes/tasks")); // Example route for tasks

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  // console.log(__dirname)
  // console.log("Serving React from: " + path.join(__dirname, "../../client/dist"));

  // For all other routes, send back the React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client", "dist", "index.html"));
  });
}

// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Server Error" });
});

// Sync database BEFORE starting server
sequelize.sync() // { force: true } drops and recreates tables (use cautiously)
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server live on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("DB Sync Error:", err);
  });