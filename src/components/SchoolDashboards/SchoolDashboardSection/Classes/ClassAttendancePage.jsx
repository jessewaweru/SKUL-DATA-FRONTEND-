import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import {
  FiCalendar,
  FiCheck,
  FiX,
  FiSave,
  FiArrowLeft,
  FiUsers,
} from "react-icons/fi";
import "./classes.css";

const ClassAttendancePage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [presentStudents, setPresentStudents] = useState(new Set());
  const [absentReasons, setAbsentReasons] = useState({});
  const [existingAttendance, setExistingAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!classId) {
      setError("No class ID provided");
      setLoading(false);
      return;
    }
    fetchClassData();
  }, [classId, attendanceDate]);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch class details
      const classResponse = await api.get(`/api/schools/classes/${classId}/`);
      setClassData(classResponse.data);
      setStudents(classResponse.data.students || []);

      // Check if attendance already exists for this date
      const attendanceResponse = await api.get(
        `/api/schools/class-attendances/?school_class=${classId}&date=${attendanceDate}`
      );

      const attendanceRecords =
        attendanceResponse.data.results || attendanceResponse.data || [];

      if (attendanceRecords.length > 0) {
        const attendance = attendanceRecords[0];
        setExistingAttendance(attendance);
        setPresentStudents(
          new Set(attendance.present_students.map((s) => s.id))
        );

        // Parse notes for absence reasons
        if (attendance.notes) {
          const reasons = {};
          attendance.notes.split("\n").forEach((line) => {
            const match = line.match(/(.+):\s*(.+)/);
            if (match) {
              const studentName = match[1].trim();
              const reason = match[2].trim();
              const student = classResponse.data.students.find(
                (s) => s.full_name === studentName
              );
              if (student) {
                reasons[student.id] = reason;
              }
            }
          });
          setAbsentReasons(reasons);
        }
      } else {
        setExistingAttendance(null);
        setPresentStudents(new Set());
        setAbsentReasons({});
      }
    } catch (err) {
      console.error("Error fetching class data:", err);
      setError("Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentAttendance = (studentId) => {
    setPresentStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
        // Remove absence reason if marking as present
        setAbsentReasons((prev) => {
          const newReasons = { ...prev };
          delete newReasons[studentId];
          return newReasons;
        });
      }
      return newSet;
    });
  };

  const handleAbsentReasonChange = (studentId, reason) => {
    setAbsentReasons((prev) => ({
      ...prev,
      [studentId]: reason,
    }));
  };

  const markAllPresent = () => {
    setPresentStudents(new Set(students.map((s) => s.id)));
    setAbsentReasons({});
  };

  const markAllAbsent = () => {
    setPresentStudents(new Set());
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      setError(null);

      if (existingAttendance) {
        // Update existing attendance
        await api.post(
          `/api/schools/class-attendances/${existingAttendance.id}/mark_attendance/`,
          {
            student_ids: Array.from(presentStudents),
            absent_reasons: absentReasons,
          }
        );
      } else {
        // Create new attendance
        const response = await api.post("/api/schools/class-attendances/", {
          school_class: classId,
          date: attendanceDate,
          notes: Object.entries(absentReasons)
            .map(([id, reason]) => {
              const student = students.find((s) => s.id === parseInt(id));
              return student ? `${student.full_name}: ${reason}` : null;
            })
            .filter(Boolean)
            .join("\n"),
        });

        // Mark attendance
        await api.post(
          `/api/schools/class-attendances/${response.data.id}/mark_attendance/`,
          {
            student_ids: Array.from(presentStudents),
            absent_reasons: absentReasons,
          }
        );
      }

      alert("Attendance saved successfully! Parents have been notified.");
      fetchClassData(); // Refresh data
    } catch (err) {
      console.error("Error saving attendance:", err);
      setError("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="attendance-page">
        <div className="loading-spinner">Loading class data...</div>
      </div>
    );
  }

  if (error && !classData) {
    return (
      <div className="attendance-page">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/dashboard/classes")}>
            <FiArrowLeft /> Back to Classes
          </button>
        </div>
      </div>
    );
  }

  const presentCount = presentStudents.size;
  const absentCount = students.length - presentCount;
  const attendanceRate =
    students.length > 0
      ? ((presentCount / students.length) * 100).toFixed(1)
      : 0;

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <button
          className="back-button"
          onClick={() => navigate(`/dashboard/classes/manage/${classId}`)}
        >
          <FiArrowLeft /> Back to Class
        </button>

        <div className="header-info">
          <h2>
            <FiCalendar /> Take Attendance: {classData?.name}
          </h2>
          <p>
            {classData?.grade_level} - {classData?.academic_year}
          </p>
        </div>

        <div className="date-selector">
          <label>Date:</label>
          <input
            type="date"
            value={attendanceDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {existingAttendance && (
        <div className="info-banner">
          Attendance already recorded for this date. You can update it below.
        </div>
      )}

      <div className="attendance-stats">
        <div className="stat-card">
          <FiUsers />
          <div>
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card present">
          <FiCheck />
          <div>
            <div className="stat-value">{presentCount}</div>
            <div className="stat-label">Present</div>
          </div>
        </div>
        <div className="stat-card absent">
          <FiX />
          <div>
            <div className="stat-value">{absentCount}</div>
            <div className="stat-label">Absent</div>
          </div>
        </div>
        <div className="stat-card rate">
          <div className="stat-value">{attendanceRate}%</div>
          <div className="stat-label">Attendance Rate</div>
        </div>
      </div>

      <div className="attendance-actions">
        <button onClick={markAllPresent} className="btn-success">
          <FiCheck /> Mark All Present
        </button>
        <button onClick={markAllAbsent} className="btn-danger">
          <FiX /> Mark All Absent
        </button>
        <button
          onClick={handleSaveAttendance}
          className="btn-primary"
          disabled={saving}
        >
          <FiSave /> {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>

      <div className="students-list">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Admission No.</th>
              <th>Status</th>
              <th>Absence Reason (Optional)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const isPresent = presentStudents.has(student.id);
              return (
                <tr
                  key={student.id}
                  className={isPresent ? "present-row" : "absent-row"}
                >
                  <td>
                    <div className="student-info">
                      {student.photo && (
                        <img
                          src={student.photo}
                          alt={student.full_name}
                          className="student-avatar"
                        />
                      )}
                      <span>{student.full_name}</span>
                    </div>
                  </td>
                  <td>{student.admission_number}</td>
                  <td>
                    <button
                      onClick={() => toggleStudentAttendance(student.id)}
                      className={`status-toggle ${
                        isPresent ? "present" : "absent"
                      }`}
                    >
                      {isPresent ? (
                        <>
                          <FiCheck /> Present
                        </>
                      ) : (
                        <>
                          <FiX /> Absent
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    {!isPresent && (
                      <input
                        type="text"
                        placeholder="e.g., Sick, Medical appointment, Family emergency"
                        value={absentReasons[student.id] || ""}
                        onChange={(e) =>
                          handleAbsentReasonChange(student.id, e.target.value)
                        }
                        className="reason-input"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassAttendancePage;
