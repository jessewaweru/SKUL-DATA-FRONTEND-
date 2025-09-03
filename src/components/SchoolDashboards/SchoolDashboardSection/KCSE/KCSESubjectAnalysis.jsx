// import { useState, useEffect } from "react";
// import { useApi } from "../../../../hooks/useApi";
// import "./kcsemanagement.css";

// const KCSESubjectAnalysis = () => {
//   const api = useApi();
//   const [subjectData, setSubjectData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [availableSubjects, setAvailableSubjects] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [availableYears, setAvailableYears] = useState([]);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         // Fetch available years
//         const yearsResponse = await api.get("/kcse/school-performance/trends/");
//         const years = yearsResponse.data
//           .map((item) => item.year)
//           .sort((a, b) => b - a);
//         setAvailableYears(years);
//         if (years.length > 0) {
//           setSelectedYear(years[0]);
//         }

//         // Fetch available subjects
//         const subjectsResponse = await api.get("/subjects/");
//         setAvailableSubjects(subjectsResponse.data);
//         if (subjectsResponse.data.length > 0) {
//           setSelectedSubject(subjectsResponse.data[0].code);
//         }
//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//             err.message ||
//             "Failed to fetch initial data"
//         );
//       }
//     };

//     fetchInitialData();
//   }, [api]);

