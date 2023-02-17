const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const app = express();
app.use(bodyParser.json());

// Connect to MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "your_db_name"
});
connection.connect();

// Handle user registration
app.post("/register", (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users (username, first_name, last_name, email, password)
    VALUES ('${username}', '${firstName}', '${lastName}', '${email}', '${hash}');
  `;

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(200).send("User registered successfully.");
  });
});

// Handle user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT * FROM users
    WHERE username = '${username}';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (!results[0]) {
      return res.status(404).send("User not found.");
    }
    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Incorrect password.");
    }
    res.status(200).send("Login successful.");
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
