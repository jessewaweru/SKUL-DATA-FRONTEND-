// src/components/common/ConfirmModal.jsx
import Modal from "./Modal/Modal";

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <Modal onClose={onCancel}>
      <div className="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
