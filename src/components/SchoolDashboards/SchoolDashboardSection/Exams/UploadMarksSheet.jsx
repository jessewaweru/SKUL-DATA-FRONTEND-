import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import Papa from "papaparse";

const UploadMarksSheet = () => {
  const { examId, subjectId } = useParams();
  const { get, post } = useApi();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [subject, setSubject] = useState(null);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, subjectRes] = await Promise.all([
          get(`/exams/${examId}/`),
          get(`/students/subjects/${subjectId}/`),
        ]);
        setExam(examRes.data);
        setSubject(subjectRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId, subjectId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewData([]);
    setValidationErrors([]);

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        setPreviewData(results.data.slice(0, 5)); // Show first 5 rows as preview
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file. Please check the format.");
      },
    });
  };

  const validateData = (data) => {
    const errors = [];

    // Check required columns
    const requiredColumns = ["admission_number", "score"];
    const headers = Object.keys(data[0] || {});

    requiredColumns.forEach((col) => {
      if (!headers.includes(col)) {
        errors.push(`Missing required column: ${col}`);
      }
    });

    // Check score values
    data.forEach((row, index) => {
      if (row.score && isNaN(parseFloat(row.score))) {
        errors.push(`Invalid score value in row ${index + 1}: ${row.score}`);
      }
    });

    return errors;
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const errors = validateData(results.data);
        if (errors.length > 0) {
          setValidationErrors(errors);
          return;
        }

        setUploading(true);
        try {
          const formattedData = results.data.map((row) => ({
            admission_number: row.admission_number,
            score: row.score ? parseFloat(row.score) : null,
            is_absent: row.is_absent === "true" || row.is_absent === "1",
            teacher_comment: row.teacher_comment || "",
          }));

          await post(`/exams/${examId}/subjects/${subjectId}/upload-marks/`, {
            marks: formattedData,
          });

          alert("Marks uploaded successfully!");
          navigate(
            `/dashboard/exams/enter-marks/manual/${examId}/${subjectId}`
          );
        } catch (error) {
          console.error("Error uploading marks:", error);
          alert(
            "Failed to upload marks. Please check the file format and try again."
          );
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file. Please check the format.");
        setUploading(false);
      },
    });
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="upload-marks-container">
      <div className="upload-header">
        <h2>
          Upload Marks: {exam.name} - {subject.name}
        </h2>
        <div className="upload-subheader">
          <p>Class: {exam.school_class.name}</p>
          <p>
            Max Score:{" "}
            {exam.subjects.find((s) => s.id === parseInt(subjectId))
              ?.max_score || 100}
          </p>
        </div>
      </div>

      <div className="upload-instructions">
        <h3>Instructions:</h3>
        <ol>
          <li>
            Download the template file or use your own CSV file with the
            following columns:
          </li>
          <ul>
            <li>
              <strong>admission_number</strong> (required) - Student's admission
              number
            </li>
            <li>
              <strong>score</strong> (required) - Numeric score (leave blank if
              absent)
            </li>
            <li>
              <strong>is_absent</strong> (optional) - "true" or "1" if student
              was absent
            </li>
            <li>
              <strong>teacher_comment</strong> (optional) - Teacher's remarks
            </li>
          </ul>
          <li>Save your file as a CSV (Comma Separated Values) file</li>
          <li>Upload the file using the form below</li>
        </ol>

        <button className="btn-secondary">Download Template</button>
      </div>

      <div className="upload-form">
        <div className="form-group">
          <label>Select CSV File</label>
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>

        {file && (
          <div className="file-preview">
            <h4>File Preview (first 5 rows)</h4>
            <table>
              <thead>
                <tr>
                  {previewData.length > 0 &&
                    Object.keys(previewData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="validation-errors">
            <h4>Validation Errors:</h4>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="upload-actions">
        <button
          className="btn-secondary"
          onClick={() => navigate("/dashboard/exams/enter-marks")}
        >
          Back to Exams
        </button>
        <button
          className="btn-primary"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload Marks"}
        </button>
      </div>
    </div>
  );
};

export default UploadMarksSheet;
