const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const PORT = process.env.PORT || 5001;

// console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`)
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

app.use("/auth", require("./routes/jwtAuthUser"));
app.use("/dashboard", require('./routes/dashboard'));
app.use("/api/tasks", require("./routes/tasks")); // Example route for tasks

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  console.log(__dirname)
  console.log("Serving React from: " + path.join(__dirname, "../../client/dist"));

  // For all other routes, send back the React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
    console.log(`Server live on http://localhost:${PORT}`)
});