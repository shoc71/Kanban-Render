const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 5001;

// console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`)
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

app.use("/auth", require("./src/routes/jwtAuthUser"))

app.use("/dashboard", require('./src/routes/dashboard'))

app.listen(PORT, () => {
    console.log(`Server live on http://localhost:${PORT}`)
});