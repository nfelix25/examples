const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Server static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to save notes
app.post('/notes', (req, res) => {
  const note = req.body.content;
  // Save the note in a new file in the /notes folder
  const fs = require('fs');
  const path = require('path');
  const notesDir = path.join(__dirname, 'notes');

  // Ensure the notes directory exists
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir);
  }

  const fileName = `note_${Date.now()}.txt`;
  const filePath = path.join(notesDir, fileName);

  fs.writeFile(filePath, note, (err) => {
    if (err) {
      console.error('Error saving note:', err);
      return res.status(500).send('Error saving note');
    }
    res.status(200).send('Note saved successfully');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// docker run -p 3003:9009 -v ~/Code/docker-examples/mount_persistant_sync_dir/notes/:/app/notes IMAGE_ID
