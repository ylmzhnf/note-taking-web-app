import React, { useMemo, useState } from "react";
import "../styles/components/tagsList.css";

function TagsList({ tags, setView }) {
  const [query, setQuery] = useState("");
  const filteredTags = useMemo(
    () =>
      tags.filter((tag) =>
        (tag.name || tag).toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [tags, query],
  );

  return (
    <div className="tags-list-page">
      <h1 className="mobile-view-title">Tags</h1>
      <p className="tags-list-description">Browse your notes by tag.</p>
      <label className="tags-search" htmlFor="tag-search">
        <img src="/assets/images/icon-search.svg" alt="" />
        <input
          id="tag-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tags"
          aria-label="Search tags"
        />
      </label>
      <div className="tags-grid">
        {filteredTags.map((tag) => (
          <button
            key={tag.id || tag}
            className="tag-item-row"
            onClick={() => setView(`tag-${tag.id}`)}
          >
            <img src="/assets/images/icon-tag.svg" alt="tag icon" />
            <span>{tag.name || tag}</span>
          </button>
        ))}
        {!filteredTags.length && (
          <div className="tags-empty-state">
            <img src="/assets/images/icon-tag.svg" alt="" />
            <strong>{tags.length ? "No matching tags" : "No tags yet"}</strong>
            <span>
              {tags.length
                ? "Try a different search."
                : "Add tags while creating a note."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TagsList;
