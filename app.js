const express = require("express");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customerRoutes");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory

// Routes
app.use("/api/customers", customerRoutes);

// Render the main page
app.get("/", async (req, res) => {
  const customers = require("./models/customerModel").getAllCustomers();
  res.render("index", { customers }); // Pass data to the view
});

// Render the "Add Customer" form
app.get("/add", (req, res) => {
  res.render("add"); // Render the add.ejs template
});

// Handle form submission for adding a new customer
app.post("/add", (req, res) => {
  const { name, carModel, carVariant, purchaseDate } = req.body;
  const newCustomer = {
    id: Date.now().toString(),
    name,
    carModel,
    carVariant,
    purchaseDate,
  };
  require("./models/customerModel").addCustomer(newCustomer);
  res.redirect("/"); // Redirect to the main page after adding
});

// Handle customer deletion
app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const success = require("./models/customerModel").deleteCustomer(id);
  if (success) {
    res.redirect("/"); // Redirect to the main page after deletion
  } else {
    res.status(404).send("Customer not found");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const nodemailer = require("nodemailer");

// Function to send email
function sendAnniversaryEmail(customer) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "your-email@gmail.com", // Replace with your email
      pass: "your-password", // Replace with your password
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: "company-email@example.com", // Replace with the company email
    subject: `Anniversary Reminder: ${customer.name}`,
    text: `Today is the purchase anniversary of ${customer.name} who bought a ${customer.carModel} (${customer.carVariant}) on ${customer.purchaseDate}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Check for anniversaries daily
setInterval(() => {
  const customers = require("./models/customerModel").getAllCustomers();
  const today = new Date().toISOString().split("T")[0];

  customers.forEach((customer) => {
    if (customer.purchaseDate.split("T")[0] === today) {
      sendAnniversaryEmail(customer);
    }
  });
}, 86400000);
