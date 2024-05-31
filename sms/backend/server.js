const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./db");
const gradesController = require("./gradesController");
const studentmanage = require("./studentmanage");
const activestu = require("./activestu.js");
const fees = require("./fees.js");
require('dotenv').config

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to the database
connectDB()
    .then(() => {
        console.log("Connected to MongoDB");

        app.use("/api/grades", gradesController);
        app.use("/api/students", studentmanage);
        app.use("/api/active", activestu);
        app.use("/api/fees", fees);


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit the process if database connection fails
    });
