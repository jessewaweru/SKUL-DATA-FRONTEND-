import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import StreamModal from "./StreamModal";
import "../Classes/classes.css";

const StreamsManagement = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await api.get("/streams/");
        setStreams(response.data);
      } catch (error) {
        console.error("Error fetching streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  const handleCreate = async (streamData) => {
    try {
      const response = await api.post("/streams/", streamData);
      setStreams([...streams, response.data]);
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating stream:", error);
    }
  };

  const handleUpdate = async (streamData) => {
    try {
      const response = await api.put(
        `/streams/${editingStream.id}/`,
        streamData
      );
      setStreams(
        streams.map((s) => (s.id === editingStream.id ? response.data : s))
      );
      setModalOpen(false);
      setEditingStream(null);
    } catch (error) {
      console.error("Error updating stream:", error);
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

      {loading ? (
        <div>Loading streams...</div>
      ) : (
        <div className="streams-list">
          {streams.map((stream) => (
            <div key={stream.id} className="stream-card">
              <div className="stream-info">
                <h3>{stream.name}</h3>
                <p>{stream.description || "No description"}</p>
              </div>
              <button
                className="edit-btn"
                onClick={() => {
                  setEditingStream(stream);
                  setModalOpen(true);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      <StreamModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStream(null);
        }}
        onSubmit={editingStream ? handleUpdate : handleCreate}
        initialData={editingStream}
      />
    </div>
  );
};

export default StreamsManagement;
