import React from "react";
import "../styles/components/tagsList.css";

function TagsList({ tags, setView }) {
    return (
        <div className="tags-list-page">
            <h1 className="mobile-view-title">Tags</h1>
            <div className="tags-grid">
                {tags.map((tag) => (
                    <button
                        key={tag.id || tag}
                        className="tag-item-row"
                        onClick={() => setView(`tag-${tag.name || tag}`)}
                    >
                        <img src="/assets/images/icon-tag.svg" alt="tag icon" />
                        <span>{tag.name || tag}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TagsList;
