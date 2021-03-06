require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 8000;
const employees = require("./employeesApi");

app.use(express.json());
app.use(cors());
app.use(employees);

app.listen(port, () => console.log(`Server started listening at ${port}`));

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Connection Failed to MongoDB... ", err));
