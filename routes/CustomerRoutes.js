const express = require("express");
const customerModel = require("../models/customerModel");

const router = express.Router();

// GET all customers
router.get("/", (req, res) => {
  const customers = customerModel.getAllCustomers();
  res.json(customers);
});

// POST a new customer
router.post("/", (req, res) => {
  const newCustomer = req.body;
  customerModel.addCustomer(newCustomer);
  res.status(201).json(newCustomer);
});

// DELETE a customer
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const success = customerModel.deleteCustomer(id);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).send("Customer not found");
  }
});

module.exports = router;
