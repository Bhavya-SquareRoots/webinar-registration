// server.js
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3
const sendRegistrationEmail = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Initialize SQLite Database ===
const db = new sqlite3.Database('./registrations.db', (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS Registration (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT,
        email TEXT,
        phoneNumber TEXT,
        companyName TEXT,
        jobTitle TEXT,
        collegeName TEXT,
        course TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// === Serve index.html ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === Handle Form Submission ===
app.post('/register', async (req, res) => {
  const { fullName, email, phoneNumber, companyName, jobTitle, collegeName, course } = req.body;

  // Save form data into SQLite database
  const sql = `
    INSERT INTO Registration 
    (fullName, email, phoneNumber, companyName, jobTitle, collegeName, course)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [fullName, email, phoneNumber, companyName, jobTitle, collegeName, course];

  db.run(sql, params, async function(err) {
    if (err) {
      console.error('❌ Failed to insert data into database:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    try {
      // Send confirmation email
      await sendRegistrationEmail(email, fullName, 'https://yourwebinarlink.com');
      res.status(200).json({ message: 'Registration successful! Confirmation email sent.' });
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      res.status(500).json({ message: 'Registration saved but email sending failed.' });
    }
  });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
