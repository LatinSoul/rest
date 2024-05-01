const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const port = 3000;

// let express serve static files
const publicPath = path.join(__dirname, '../client/public');
app.use(express.static(publicPath));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the database');
  }
});

// SQL statement to create or alter the users table

const users = `
-- Create the users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT,
  email TEXT,
  password TEXT,
  activated INTEGER,
  token TEXT
);
`
// const drop = `DROP TABLE users;`
db.run(users, function(err) {
  if (err) {
    console.error('Error executing SQL statement', err);
  } else {
    console.log('Table created or altered successfully.');
  }
});

// db.close((err) => {
//   if (err) {
//     console.error('Error closing database', err);
//   } else {
//     console.log('Database connection closed');
//   }
// });

// Generate a confirmation token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Send confirmation email
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'malachi.cassin@ethereal.email',
      pass: 'MzVh3Fky5aP4bRZ67t'
  }
});

function sendConfirmationEmail(email, token) {
  const confirmationLink = `http://localhost:3000/confirm?token=${token}`;

  transporter.sendMail({
    from: 'malachi.cassin@ethereal.email',
    to: email,
    subject: 'Confirm Your Email Address',
    html: `<p>Please click <a href="${confirmationLink}">here</a> to confirm your email address.</p>`
  });
}

// Routes
app.get('/qwe', (req, res) => {
  res.send('Hello World!');
});

// Signin route
app.post('/signin', (req, res) => {
    const { username, password } = req.body; // Assuming you have username and password in request body

    // Query the database to check if the user exists
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
        }

        // If user exists, return the username in JSON response
        if (row) {
        res.json({ username: row.username });
        } else {
        res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

// Route for user sign-up
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
  //console.log(`username: ${username} and password: ${password}`)
    // Validate user input (e.g., check for empty fields)
   
    // Generate confirmation token
    const token = generateToken();
    const activated = 0;
    console.log(`token = ${token}`)
    console.log(`username = ${username}`)
    // Check if username already exists in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal Server Error (DB)' });
      }
  
      if (row) {
        console.log(username)
        return res.status(400).json({ error: 'Username already exists' });
      } 

      // Insert new user into the database
      db.run('INSERT INTO users (username, email, password, token, activated) VALUES (?, ?, ?, ?, ?)', [username, email, password, token, activated], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error (DB insert)' });
        }  
        res.status(201).json({ message: 'User created successfully. Check your email to confirm your account.' });
      });
    });
});

app.get('/confirm', (req,res) => {
  const { token } = req.query;

  // Find user by token
  db.get('SELECT username FROM users WHERE token = ?', [token], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error (DB)' });
    }
    if (row) {
      const activated = 1;
      // Insert new user into the database
      db.run('UPDATE users SET activated = ? WHERE username = ?', [activated, row.username], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error (DB insert)' });
        }    // Respond with success message

        res.send('Email confirmed. You can now log in.');      
      });
    } else {
      return res.status(404).send('Invalid or expired token');
    } 

});

});
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
