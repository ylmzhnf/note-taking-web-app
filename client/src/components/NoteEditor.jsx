import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import "../styles/components/noteEditor.css";

const NoteEditor = ({ note, onContentChange, onSave, onNoteDeleted, onNoteArchived, onNoteRestored, onGoBack }) => {
  const [title, setTitle] = useState(note.title);
  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  const handleSave = async () => {
    if (onSave && editor) {
      await onSave(editor.getHTML(), title.trim() || "Untitled Note");
    }
    onGoBack();
  };

  useEffect(() => {
    if (editor && note) {
      editor.commands.setContent(note.content);
      setTitle(note.title);
    }
  }, [note, editor]);

  if (!note) return null;

  const archiveAction = note.isArchived ? onNoteRestored : onNoteArchived;
  const archiveIcon = note.isArchived ? "icon-restore.svg" : "icon-archive.svg";
  const archiveLabel = note.isArchived ? "Restore Note" : "Archive Note";

  return (
    <div className="editor-container">
      {/* Mobile Top Header */}
      <div className="mobile-editor-header">
        <button className="back-btn" onClick={onGoBack}>
          <img src="/assets/images/icon-arrow-left.svg" alt="back" />
          <span>Go Back</span>
        </button>
        <div className="mobile-header-actions">
          <button onClick={onNoteDeleted} className="icon-action">
            <img src="/assets/images/icon-delete.svg" alt="delete" />
          </button>
          <button onClick={archiveAction} className="icon-action" aria-label={archiveLabel}>
            <img src={`/assets/images/${archiveIcon}`} alt="" />
          </button>
          <button className="mobile-cancel-btn" onClick={onGoBack}>Cancel</button>
          <button className="mobile-save-btn" onClick={handleSave}>Save Note</button>
        </div>
      </div>

      <div className="editor-layout-main">
        {/* Middle Column: Editor Content */}
        <div className="editor-content-area">
          <div className="editor-header">
            <input
              className="editor-title-view editor-title-input"
              aria-label="Note title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="editor-meta">
            <div className="meta-row">
              <div className="meta-label">
                <img src="/assets/images/icon-tag.svg" alt="tags" />
                <span>Tags</span>
              </div>
              <div className="meta-value">
                {note.tags?.map(t => t.tag?.name || t.name || (typeof t === 'string' ? t : '')).join(", ") || "No tags"}
              </div>
            </div>
            <div className="meta-row">
              <div className="meta-label">
                <img src="/assets/images/icon-clock.svg" alt="clock" />
                <span>Last edited</span>
              </div>
              <div className="meta-value">
                {new Date(note.updatedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="tiptap-wrapper">
            <EditorContent editor={editor} />
          </div>

          {/* Desktop/Tablet Bottom Actions */}
          <div className="editor-bottom-actions">
            <button className="primary-btn" onClick={handleSave}>Save Note</button>
            <button className="secondary-btn" onClick={onGoBack}>Cancel</button>
          </div>
        </div>

        {/* Desktop Far Right Column: Specialized Actions */}
        <div className="editor-right-column">
          <div className="action-card">
            <button className="side-action-btn" onClick={archiveAction}>
              <img src={`/assets/images/${archiveIcon}`} alt="" />
              <span>{archiveLabel}</span>
            </button>
          </div>
          <div className="action-card">
            <button className="side-action-btn" onClick={onNoteDeleted}>
              <img src="/assets/images/icon-delete.svg" alt="delete" />
              <span>Delete Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
