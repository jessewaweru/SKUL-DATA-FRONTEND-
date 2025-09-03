import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import StreamModal from "./StreamModal";
import "../Classes/classes.css";

const StreamsManagement = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fixed URL: changed from "/streams/" to "/api/schools/streams/"
        const response = await api.get("/api/schools/streams/");

        // Handle both paginated (results) and non-paginated responses
        const streamsData = response.data.results || response.data;

        if (!Array.isArray(streamsData)) {
          throw new Error("Unexpected response format: expected an array");
        }

        setStreams(streamsData);
      } catch (error) {
        console.error("Error fetching streams:", {
          error: error.response?.data || error.message,
          status: error.response?.status,
        });
        setError(error.message);
        setStreams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [api]);

  const handleCreate = async (streamData) => {
    try {
      setError(null);
      // Fixed URL: changed from "/api/streams/" to "/api/schools/streams/"
      const response = await api.post("/api/schools/streams/", streamData);
      setStreams([...streams, response.data]);
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating stream:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleUpdate = async (streamData) => {
    try {
      setError(null);
      // Fixed URL: changed from "/streams/" to "/api/schools/streams/"
      const response = await api.put(
        `/api/schools/streams/${editingStream.id}/`,
        streamData
      );
      setStreams(
        streams.map((s) => (s.id === editingStream.id ? response.data : s))
      );
      setModalOpen(false);
      setEditingStream(null);
    } catch (error) {
      console.error("Error updating stream:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (streamId) => {
    if (!window.confirm("Are you sure you want to delete this stream?")) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/api/schools/streams/${streamId}/`);
      setStreams(streams.filter((s) => s.id !== streamId));
    } catch (error) {
      console.error("Error deleting stream:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="streams-management">
      <div className="streams-header">
        <h2>Stream Management</h2>
        <button
          className="create-btn"
          onClick={() => {
            setEditingStream(null);
            setModalOpen(true);
          }}
        >
          Create New Stream
        </button>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            color: "#dc3545",
            background: "#f8d7da",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="loading-message">Loading streams...</div>
      ) : streams.length === 0 ? (
        <div className="no-data-message">
          <p>No streams found for your school.</p>
          <p>Create your first stream using the button above.</p>
        </div>
      ) : (
        <div className="streams-list">
          {streams.map((stream) => (
            <div key={stream.id} className="stream-card">
              <div className="stream-info">
                <h3>{stream.name}</h3>
                <p>{stream.description || "No description"}</p>
                <div className="stream-meta">
                  <small>
                    Created: {new Date(stream.created_at).toLocaleDateString()}
                  </small>
                </div>
              </div>
              <div className="stream-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingStream(stream);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(stream.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <StreamModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStream(null);
          setError(null);
        }}
        onSubmit={editingStream ? handleUpdate : handleCreate}
        initialData={editingStream}
      />
    </div>
  );
};

export default StreamsManagement;
