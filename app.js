const express = require("express");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/CustomerRoutes");
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
    service: "outlook",
    auth: {
      user: "Carina_ascendifly@outlook.com", // Replace with your email
      pass: "#Carina123", // Replace with your password
    },
  });

  const mailOptions = {
    from: "Carina_ascendifly@outlook.com",
    to: "suzon9849@gmail.com", // Replace with the company email
    subject: `Anniversary Reminder: ${customer.name}`,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://example.com/path/to/ascendify-logo.png" alt="Ascendify Logo" style="width: 150px;">
    </div>
    <h2 style="color: #333;">Anniversary Reminder</h2>
    <p>Dear Team,</p>
    <p>Today is the purchase anniversary of <strong>${customer.name}</strong> who bought a <strong>${customer.carModel} (${customer.carVariant})</strong> on <strong>${customer.purchaseDate}</strong>.</p>
    <p>Please take a moment to reach out and congratulate them on this special occasion.</p>
    <p>Best regards,<br>Your Company</p>
    </div>
  `,
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
}, 1000 * 60 * 60 * 24); // Check every 24 hours change this for testing set it to 100 or 1000
