const express = require("express");
const customerController = require("../controllers/customerController");

const router = express.Router();

// GET all customers
router.get("/", customerController.getAllCustomers);

// POST a new customer
router.post("/", customerController.addCustomer);

// PUT update a customer
router.put("/:id", customerController.updateCustomer);

// DELETE a customer
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
