const express = require("express");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/CustomerRoutes");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory

// Session setup
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// Routes
app.use("/api/customers", customerRoutes);

// Render the login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle login form submission
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    // Replace with your credentials
    req.session.user = username;
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

// Redirect to login if not authenticated
app.get("/", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    res.redirect("/home");
  }
});

// Render the main page
app.get("/home", isAuthenticated, async (req, res) => {
  const customers = require("./models/customerModel").getAllCustomers();
  res.render("index", { customers }); // Pass data to the view
});

// Render the "Add Customer" form
app.get("/add", isAuthenticated, (req, res) => {
  res.render("add"); // Render the add.ejs template
});

// Handle form submission for adding a new customer
app.post("/add", isAuthenticated, (req, res) => {
  const { name, carModel, carVariant, purchaseDate, birthDate, phone } =
    req.body;
  const newCustomer = {
    id: Date.now().toString(),
    name,
    carModel,
    carVariant,
    purchaseDate,
    birthDate,
    phone,
  };
  require("./models/customerModel").addCustomer(newCustomer);
  res.redirect("/home"); // Redirect to the main page after adding
});

// Handle customer deletion
app.post("/delete/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const success = require("./models/customerModel").deleteCustomer(id);
  if (success) {
    res.redirect("/home"); // Redirect to the main page after deletion
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

// Function to send birthday email
function sendBirthdayEmail(customer) {
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
    subject: `Birthday Reminder: ${customer.name}`,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://example.com/path/to/ascendify-logo.png" alt="Ascendify Logo" style="width: 150px;">
    </div>
    <h2 style="color: #333;">Birthday Reminder</h2>
    <p>Dear Team,</p>
    <p>Today is the birthday of <strong>${customer.name}</strong> who was born on <strong>${customer.birthDate}</strong>.</p>
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

// Check for anniversaries and birthdays daily
setInterval(() => {
  const customers = require("./models/customerModel").getAllCustomers();
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  const oneWeekFromNow = new Date(today.setDate(today.getDate() + 7))
    .toISOString()
    .split("T")[0];

  customers.forEach((customer) => {
    const purchaseDate = new Date(customer.purchaseDate);
    const purchaseAnniversary = new Date(
      today.getFullYear(),
      purchaseDate.getMonth(),
      purchaseDate.getDate()
    )
      .toISOString()
      .split("T")[0];

    if (purchaseAnniversary === oneWeekFromNow) {
      sendAnniversaryEmail(customer);
    }

    if (customer.birthDate.split("T")[0] === todayISO) {
      sendBirthdayEmail(customer);
    }
  });
}, 1000 * 60 * 60 * 24); // Check every 24 hours change this for testing set it to 100 or 1000
