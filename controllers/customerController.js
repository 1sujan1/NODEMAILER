const customerModel = require("../models/customerModel");

// Get all customers
exports.getAllCustomers = (req, res) => {
  const customers = customerModel.getAllCustomers();
  res.json(customers);
};

// Add a new customer
exports.addCustomer = (req, res) => {
  const { name, carModel, carVariant, purchaseDate } = req.body;
  console.log(req.body);
  if (!name || !carModel || !purchaseDate || !carVariant) {
    return res.status(400).json({
      message: "Name, Car Model, Car Varient and Purchase Date are required",
    });
  }

  const newCustomer = {
    id: Math.floor(Math.random() * 10000).toString(),
    name,
    carModel,
    carVariant,
    purchaseDate,
  };
  customerModel.addCustomer(newCustomer);
  res
    .status(201)
    .json({ message: "Customer added successfully", customer: newCustomer });
};

// Update a customer
exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const success = customerModel.updateCustomer(id, updatedData);
  if (success) {
    res.json({ message: "Customer updated successfully" });
  } else {
    res.status(404).json({ message: "Customer not found" });
  }
};

// Delete a customer
exports.deleteCustomer = (req, res) => {
  const { id } = req.params;
  const success = customerModel.deleteCustomer(id);
  if (success) {
    res.json({ message: "Customer deleted successfully" });
  } else {
    res.status(404).json({ message: "Customer not found" });
  }
};
