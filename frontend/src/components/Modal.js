import React from "react";
import "./Modal.css";

const Modal = ({ message, onClose, type }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal ${type === 'success' ? 'modal-success' : 'modal-error'}`}>
        <button className="modal-close" onClick={onClose}>
          &times; {/* Cross mark */}
        </button>
        <div className="modal-content">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
