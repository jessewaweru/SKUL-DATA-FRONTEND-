import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./kcsemanagement.css";

const KCSEResultsView = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    parseInt(searchParams.get("year")) || new Date().getFullYear()
  );
  const [availableYears, setAvailableYears] = useState([]);
  const [exportFormat, setExportFormat] = useState("csv");

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await api.get("/kcse/school-performance/trends/");
        const data = Array.isArray(response.data) ? response.data : [];
        const years = data
          .map((item) => item.year)
          .filter((year) => year !== null && year !== undefined)
          .sort((a, b) => b - a);
        setAvailableYears(years);

        // If URL has a year param, use it; otherwise use the latest year
        const urlYear = parseInt(searchParams.get("year"));
        if (urlYear && years.includes(urlYear)) {
          setSelectedYear(urlYear);
        } else if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        console.error("Failed to fetch available years:", err);
        setAvailableYears([]);
      }
    };

    fetchAvailableYears();
  }, [api, searchParams]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedYear) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/kcse/results/?year=${selectedYear}`);

        // Ensure the response data is an array
        let resultsData = response.data;

        // Handle different possible response structures
        if (resultsData && typeof resultsData === "object") {
          // If response has a 'results' property (paginated response)
          if (Array.isArray(resultsData.results)) {
            resultsData = resultsData.results;
          }
          // If response has a 'data' property
          else if (Array.isArray(resultsData.data)) {
            resultsData = resultsData.data;
          }
          // If response is not an array but is an object, wrap it in an array
          else if (!Array.isArray(resultsData)) {
            resultsData = [resultsData];
          }
        }

        // Final safety check - ensure it's an array
        setResults(Array.isArray(resultsData) ? resultsData : []);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch results"
        );
        setResults([]); // Ensure results is an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedYear, api]);

  const handleExport = async () => {
    try {
      const response = await api.download(
        `/kcse/results/export-results/?year=${selectedYear}&format=${exportFormat}`
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `kcse_results_${selectedYear}.${exportFormat}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to export results"
      );
    }
  };

  const handlePublishToggle = async (resultId, publish) => {
    try {
      const endpoint = publish ? "publish" : "unpublish";
      await api.post(`/kcse/results/${resultId}/${endpoint}/`);

      setResults((prev) =>
        Array.isArray(prev)
          ? prev.map((result) =>
              result.id === resultId
                ? {
                    ...result,
                    is_published: publish,
                    published_at: publish ? new Date().toISOString() : null,
                  }
                : result
            )
          : []
      );
    } catch (err) {
      console.error("Publish toggle error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update publication status"
      );
    }
  };

  const viewStudentDetails = (studentId) => {
    navigate(`/dashboard/students/profile/${studentId}`);
  };

  // Ensure results is always an array before rendering
  const safeResults = Array.isArray(results) ? results : [];

  return (
    <div className="results-view-container">
      <div className="kcse-results-header">
        <h2>KCSE Results</h2>

        <div className="controls">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            disabled={loading}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>

          <button
            onClick={handleExport}
            disabled={loading || safeResults.length === 0}
            className="kcse-export-button"
          >
            Export Results
          </button>
        </div>
      </div>

      {loading && <div className="loading-spinner">Loading results...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="results-table-container">
          {safeResults.length === 0 ? (
            <p>No results found for {selectedYear}</p>
          ) : (
            <table className="kcse-results-table">
              <thead>
                <tr>
                  <th>Index No.</th>
                  <th>Admission No.</th>
                  <th>Student Name</th>
                  <th>Mean Grade</th>
                  <th>Points</th>
                  <th>Division</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.index_number || "N/A"}</td>
                    <td>{result.student?.admission_number || "N/A"}</td>
                    <td>{result.student?.full_name || "N/A"}</td>
                    <td
                      className={`grade-${(result.mean_grade || "")
                        .toString()
                        .replace("+", "plus")
                        .replace("-", "minus")}`}
                    >
                      {result.mean_grade || "N/A"}
                    </td>
                    <td>{result.mean_points || "N/A"}</td>
                    <td>{result.division || "N/A"}</td>
                    <td>
                      <span
                        className={`kcse-status-badge ${
                          result.is_published ? "published" : "unpublished"
                        }`}
                      >
                        {result.is_published ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="kcse-actions-cell">
                      <button
                        onClick={() =>
                          handlePublishToggle(result.id, !result.is_published)
                        }
                        className={`publish-toggle ${
                          result.is_published ? "unpublish" : "publish"
                        }`}
                      >
                        {result.is_published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => viewStudentDetails(result.student?.id)}
                        className="view-details"
                        disabled={!result.student?.id}
                      >
                        View Student
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default KCSEResultsView;
