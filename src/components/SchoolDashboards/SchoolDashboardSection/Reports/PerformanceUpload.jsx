import React, { useState, useEffect } from "react";
import {
  FiDownload,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
  FiFileText,
  FiClock,
} from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";

const PerformanceUpload = () => {
  const api = useApi();
  const [step, setStep] = useState(1);
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

  const [reportGeneration, setReportGeneration] = useState({
    taskId: null,
    status: null,
    isGenerating: false,
  });

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (reportGeneration.taskId && reportGeneration.isGenerating) {
      const interval = setInterval(async () => {
        try {
          const response = await api.get(
            `/reports/check-report-status/${reportGeneration.taskId}/`
          );

          if (response.data.status === "SUCCESS") {
            setReportGeneration({
              ...reportGeneration,
              status: "completed",
              isGenerating: false,
            });
            clearInterval(interval);
          } else if (response.data.status === "FAILURE") {
            setReportGeneration({
              ...reportGeneration,
              status: "failed",
              isGenerating: false,
            });
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Failed to check status:", err);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [reportGeneration.taskId, reportGeneration.isGenerating]);

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
        { responseType: "blob" }
      );

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

      setStep(2);
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
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadResult(response.data);
      setUploadFile(null);

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

  const handleGenerateReports = async () => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await api.post("/reports/generate-reports-for-class/", {
        class_id: selectedClass,
        term,
        school_year: schoolYear,
      });

      setReportGeneration({
        taskId: response.data.task_id,
        status: "queued",
        isGenerating: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate reports");
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
    setReportGeneration({ taskId: null, status: null, isGenerating: false });
  };

  return (
    <div className="performance-upload-container">
      <div className="performance-upload-header">
        <h2>Upload Student Performance</h2>
        <p className="subtitle">
          Follow the steps below to upload student academic performance data
        </p>
      </div>

      {/* Progress Steps */}
      <div className="upload-progress-steps">
        <div className="progress-step">
          <div className={`step-circle ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`step-label ${step >= 1 ? "active" : ""}`}>
            Download Template
          </div>
        </div>
        <div className={`progress-line ${step >= 2 ? "active" : ""}`} />
        <div className="progress-step">
          <div className={`step-circle ${step >= 2 ? "active" : ""}`}>2</div>
          <div className={`step-label ${step >= 2 ? "active" : ""}`}>
            Upload Filled Template
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="upload-alert upload-alert-error">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Success Display */}
      {uploadResult && (
        <div className="upload-alert upload-alert-success">
          <div className="upload-success-header">
            <FiCheck />
            <h3>Upload Successful!</h3>
          </div>
          <div className="upload-success-details">
            <p>
              <strong>Created:</strong> {uploadResult.created} records
            </p>
            <p>
              <strong>Updated:</strong> {uploadResult.updated} records
            </p>

            {uploadResult.ready_for_reports ? (
              <div className="ready-for-reports-notice">
                <p>✓ All subjects completed! Ready to generate reports.</p>
                <button
                  onClick={handleGenerateReports}
                  disabled={reportGeneration.isGenerating}
                  className="btn-generate-reports"
                >
                  <FiFileText />
                  {reportGeneration.isGenerating
                    ? "Generating Reports..."
                    : "Generate Report Forms"}
                </button>
              </div>
            ) : (
              <div className="upload-progress-info">
                <p>
                  📊 Progress: {uploadResult.subjects_completed}/
                  {uploadResult.total_subjects} subjects completed
                </p>
                <p className="upload-progress-hint">
                  Upload performance for all subjects to generate reports
                </p>
              </div>
            )}

            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div className="upload-warnings">
                <p>
                  <strong>Warnings:</strong>
                </p>
                <ul>
                  {uploadResult.errors.slice(0, 5).map((err, idx) => (
                    <li key={idx}>{err.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button onClick={resetForm} className="btn-reset">
            <FiRefreshCw /> Upload Another Subject
          </button>
        </div>
      )}

      {/* Report Generation Status */}
      {reportGeneration.isGenerating && (
        <div className="report-generation-status">
          <div className="generation-header">
            <FiClock />
            <h3>Generating Reports...</h3>
          </div>
          <p>
            Please wait while we generate report forms for all students. This
            may take a few minutes.
          </p>
          <div className="generation-progress-bar">
            <div className="generation-progress-fill" />
          </div>
        </div>
      )}

      {reportGeneration.status === "completed" && (
        <div className="upload-alert upload-alert-success">
          <div className="upload-success-header">
            <FiCheck />
            <h3>Reports Generated Successfully!</h3>
          </div>
          <p>
            All report forms have been generated and are available in the
            "Generated Reports" section.
          </p>
        </div>
      )}

      {/* Step 1: Download Template */}
      {step === 1 && !uploadResult && (
        <div className="upload-step-container">
          <h3>Step 1: Generate CSV Template</h3>

          <div className="upload-form-grid">
            <div className="form-group">
              <label>Select Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Choose a subject...</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.code}>
                    {subj.name} ({subj.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Term *</label>
              <select value={term} onChange={(e) => setTerm(e.target.value)}>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>

            <div className="form-group">
              <label>School Year *</label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                placeholder="e.g., 2025"
              />
            </div>
          </div>

          <button
            onClick={handleDownloadTemplate}
            disabled={isGenerating || !selectedClass || !selectedSubject}
            className="btn-download-template"
          >
            <FiDownload />
            {isGenerating ? "Generating..." : "Download CSV Template"}
          </button>

          <div className="upload-instructions">
            <strong>📌 Instructions:</strong>
            <ol>
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
              <li>Repeat for all subjects before generating reports</li>
            </ol>
          </div>
        </div>
      )}

      {/* Step 2: Upload Filled Template */}
      {step === 2 && !reportGeneration.status && (
        <div className="upload-step-container">
          <h3>Step 2: Upload Filled Template</h3>

          <div className="file-upload-area">
            <FiUpload className="upload-icon" />
            <p>Upload the CSV file with student performance data</p>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload" className="btn-choose-file">
              Choose CSV File
            </label>
            {uploadFile && (
              <div className="file-selected">✓ Selected: {uploadFile.name}</div>
            )}
          </div>

          <div className="upload-actions">
            <button onClick={() => setStep(1)} className="btn-secondary">
              ← Back
            </button>
            <button
              onClick={handleUploadPerformance}
              disabled={isUploading || !uploadFile}
              className="btn-upload-performance"
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
