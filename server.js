const express = require('express');
const fs = require('fs');
const path = require('path');
// const { createNote, deleteNote } = require('./lib/notes');

// assigns the appropriate port or uses 3001
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// begin HTML routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
// end HTML routes

// begin API routes
app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, notes) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json(JSON.parse(notes));
    });
});

app.post('/api/notes', (req, res) => {
    // read db.json file, creating a new array from file to include new note
    fs.readFile("./db/db.json", "utf-8", (err, notes) => {
        if (err) {
            console.log(err);
            return;
        }
        const savedNotes = JSON.parse(notes) || [];
        savedNotes.push(req.body);

        // create new array to write to file, giving each note in the array an id
        const completedNotes = [];
        for (let i = 0; i < savedNotes.length; i++) {
            let note = {
                title : savedNotes[i].title,
                text: savedNotes[i].text,
                id: i
            };
            completedNotes.push(note);
        };
        
        // write newly created array with ids "completedNotes" to db.json
        fs.writeFile(
            path.join(__dirname, "./db/db.json"), 
            JSON.stringify(completedNotes, null, 2),
            (err) => {
                if (err) {
                    return console.log(err);
                }
                console.log("Note created!");
                res.json(req.body);
            }
        )
    });
});

app.delete('/api/notes/:id', (req, res) => {
    // read db.json file, creating a new array from file to include new note
    fs.readFile("./db/db.json", "utf-8", (err, notes) => {
        if (err) {
            console.log(err);
            return;
        }
        const savedNotes = JSON.parse(notes)

        // for loop to look for id of item to delete. 
        for (let i = 0; i < savedNotes.length; i++) {
            if (savedNotes[i].id == req.params.id) {
                // take selected position in the array and deletes that one object
                savedNotes.splice(i, 1);
                break;
            };
        };

        // write file with adjusted array (similar to post route)
        fs.writeFile(
            path.join(__dirname, "./db/db.json"), 
            JSON.stringify(savedNotes, null, 2),
            (err) => {
                if (err) {
                    return console.log(err);
                }
                console.log("Note deleted successfully!")
                res.json(savedNotes);
            }
        )
    });
});
// wildcard, route other html requests back to the homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// listen for the active port number and log it to the back end console
app.listen(PORT, () => {
    console.log(`Note Taker Active! Server running on port ${PORT}`);
});