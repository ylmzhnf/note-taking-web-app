import React, { useEffect, useRef, useState } from "react";
import "../styles/components/modal.css";

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    actionLabel,
    onAction,
    isDestructive = false,
    iconSrc
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const cancelButtonRef = useRef(null);
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) cancelButtonRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !isSubmitting) onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isSubmitting, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon-wrapper">
                        <img src={iconSrc} alt="icon" />
                    </div>
                    <div className="modal-content-text">
                        <h3 id="modal-title" className="modal-title">{title}</h3>
                        <p className="modal-description">{description}</p>
                    </div>
                </div>

                <div className="modal-actions">
                    <button ref={cancelButtonRef} className="modal-btn modal-btn-cancel" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button
                        className={`modal-btn modal-btn-action ${isDestructive ? 'destructive' : 'primary'}`}
                        disabled={isSubmitting}
                        onClick={async () => {
                            setIsSubmitting(true);
                            await onAction();
                            setIsSubmitting(false);
                            onClose();
                        }}
                    >
                        {isSubmitting ? "Working..." : actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
