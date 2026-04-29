const express = require("express");
const app = express();

app.use(express.json());

let notes = [];
let id = 1;

const cors = require("cors");
app.use(cors());

// POST - create note
app.post("/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  const newNote = {
    id: id++,
    title,
    content,
  };

  notes.push(newNote);
  res.status(201).json(newNote); // better status
});

// GET - all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// PUT - update note
app.put("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const { title, content } = req.body;

  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  note.title = title || note.title;
  note.content = content || note.content;

  res.json(note);
});

// DELETE - remove note
app.delete("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);

  const noteExists = notes.some((n) => n.id === noteId);

  if (!noteExists) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes = notes.filter((n) => n.id !== noteId);

  res.json({ message: "Note deleted successfully" });
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
