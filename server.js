const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const { createNote, deleteNote } = require('./lib/notes');

// assigns the appropriate port or uses 3001
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    // function to create note "createdNote"
    res.json(createdNote);
});

app.delete('/api/notes/:id', (req, res) => {
    // function to delete note, needing id of note from length of array
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});