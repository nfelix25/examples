const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Server static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to save notes
app.post('/quotes', (req, res) => {
  const quote = req.body.content;
  const author = req.body.author;
  // Save the note in a new file in the /notes folder
  const fs = require('fs');
  const path = require('path');
  const quotesDir = path.join(__dirname, 'quotes');

  // Ensure the quotes directory exists
  if (!fs.existsSync(quotesDir)) {
    fs.mkdirSync(quotesDir);
  }

  const fileName = `quote_${Date.now()}.txt`;
  const filePath = path.join(quotesDir, fileName);
  fs.writeFile(filePath, JSON.stringify({ quote, author }), (err) => {
    if (err) {
      console.error('Error saving quote:', err);
      return res.status(500).send('Error saving quote');
    }
    res.status(200).send('Quote saved successfully');
  });
});

// Endpoint to retrieve all quotes
app.get('/quotes', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const quotesDir = path.join(__dirname, 'quotes');

  fs.readdir(quotesDir, (err, files) => {
    if (err) {
      console.error('Error reading quotes directory:', err);
      return res.status(500).send('Error retrieving quotes');
    }

    const quotes = files.map((file) => {
      const filePath = path.join(quotesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsedContent = JSON.parse(content);
      console.log('content', parsedContent);
      return parsedContent;
    });

    res.status(200).json(quotes);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// docker run -d -p 3003:8008 --rm --name app -v quotes:/app/quotes IMAGE_ID
// Multiple runs will persist data in the 'quotes' volume, but not requiring a local folder
