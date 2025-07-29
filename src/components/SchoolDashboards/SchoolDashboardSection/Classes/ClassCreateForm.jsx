import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { FiX, FiSave } from "react-icons/fi";
import "../Classes/classes.css";

const ClassCreateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    grade_level: "",
    stream: null,
    level: "PRIMARY",
    academic_year:
      new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
    room_number: "",
    capacity: 30,
  });
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await api.get("/streams/");
        setStreams(response.data);
      } catch (err) {
        console.error("Error fetching streams:", err);
      }
    };
    fetchStreams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/classes/", {
        ...formData,
        stream: formData.stream?.id || null,
      });
      navigate(`/classes/manage/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="class-create-form">
      <div className="form-header">
        <h2>Create New Class</h2>
        <button
          className="close-btn"
          onClick={() => navigate("/classes/manage")}
        >
          <FiX />
        </button>
      </div>

      {error && <div className="fee-error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Class Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Grade Level</label>
            <select
              value={formData.grade_level}
              onChange={(e) =>
                setFormData({ ...formData, grade_level: e.target.value })
              }
              required
            >
              <option value="">Select grade</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="Grade 1">Grade 1</option>
              {/* Other grade options */}
            </select>
          </div>

          <div className="form-group">
            <label>Stream</label>
            <select
              value={formData.stream?.id || ""}
              onChange={(e) => {
                const selected = streams.find((s) => s.id === e.target.value);
                setFormData({ ...formData, stream: selected || null });
              }}
            >
              <option value="">No stream</option>
              {streams.map((stream) => (
                <option key={stream.id} value={stream.id}>
                  {stream.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Level</label>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
            >
              <option value="PRIMARY">Primary</option>
              <option value="SECONDARY">Secondary</option>
            </select>
          </div>

          <div className="form-group">
            <label>Academic Year</label>
            <input
              type="text"
              value={formData.academic_year}
              onChange={(e) =>
                setFormData({ ...formData, academic_year: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/classes/manage")}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            <FiSave /> {loading ? "Creating..." : "Create Class"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassCreateForm;