//   useEffect(() => {
//     const fetchSubjectData = async () => {
//       if (!selectedSubject || !selectedYear) return;

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await api.get(
//           `/kcse/subject-performance/subject-comparison/?subject=${selectedSubject}&years=${selectedYear}`
//         );
//         setSubjectData(response.data);
//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//             err.message ||
//             "Failed to fetch subject data"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubjectData();
//   }, [selectedSubject, selectedYear, api]);

//   return (
//     <div className="subject-analysis-container">
//       <div className="analysis-header">
//         <h2>Subject Performance Analysis</h2>

//         <div className="controls">
//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             disabled={loading || availableSubjects.length === 0}
//           >
//             {availableSubjects.map((subject) => (
//               <option key={subject.code} value={subject.code}>
//                 {subject.name} ({subject.code})
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             disabled={loading || availableYears.length === 0}
//           >
//             {availableYears.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {loading && (
//         <div className="loading-spinner">Loading subject data...</div>
//       )}
//       {error && <div className="error-message">{error}</div>}

//       {!loading && !error && subjectData.length > 0 && (
//         <div className="subject-analysis-content">
//           <div className="subject-summary">
//             <h3>
//               {availableSubjects.find((s) => s.code === selectedSubject)?.name}{" "}
//               Performance
//             </h3>
//             <div className="summary-cards">
//               <div className="kcse-summary-card">
//                 <h4>Mean Grade</h4>
//                 <div
//                   className={`summary-value grade-${subjectData[0].mean_grade
//                     .replace("+", "plus")
//                     .replace("-", "minus")}`}
//                 >
//                   {subjectData[0].mean_grade}
//                 </div>
//               </div>
//               <div className="kcse-summary-card">
//                 <h4>Mean Score</h4>
//                 <div className="summary-value">{subjectData[0].mean_score}</div>
//               </div>
//               <div className="kcse-summary-card">
//                 <h4>Pass Rate</h4>
//                 <div className="summary-value">
//                   {Math.round(
//                     (subjectData[0].passed / subjectData[0].total_students) *
//                       100
//                   )}
//                   %
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="performance-trend">
//             <h3>Performance Trend</h3>
//             <div className="trend-chart-placeholder">
//               <p>
//                 Chart showing performance trend over years would appear here
//               </p>
//               <div className="mock-chart">
//                 <div
//                   className="mock-bar"
//                   style={{ height: "150px", backgroundColor: "#4a0e4e" }}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           <div className="teacher-performance">
//             <h3>Teacher Performance</h3>
//             {subjectData[0].subject_teacher ? (
//               <div className="teacher-card">
//                 <div className="kcse-teacher-info">
//                   <h4>{subjectData[0].subject_teacher.user.full_name}</h4>
//                   <p>
//                     Teacher for{" "}
//                     {
//                       availableSubjects.find((s) => s.code === selectedSubject)
//                         ?.name
//                     }
//                   </p>
//                 </div>
//                 <div className="teacher-stats">
//                   <div className="kcse-stat-item">
//                     <span className="kcse-stat-label">Years Teaching:</span>
//                     <span className="kcse-stat-value">5</span>
//                   </div>
//                   <div className="kcse-stat-item">
//                     <span className="kcse-stat-label">Average Grade:</span>
//                     <span className="kcse-stat-value">
//                       {subjectData[0].mean_grade}
//                     </span>
//                   </div>
//                   <div className="kcse-stat-item">
//                     <span className="kcse-stat-label">Improvement:</span>
//                     <span className="kcse-stat-value positive">+12%</span>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <p>No teacher assigned for this subject</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default KCSESubjectAnalysis;

import { useState, useEffect } from "react";
import { useApi } from "../../../../hooks/useApi";
import "./kcsemanagement.css";

const KCSESubjectAnalysis = () => {
  const api = useApi();
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  // --- Debug statements ---
  console.log("Available years:", availableYears);
  console.log("Available subjects:", availableSubjects);
  console.log("Selected subject/year:", selectedSubject, selectedYear);
  console.log("Subject data:", subjectData);
  // ------------------------

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // 1. First fetch available years from trends endpoint
        const yearsResponse = await api.get("/kcse/school-performance/");
        const years = yearsResponse.data.results
          .map((item) => item.year)
          .sort((a, b) => b - a);
        setAvailableYears(years);

        if (years.length > 0) {
          setSelectedYear(years[0]);
        }

        // 2. Extract subjects from the first year's performance data
        if (yearsResponse.data.results.length > 0) {
          const firstYearData = yearsResponse.data.results[0];
          const subjects = firstYearData.subject_performances.map((sp) => ({
            code: sp.subject_code,
            name: sp.subject.name,
          }));

          setAvailableSubjects(subjects);
          if (subjects.length > 0) {
            setSelectedSubject(subjects[0].code);
          }
        }
      } catch (err) {
        console.error("Initial data fetch error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch initial data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [api]);

  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!selectedSubject || !selectedYear) return;

      setLoading(true);
      setError(null);

      try {
        // Use the subject-comparison endpoint for detailed subject data
        const response = await api.get(
          `/kcse/subject-performance/subject_comparison/?subject=${selectedSubject}&years=${selectedYear}`
        );

        if (response.data && response.data.length > 0) {
          setSubjectData(response.data);
        } else {
          setError(
            `No performance data found for ${selectedSubject} in ${selectedYear}`
          );
          setSubjectData([]);
        }
      } catch (err) {
        console.error("Subject data fetch error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch subject data"
        );
        setSubjectData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [selectedSubject, selectedYear, api]);

  const currentSubject = availableSubjects.find(
    (s) => s.code === selectedSubject
  ) || {
    name: selectedSubject || "Select a subject",
    code: selectedSubject,
  };

  return (
    <div className="subject-analysis-container">
      <div className="analysis-header">
        <h2>Subject Performance Analysis</h2>

        <div className="controls">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={loading || availableSubjects.length === 0}
          >
            {availableSubjects.length === 0 ? (
              <option value="">No subjects available</option>
            ) : (
              <>
                <option value="">Select a subject</option>
                {availableSubjects.map((subject) => (
                  <option key={subject.code} value={subject.code}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </>
            )}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            disabled={loading || availableYears.length === 0}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-spinner">Loading subject data...</div>
      )}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && subjectData.length > 0 && (
        <div className="subject-analysis-content">
          <div className="subject-summary">
            <h3>
              {currentSubject.name} Performance ({selectedYear})
            </h3>
            <div className="summary-cards">
              <div className="kcse-summary-card">
                <h4>Mean Grade</h4>
                <div
                  className={`summary-value grade-${subjectData[0].mean_grade
                    ?.replace("+", "plus")
                    ?.replace("-", "minus")}`}
                >
                  {subjectData[0].mean_grade || "N/A"}
                </div>
              </div>
              <div className="kcse-summary-card">
                <h4>Mean Score</h4>
                <div className="summary-value">
                  {subjectData[0].mean_score?.toFixed(2) || "N/A"}
                </div>
              </div>
              <div className="kcse-summary-card">
                <h4>Pass Rate</h4>
                <div className="summary-value">
                  {subjectData[0].total_students > 0
                    ? `${Math.round(
                        (subjectData[0].passed /
                          subjectData[0].total_students) *
                          100
                      )}%`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="teacher-performance">
            <h3>Teacher Information</h3>
            {subjectData[0]?.subject_teacher?.user ? (
              <div className="teacher-card">
                <div className="teacher-info">
                  <h4>{subjectData[0].subject_teacher.user.full_name}</h4>
                  <p>Teacher for {currentSubject.name}</p>
                </div>
              </div>
            ) : (
              <p>No teacher assigned for this subject</p>
            )}
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        subjectData.length === 0 &&
        availableSubjects.length > 0 && (
          <div className="no-data-message">
            No performance data available for {currentSubject.name} in{" "}
            {selectedYear}
          </div>
        )}
    </div>
  );
};

export default KCSESubjectAnalysis;
