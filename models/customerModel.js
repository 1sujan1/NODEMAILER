const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/customers.json");

// Read all customers
function getAllCustomers() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Save all customers
function saveAllCustomers(customers) {
  fs.writeFileSync(filePath, JSON.stringify(customers, null, 2), "utf8");
}

// Add a new customer
function addCustomer(customer) {
  const customers = getAllCustomers();
  customers.push(customer);
  saveAllCustomers(customers);
}

// Find a customer by ID
function findCustomerById(id) {
  const customers = getAllCustomers();
  return customers.find((customer) => customer.id === id);
}

// Update a customer by ID
function updateCustomer(id, updatedData) {
  const customers = getAllCustomers();
  const index = customers.findIndex((customer) => customer.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updatedData };
    saveAllCustomers(customers);
    return true;
  }
  return false;
}

// Delete a customer by ID
function deleteCustomer(id) {
  const customers = getAllCustomers();
  const filteredCustomers = customers.filter((customer) => customer.id !== id);
  if (filteredCustomers.length !== customers.length) {
    saveAllCustomers(filteredCustomers);
    return true;
  }
  saveAllCustomers(filteredCustomers);
}

module.exports = {
  getAllCustomers,
  addCustomer,
  findCustomerById,
  updateCustomer,
  deleteCustomer,
};
