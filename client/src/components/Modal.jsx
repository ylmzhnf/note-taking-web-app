import React, { useEffect } from "react";
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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon-wrapper">
                        <img src={iconSrc} alt="icon" />
                    </div>
                    <div className="modal-content-text">
                        <h3 className="modal-title">{title}</h3>
                        <p className="modal-description">{description}</p>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="modal-btn modal-btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={`modal-btn modal-btn-action ${isDestructive ? 'destructive' : 'primary'}`}
                        onClick={() => {
                            onAction();
                            onClose();
                        }}
                    >
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
