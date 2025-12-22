import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import apiClient from "../api/axios";
import { useToast } from "../context/ToastContext";
import "../styles/components/createNote.css";

function CreateNote({ setView }) {
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing your note here...</p>"
  });
  const { addToast } = useToast();

  const handleSave = async () => {
    const tagsArray = tagInput.split(",").map(t => t.trim()).filter(t => t !== "");
    try {
      await apiClient.post("/notes", {
        title,
        content: editor.getHTML(),
        tagNames: tagsArray
      });
      addToast("Note created successfully!");
      if (setView) setView("all");
    } catch (err) {
      addToast("Failed to create note.");
    }
  };

  return (
    <div className="create-note-container">
      <div className="create-note-content">
        <div className="create-note-header">
          <input
            className="create-title-input"
            placeholder="Enter a title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="create-meta">
          <div className="meta-row">
            <div className="meta-label">
              <img src="/assets/images/icon-tag.svg" alt="tags" />
              <span>Tags</span>
            </div>
            <input
              className="create-tags-input"
              placeholder="Add tags separated by commas (e.g. Work, Planning)"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
            />
          </div>
          <div className="meta-row">
            <div className="meta-label">
              <img src="/assets/images/icon-clock.svg" alt="clock" />
              <span>Last edited</span>
            </div>
            <div className="meta-value disabled">Not yet saved</div>
          </div>
        </div>

        <div className="create-editor-wrapper">
          <EditorContent editor={editor} />
        </div>

        <div className="create-bottom-actions">
          <button className="primary-btn" onClick={handleSave}>Save Note</button>
          <button className="secondary-btn" onClick={() => setView("all")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CreateNote;