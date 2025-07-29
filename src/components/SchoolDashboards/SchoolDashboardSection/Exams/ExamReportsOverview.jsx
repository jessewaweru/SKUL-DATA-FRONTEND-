import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const ExamReportsOverview = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await get("/exams/terms/");
        setTerms(response.data);
      } catch (error) {
        console.error("Error fetching terms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="reports-overview-container">
      <h2>Exam Reports</h2>

      <div className="reports-options">
        <div className="report-card" onClick={() => navigate("consolidated")}>
          <h3>Consolidated Term Reports</h3>
          <p>View and generate reports combining all term exams</p>
        </div>

        <div className="terms-list">
          <h3>Term Reports</h3>
          {terms.length === 0 ? (
            <p>No terms available</p>
          ) : (
            <ul>
              {terms.map((term) => (
                <li
                  key={`${term.term}-${term.academic_year}`}
                  onClick={() =>
                    navigate(`term/${term.term}-${term.academic_year}`)
                  }
                >
                  {term.term} {term.academic_year}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamReportsOverview;
