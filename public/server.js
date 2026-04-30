const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// In-memory DB (temporary)
let notes = [];
let id = 1;

// ================= ROUTES ================= //

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

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;

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

// ================= ERROR HANDLING ================= //

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// ================= SERVER ================= //

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
