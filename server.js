const express = require('express');
const fs = require('fs');
const path = require('path');
// const notes = require('./db/db.json');
const uuid = require('./helpers/uuid.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// Grab notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Notes functionality
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data)

  
      res.json(parsedNotes)
    }
})});

app.post('/api/notes', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

    const newNote = {
      title,
      text,
      id: uuid(),
    };

  // Gets current state of notes list from db.json
  fs.readFile('./db/db.json', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated Notes!')
        );
      }

  });

  // Gets updated state of notes list from db.json
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data)
  
      res.json(parsedNotes)
    }
  })
});

// All undefined paths take you back to the main page
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});