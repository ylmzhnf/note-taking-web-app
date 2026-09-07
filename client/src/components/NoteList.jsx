import React from "react";
import "../styles/components/noteList.css";

function NoteList({
  notes,
  onNoteSelect,
  selectedNoteId,
  isLoading = false,
  emptyMessage = "No notes found.",
}) {
  if (isLoading) {
    return (
      <div className="note-list-status" role="status" aria-live="polite">
        <span className="loading-dot" />
        <span>Loading notes...</span>
      </div>
    );
  }

  if (!notes.length) {
    return (
      <div className="note-list-status empty" role="status">
        <img src="/assets/images/icon-status.svg" alt="" />
        <strong>{emptyMessage}</strong>
        <span>Try another view or add a new note.</span>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`note-item ${selectedNoteId === note.id ? "selected" : ""}`}
          onClick={() => onNoteSelect(note)}
        >
          <h3>{note.title || "Untitled Note"}</h3>

          <div className="note-tags">
            {note.tags?.map((tagWrapper, idx) => (
              <span key={idx} className="tag">
                {tagWrapper.tag?.name ||
                  tagWrapper.name ||
                  (typeof tagWrapper === "string" ? tagWrapper : "")}
              </span>
            ))}
          </div>

          <span className="date">
            {new Date(note.updatedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
