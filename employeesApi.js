const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const router = express.Router();
let employeesData = [];

/*----------------Mongoose Schema------------------*/
const mongooseSchema = new mongoose.Schema({
  name: String,
  designation: String,
  phone: String,
  date: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", mongooseSchema);

async function getEmployees() {
  const employees = await Employee.find();
  employeesData = employees;
}

getEmployees();

/* ---------------GET--------------- */
router.get("/api/employeesdata", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  async function getEmployees() {
    const employees = await Employee.find();
    res.send(employees);
  }

  getEmployees();
});

router.get("/api/employeesdata/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  async function getEmployee() {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const employee = await Employee.find({ _id: req.params.id });

      employee.length == 0
        ? res.status(404).send("Employee not found")
        : res.send(employee);
    } else {
      res.status(404).send("Invalid ID");
    }
  }

  getEmployee();
});

/* ---------------POST--------------- */
router.post("/api/employeesdata", (req, res) => {
  const newEmployee = {
    name: req.body.name,
    designation: req.body.designation,
    phone: req.body.phone,
  };
  
  const { error } = validateSchema(newEmployee);
  if (error) return res.status(400).send(error.details[0].message);
  
  async function createEmployee() {
    res.header("Access-Control-Allow-Origin", "*");
    const employee = new Employee(newEmployee);
    await employee.save();
    res.send([employee]);
  }

  createEmployee();
});

/* ---------------PUT--------------- */

router.put("/api/employeesdata/:id", (req, res) => {
  async function updateEmployee() {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      res.header("Access-Control-Allow-Origin", "*");
      let employee = await Employee.findById(req.params.id);

      employee.set(req.body);

      await employee.save();
      res.send(employee);
    } else {
      res.status(404).send(`Invalid ID`);
    }
  }

  updateEmployee();
});

/* ---------------DELETE--------------- */

router.delete("/api/employeesData/:id", (req, res) => {
  async function removeEmployee() {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      res.header("Access-Control-Allow-Origin", "*");
      await Employee.findByIdAndRemove(req.params.id);
      res.send("Deleted Successfully!");
    } else {
      res.status(404).send(`Invalid ID`);
    }
  }

  removeEmployee();
});

function validateSchema(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    designation: Joi.string().min(2).required(),
    phone: Joi.string().required(),
  });

  return schema.validate(data);
}

module.exports = router;
