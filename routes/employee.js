const express = require("express");
const isAuthenticated = require("../middleware/auth");
const { createEmployee, getAllEmployees, updateEmployee, deleteEmployee, getEmployeeById } = require("../controllers/employee");
const { singleAvatar } = require("../middleware/multer");

const router = express.Router();

router.use(isAuthenticated)

router.post("/createEmployee", singleAvatar,  createEmployee)

router.get("/getEmployees", getAllEmployees)

router.get("/updateEmployee/:id", getEmployeeById)

router.delete("/updateEmployee/:id", deleteEmployee)

router.put("/updateEmployee/:id", singleAvatar, updateEmployee)

module.exports = router;

