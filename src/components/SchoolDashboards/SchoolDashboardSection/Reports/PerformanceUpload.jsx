import React, { useState, useEffect } from "react";
import {
  FiDownload,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";

const PerformanceUpload = () => {
  const api = useApi();
  const [step, setStep] = useState(1); // 1: Download Template, 2: Upload Filled Template
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [term, setTerm] = useState("Term 1");
  const [schoolYear, setSchoolYear] = useState("2025");
  const [uploadFile, setUploadFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/schools/classes/");
      const data = response.data?.results || response.data || [];
      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setError("Failed to load classes. Please try again.");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/students/subjects/");
      const data = response.data?.results || response.data || [];
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError("Failed to load subjects. Please try again.");
    }
  };

  const handleDownloadTemplate = async () => {
    if (!selectedClass || !selectedSubject) {
      setError("Please select both class and subject");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await api.post(
        "/reports/generate-performance-template/",
        {
          class_id: selectedClass,
          subject_code: selectedSubject,
          term,
          school_year: schoolYear,
        },
        {
          responseType: "blob",
        }
      );

      // Download the CSV file
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const subjectObj = subjects.find((s) => s.code === selectedSubject);
      const classObj = classes.find((c) => c.id === parseInt(selectedClass));
      link.download = `${classObj?.name || "class"}_${
        subjectObj?.name || "subject"
      }_${term}_${schoolYear}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setStep(2); // Move to upload step
    } catch (err) {
      setError("Failed to generate template. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setUploadFile(file);
      setError(null);
    } else {
      setError("Please select a valid CSV file");
      setUploadFile(null);
    }
  };

  const handleUploadPerformance = async () => {
    if (!uploadFile) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("class_id", selectedClass);
      formData.append("subject_code", selectedSubject);
      formData.append("term", term);
      formData.append("school_year", schoolYear);

      const response = await api.post(
        "/reports/upload-performance/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadResult(response.data);
      setUploadFile(null);

      // Reset file input
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to upload performance data"
      );
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedClass("");
    setSelectedSubject("");
    setUploadFile(null);
    setUploadResult(null);
    setError(null);
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        padding: "30px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "10px", color: "#2c3e50" }}>
          Upload Student Performance
        </h2>
        <p style={{ color: "#7f8c8d", fontSize: "14px" }}>
          Follow the steps below to upload student academic performance data
        </p>
      </div>

      {/* Progress Steps */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "40px",
          position: "relative",
        }}
      >
        <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: step >= 1 ? "#3498db" : "#ecf0f1",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
              fontWeight: "bold",
            }}
          >
            1
          </div>
          <div
            style={{
              fontSize: "12px",
              color: step >= 1 ? "#2c3e50" : "#95a5a6",
            }}
          >
            Download Template
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "25%",
            right: "25%",
            height: "2px",
            background: step >= 2 ? "#3498db" : "#ecf0f1",
          }}
        />

        <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: step >= 2 ? "#3498db" : "#ecf0f1",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
              fontWeight: "bold",
            }}
          >
            2
          </div>
          <div
            style={{
              fontSize: "12px",
              color: step >= 2 ? "#2c3e50" : "#95a5a6",
            }}
          >
            Upload Filled Template
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: "15px",
            background: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#c0392b",
          }}
        >
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Success Display */}
      {uploadResult && (
        <div
          style={{
            padding: "20px",
            background: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <FiCheck style={{ color: "#27ae60", fontSize: "24px" }} />
            <h3 style={{ margin: 0, color: "#155724" }}>Upload Successful!</h3>
          </div>
          <div style={{ fontSize: "14px", color: "#155724" }}>
            <p>
              <strong>Created:</strong> {uploadResult.created} records
            </p>
            <p>
              <strong>Updated:</strong> {uploadResult.updated} records
            </p>
            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div>
                <p style={{ color: "#856404" }}>
                  <strong>Warnings:</strong>
                </p>
                <ul style={{ marginLeft: "20px" }}>
                  {uploadResult.errors.slice(0, 5).map((err, idx) => (
                    <li key={idx}>{err.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={resetForm}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              background: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiRefreshCw /> Upload Another Subject
          </button>
        </div>
      )}

      {/* Step 1: Download Template */}
      {step === 1 && (
        <div
          style={{
            padding: "25px",
            background: "#f8f9fa",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#2c3e50" }}>
            Step 1: Generate CSV Template
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#34495e",
                }}
              >
                Select Class *
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#34495e",
                }}
              >
                Select Subject *
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <option value="">Choose a subject...</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.code}>
                    {subj.name} ({subj.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#34495e",
                }}
              >
                Term *
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#34495e",
                }}
              >
                School Year *
              </label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                placeholder="e.g., 2025"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleDownloadTemplate}
            disabled={isGenerating || !selectedClass || !selectedSubject}
            style={{
              marginTop: "25px",
              padding: "12px 24px",
              background: isGenerating ? "#95a5a6" : "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isGenerating ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FiDownload />
            {isGenerating ? "Generating..." : "Download CSV Template"}
          </button>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#e8f4f8",
              border: "1px solid #b8dce8",
              borderRadius: "4px",
              fontSize: "13px",
              color: "#2c3e50",
            }}
          >
            <strong>📌 Instructions:</strong>
            <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>
                Select the class and subject you want to enter performance for
              </li>
              <li>
                Click "Download CSV Template" to get a pre-filled spreadsheet
              </li>
              <li>Open the CSV file in Excel or Google Sheets</li>
              <li>
                Fill in the score columns (entry, mid, end) for each student
              </li>
              <li>Add optional comments for students</li>
              <li>Save the file and return here to upload it</li>
            </ol>
          </div>
        </div>
      )}

      {/* Step 2: Upload Filled Template */}
      {step === 2 && (
        <div
          style={{
            padding: "25px",
            background: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#2c3e50" }}>
            Step 2: Upload Filled Template
          </h3>

          <div
            style={{
              padding: "20px",
              background: "white",
              border: "2px dashed #3498db",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <FiUpload
              style={{
                fontSize: "48px",
                color: "#3498db",
                marginBottom: "15px",
              }}
            />
            <p style={{ marginBottom: "15px", color: "#7f8c8d" }}>
              Upload the CSV file with student performance data
            </p>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <label
              htmlFor="file-upload"
              style={{
                padding: "10px 20px",
                background: "#3498db",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
                display: "inline-block",
                fontWeight: "600",
              }}
            >
              Choose CSV File
            </label>
            {uploadFile && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  background: "#e8f4f8",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                ✓ Selected: {uploadFile.name}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: "12px 24px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleUploadPerformance}
              disabled={isUploading || !uploadFile}
              style={{
                flex: 1,
                padding: "12px 24px",
                background: isUploading ? "#95a5a6" : "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isUploading || !uploadFile ? "not-allowed" : "pointer",
                fontSize: "15px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <FiUpload />
              {isUploading ? "Uploading..." : "Upload Performance Data"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceUpload;
