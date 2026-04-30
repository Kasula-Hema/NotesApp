const API = "/notes";

// Fetch notes
async function getNotes() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    const list = document.getElementById("notesList");
    list.innerHTML = "";

    data.forEach((note) => {
      const li = document.createElement("li");

      li.innerHTML = `
  <strong>${note.title}</strong> - ${note.content}
  <br/>
  <button onclick="editNote(${note.id})">Edit</button>
  <button onclick="deleteNote(${note.id})">Delete</button>
`;

      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching notes:", err);
  }
}

// Add note
async function addNote() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    alert("Please enter both title and content");
    return;
  }

  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    getNotes();
  } catch (err) {
    console.error("Error adding note:", err);
  }
}

// ✅ EDIT note
async function editNote(id, oldTitle, oldContent) {
  const newTitle = prompt("Edit title:", oldTitle);
  const newContent = prompt("Edit content:", oldContent);

  if (!newTitle || !newContent) return;

  try {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
      }),
    });

    getNotes();
  } catch (err) {
    console.error("Error updating note:", err);
  }
}

// Delete note
async function deleteNote(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    getNotes();
  } catch (err) {
    console.error("Error deleting note:", err);
  }
}

// Load notes on start
window.onload = getNotes;
