var express = require('express')
const path = require("path");
const fs = require("fs");
// const { dirname } = require('path');

var app = express()

var PORT = process.env.PORT || 3000; 

const mainDir = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', function (req, res) {
  res.send('hello world')
})

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "../db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function(req, res) {
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    var newNote = req.body;
    var uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

app.delete("/api/notes/:id", function(req, res) {
    var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    var noteID = req.params.id;
    var newID = 0;
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

app.listen(PORT, function() {
    console.log("server listening at " + PORT);
  });