import {
  FiX,
  FiUser,
  FiClock,
  FiActivity,
  FiDatabase,
  FiInfo,
} from "react-icons/fi";
import { format } from "date-fns";

const ActionLogDetailsModal = ({ log, onClose }) => {
  const renderMetadata = () => {
    if (!log.metadata) return null;

    return Object.entries(log.metadata).map(([key, value]) => (
      <div key={key} className="metadata-item">
        <strong>{key}:</strong>
        <span>{typeof value === "object" ? JSON.stringify(value) : value}</span>
      </div>
    ));
  };

  return (
    <div className="modal-overlay">
      <div className="action-log-modal">
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal-header">
          <h3>Action Log Details</h3>
          <div className="log-category">{log.category_display}</div>
        </div>

        <div className="modal-content">
          <div className="detail-section">
            <div className="detail-item">
              <FiUser />
              <div>
                <h4>User</h4>
                <p>
                  {log.user_details
                    ? `${log.user_details.first_name} ${log.user_details.last_name}`
                    : "System"}
                </p>
                <small>ID: {log.user_tag}</small>
              </div>
            </div>

            <div className="detail-item">
              <FiClock />
              <div>
                <h4>Timestamp</h4>
                <p>{format(new Date(log.timestamp), "MMMM d, yyyy h:mm a")}</p>
              </div>
            </div>

            <div className="detail-item">
              <FiActivity />
              <div>
                <h4>Action</h4>
                <p>{log.action}</p>
              </div>
            </div>

            {log.affected_model && (
              <div className="detail-item">
                <FiDatabase />
                <div>
                  <h4>Affected Model</h4>
                  <p>{log.affected_model}</p>
                  {log.affected_object && (
                    <small>Object: {log.affected_object}</small>
                  )}
                </div>
              </div>
            )}
          </div>

          {log.metadata && (
            <div className="metadata-section">
              <h4>
                <FiInfo /> Additional Information
              </h4>
              <div className="metadata-grid">{renderMetadata()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionLogDetailsModal;
