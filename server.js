const express = require('express');
const fs = require('fs');
const path = require('path');
// const notes = require('./db/db.json');
const uuid = require('./helpers/uuid.js');

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/db/db.json'));
});

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

      const newNote = {
        title,
        text,
        id: uuid(),
      };

    fs.readFile('./public/db/db.json', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFile(
            './public/db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated Notes!')
          );
        }
    });

    fs.readFile('./public/db/db.json', (err, data) => {
      if(err) {
        console.log(err);
      }
        console.log(JSON.parse(data));
    });

});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});