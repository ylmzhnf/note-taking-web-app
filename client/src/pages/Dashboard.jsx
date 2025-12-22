import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import apiClient from "../api/axios";
import Navbar from "../components/Navbar";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import CreateNote from "../components/CreateNote";
import Settings from "../components/Settings";
import TagsList from "../components/TagsList";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";
import "../styles/dashboard.css";

function Dashboard() {
  const { addToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [view, setView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, noteId: null });

  const fetchNotes = async () => {
    let endpoint = "/notes";
    if (view === "archived") endpoint = "/notes/archived";
    else if (view === "search") endpoint = `/notes/search?q=${searchQuery}`;
    else if (view.startsWith("tag-")) endpoint = `/notes/tag/${view.replace("tag-", "")}`;

    try {
      const res = await apiClient.get(endpoint);
      setNotes(res.data);
    } catch (err) {
      console.error("Notlar yüklenirken hata:", err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await apiClient.get("/notes/tags");
      setTags(res.data);
    } catch (err) {
      console.error("Etiketler yüklenirken hata:", err);
    }
  };

  useEffect(() => {
    if (view !== "settings" && view !== "create" && view !== "tags") {
      fetchNotes();
    }
    fetchTags();
  }, [view, searchQuery]);

  const debouncedUpdate = useCallback(
    debounce(async (id, content) => {
      try {
        await apiClient.patch(`/notes/${id}`, { content });
      } catch (err) { console.error("Otomatik kayıt hatası:", err); }
    }, 1000), []
  );

  const forceUpdate = async (id, content) => {
    debouncedUpdate.cancel();
    try {
      await apiClient.patch(`/notes/${id}`, { content });
      addToast("Note saved successfully!");
    } catch (err) { console.error("Kayıt hatası:", err); }
  };

  const debouncedSearch = useCallback(
    debounce((q) => setSearchQuery(q), 500), []
  );

  const handleGoBack = () => {
    setSelectedNote(null);
    if (view === "edit") setView("all");
  };

  const handleArchiveNote = (noteId) => {
    setModalConfig({ isOpen: true, type: 'archive', noteId });
  };

  const handleDeleteNote = (noteId) => {
    setModalConfig({ isOpen: true, type: 'delete', noteId });
  };

  const executeArchiveNote = async () => {
    try {
      await apiClient.patch(`/notes/archive/${modalConfig.noteId}`);
      await fetchNotes();
      setSelectedNote(null);
      if (view === "edit") setView("all");
      addToast("Note archived.", {
        actionLabel: "Archived Notes",
        onAction: () => { setView("archived"); setSelectedNote(null); }
      });
    } catch (err) {
      console.error("Failed to archive note:", err);
    }
  };

  const executeDeleteNote = async () => {
    try {
      await apiClient.delete(`/notes/${modalConfig.noteId}`);
      await fetchNotes();
      setSelectedNote(null);
      if (view === "edit") setView("all");
      addToast("Note permanently deleted.");
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleModalAction = async () => {
    if (modalConfig.type === 'archive') {
      await executeArchiveNote();
    } else if (modalConfig.type === 'delete') {
      await executeDeleteNote();
    }
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const getHeaderTitle = () => {
    if (view === "search") return "Search";
    if (view === "archived") return "Archived Notes";
    if (view === "tags") return "Tags";
    if (view === "settings") return "Settings";
    if (view.startsWith("tag-")) return `#${view.replace("tag-", "")}`;
    return "All Notes";
  };

  return (
    <main className={`dashboard ${view === 'search' ? 'search-active' : ''}`}>
      <Navbar setView={(v) => { setView(v); setSelectedNote(null); }} activeView={view} tags={tags} />

      <div className="dashboard-main-panel">
        {/* Mobile-only Header */}
        <header className="mobile-dashboard-header">
          <img src="/assets/images/logo.svg" alt="Notes Logo" className="mobile-logo" />
        </header>

        {/* Global Desktop Header */}
        <header className="desktop-main-header">
          <h1 className="header-title">{getHeaderTitle()}</h1>
          <div className="header-actions-right">
            <div className="header-search-desktop">
              <img src="/assets/images/icon-search.svg" alt="search" className="search-icon" />
              <input
                type="text"
                placeholder="Search by title, content, or tags..."
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
            <button className="settings-btn-desktop" onClick={() => setView("settings")}>
              <img src="/assets/images/icon-settings.svg" alt="settings" />
            </button>
          </div>
        </header>

        <div className="dashboard-content-grid">
          {/* Mobile Content Wrapper - Rounded corners for mobile views */}
          <div className="mobile-content-wrapper">
            {view === "settings" ? (
              <Settings />
            ) : view === "tags" ? (
              <TagsList tags={tags} setView={setView} />
            ) : (
              <div className="notes-editor-container">
                <aside className={`notes-sidebar ${selectedNote || view === 'edit' || view === 'create' ? "has-selection" : ""}`}>
                  <div className="notes-sidebar-header">
                    <h1 className="mobile-view-title">{getHeaderTitle()}</h1>

                    {/* View Subtitles */}
                    {view === "search" && (
                      <p className="view-subtitle">All notes matching "{searchQuery || '...'}" are displayed below.</p>
                    )}
                    {view === "archived" && (
                      <p className="view-subtitle">All your archived notes are stored here. You can restore or delete them anytime.</p>
                    )}

                    <div className="mobile-search-bar">
                      <img src="/assets/images/icon-search.svg" alt="search" className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search by title or content..."
                        onChange={(e) => debouncedSearch(e.target.value)}
                      />
                    </div>

                    <button className="create-note-btn-full" onClick={() => setView("create")}>
                      + Create New Note
                    </button>
                  </div>
                  <NoteList
                    notes={notes}
                    onNoteSelect={(note) => { setSelectedNote(note); if (window.innerWidth <= 768) setView("edit"); }}
                    selectedNoteId={selectedNote?.id}
                  />
                </aside>

                <section className={`editor-section ${selectedNote || view === 'edit' || view === 'create' ? "visible" : ""}`}>
                  {view === "create" ? (
                    <CreateNote setView={setView} />
                  ) : selectedNote ? (
                    <NoteEditor
                      note={selectedNote}
                      onContentChange={(content) => debouncedUpdate(selectedNote.id, content)}
                      onSave={(content) => forceUpdate(selectedNote.id, content)}
                      onNoteDeleted={() => handleDeleteNote(selectedNote.id)}
                      onNoteArchived={() => handleArchiveNote(selectedNote.id)}
                      onGoBack={handleGoBack}
                    />
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-content">
                        <p>Select a note to view its contents.</p>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📱 Mobile FAB */}
      {view !== "create" && view !== "settings" && view !== "tags" && (
        <button className="mobile-fab" onClick={() => setView("create")}>
          <img src="/assets/images/icon-plus.svg" alt="plus icon" />
        </button>
      )}

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.type === 'delete' ? "Delete Note" : "Archive Note"}
        description={
          modalConfig.type === 'delete'
            ? "Are you sure you want to permanently delete this note? This action cannot be undone."
            : "Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime."
        }
        actionLabel={modalConfig.type === 'delete' ? "Delete Note" : "Archive Note"}
        onAction={handleModalAction}
        isDestructive={modalConfig.type === 'delete'}
        iconSrc={modalConfig.type === 'delete' ? "/assets/images/icon-delete.svg" : "/assets/images/icon-archive.svg"}
      />
    </main>
  );
}

export default Dashboard;