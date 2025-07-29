import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";

const ExamSetupStep1 = () => {
  const { get } = useApi();
  const { examData, handleNext } = useOutletContext();
  const [examTypes, setExamTypes] = useState(null);
  const [classes, setClasses] = useState(null);
  const [formData, setFormData] = useState({
    name: examData.name || "",
    exam_type: examData.exam_type || null,
    term: examData.term || "Term 1",
    academic_year:
      examData.academic_year || new Date().getFullYear().toString(),
    school_class: examData.school_class || null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, classesRes] = await Promise.all([
          get("/exams/exam-types/"),
          get("/schools/classes/"),
        ]);

        // Extract data from paginated API response
        setExamTypes(typesRes.data?.results || typesRes.data || []);
        setClasses(classesRes.data?.results || classesRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setExamTypes([]);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext(formData);
  };

  if (loading || !examTypes || !classes) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="exam-setup-form">
      <h3>Basic Exam Information</h3>

      <div className="form-group">
        <label>Exam Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Exam Type</label>
        <select
          name="exam_type"
          value={formData.exam_type?.id || ""}
          onChange={(e) => {
            const selected = examTypes.find(
              (type) => type.id === parseInt(e.target.value)
            );
            handleSelectChange("exam_type", selected);
          }}
          required
        >
          <option value="">Select Exam Type</option>
          {examTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Term</label>
          <select
            name="term"
            value={formData.term}
            onChange={handleChange}
            required
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <div className="form-group">
          <label>Academic Year</label>
          <input
            type="text"
            name="academic_year"
            value={formData.academic_year}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Class</label>
        <select
          name="school_class"
          value={formData.school_class?.id || ""}
          onChange={(e) => {
            const selected = classes.find(
              (cls) => cls.id === parseInt(e.target.value)
            );
            handleSelectChange("school_class", selected);
          }}
          required
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Next
        </button>
      </div>
    </form>
  );
};

export default ExamSetupStep1;
