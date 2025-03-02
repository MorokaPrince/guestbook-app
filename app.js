const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for guestbook entries
const entries = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/entries', (req, res) => {
  res.json(entries);
});

app.post('/api/entries', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  
  const newEntry = {
    id: Date.now(),
    name,
    message,
    date: new Date().toISOString()
  };
  
  entries.push(newEntry);
  res.status(201).json(newEntry);
});

// Start server
app.listen(PORT, () => {
  console.log(`Guestbook app listening on port ${PORT}`);
  console.log(`Version: ${process.env.VERSION || 'v1'}`);
});