import React from "react";
import "../styles/components/toast.css";

const Toast = ({ message, type = "success", actionLabel, onAction, onClose }) => {
    return (
        <div className="toast-item">
            <div className={`toast-icon ${type}`}>
                <img src="/assets/images/icon-checkmark.svg" alt="success" />
            </div>
            <p className="toast-message">{message}</p>

            {actionLabel && onAction && (
                <button
                    className="toast-action"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            )}

            <button className="toast-close" onClick={onClose}>
                <img src="/assets/images/icon-cross.svg" alt="close" />
            </button>
        </div>
    );
};

export default Toast;
