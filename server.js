const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory DB
let notes = [];
let id = 1;

// ✅ Root route (fix "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Notes API is running 🚀");
});

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
  res.status(201).json(newNote);
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

// ✅ Use dynamic port for deployment
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
