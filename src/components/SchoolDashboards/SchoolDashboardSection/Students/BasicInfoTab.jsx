import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import "../Students/students.css";

const BasicInfoTab = ({ student }) => {
  return (
    <div className="basic-info-tab">
      <div className="info-section">
        <h3>Personal Information</h3>
        <div className="info-grid">
          <div>
            <strong>Date of Birth:</strong>
            <span>{new Date(student.date_of_birth).toLocaleDateString()}</span>
          </div>
          <div>
            <strong>Age:</strong>
            <span>{student.age} years</span>
          </div>
          <div>
            <strong>Gender:</strong>
            <span>{student.gender}</span>
          </div>
          <div>
            <strong>Admission Date:</strong>
            <span>{new Date(student.admission_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Contact Information</h3>
        <div className="contact-info">
          <div>
            <FiMail />
            <span>{student.email || "N/A"}</span>
          </div>
          <div>
            <FiPhone />
            <span>{student.phone_number || "N/A"}</span>
          </div>
          <div>
            <FiMapPin />
            <span>{student.address || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Parent/Guardian Information</h3>
        {student.parent && (
          <div className="parent-info">
            <h4>Primary Parent</h4>
            <p>{student.parent.user.full_name}</p>
            <p>{student.parent.user.phone_number}</p>
            <p>{student.parent.user.email}</p>
          </div>
        )}

        {student.guardians && student.guardians.length > 0 && (
          <div className="guardians-info">
            <h4>Additional Guardians</h4>
            {student.guardians.map((guardian) => (
              <div key={guardian.id} className="guardian">
                <p>{guardian.user.full_name}</p>
                <p>{guardian.user.phone_number}</p>
                <p>{guardian.user.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoTab;
