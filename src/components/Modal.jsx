import React from 'react';
import '../Modal.css';

const Modal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-btn cancel-btn">Cancelar</button>
          <button onClick={onConfirm} className="modal-btn confirm-btn">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
