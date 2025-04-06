import "../Contact/contact.css";

import { useState } from "react";
import {
  FaSchool,
  FaMapMarkerAlt,
  FaChalkboardTeacher,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolLevel: "",
    studentRange: "",
    teacherRange: "",
    location: "",
    contactPerson: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>Request a quote or contact our team for more information</p>
      </div>

      <div className="contact-container">
        <div className="contact-form-container">
          <h2>Request a Quote</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="input-group">
              <div className="contact-input-box">
                <input
                  type="text"
                  name="schoolName"
                  placeholder="Official School Name"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                />
                <FaSchool className="icon" />
              </div>

              <div className="contact-input-box">
                <select
                  name="schoolLevel"
                  value={formData.schoolLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    School Level
                  </option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="mixed">Primary & Secondary</option>
                  <option value="tertiary">College/University</option>
                </select>
                <FaChalkboardTeacher className="icon" />
              </div>
            </div>

            <div className="input-group">
              <div className="contact-input-box">
                <select
                  name="studentRange"
                  value={formData.studentRange}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Number of Students
                  </option>
                  <option value="0-300">0-300 Students</option>
                  <option value="301-600">301-600 Students</option>
                  <option value="601-1000">601-1000 Students</option>
                  <option value="1000+">1000+ Students</option>
                </select>
                <FaUser className="icon" />
              </div>

              <div className="contact-input-box">
                <select
                  name="teacherRange"
                  value={formData.teacherRange}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Number of Teachers
                  </option>
                  <option value="0-10">0-10 Teachers</option>
                  <option value="11-20">11-20 Teachers</option>
                  <option value="21-30">21-30 Teachers</option>
                  <option value="30+">30+ Teachers</option>
                </select>
                <FaChalkboardTeacher className="icon" />
              </div>
            </div>

            <div className="contact-input-box">
              <input
                type="text"
                name="location"
                placeholder="School Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <FaMapMarkerAlt className="icon" />
            </div>

            <div className="input-group">
              <div className="contact-input-box">
                <input
                  type="text"
                  name="contactPerson"
                  placeholder="Contact Person Name"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
                <FaUser className="icon" />
              </div>

              <div className="contact-input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FaEnvelope className="icon" />
              </div>
            </div>

            <div className="contact-input-box">
              <textarea
                name="message"
                placeholder="Your message or specific requirements..."
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              <FaPaperPlane className="icon" /> Send Request
            </button>
          </form>
        </div>

        <div className="contact-info-container">
          <h2>Our Contact Information</h2>
          <div className="contact-info-card">
            <div className="contact-info-item">
              <FaPhone className="icon" />
              <div>
                <h3>Phone</h3>
                <p>+254 700 123 456</p>
                <p>+254 720 987 654</p>
              </div>
            </div>

            <div className="contact-info-item">
              <FaEnvelope className="icon" />
              <div>
                <h3>Email</h3>
                <p>info@skuldata.com</p>
                <p>support@skuldata.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <FaMapMarkerAlt className="icon" />
              <div>
                <h3>Office Location</h3>
                <p>Westlands Business Center</p>
                <p>3rd Floor, Suite 302</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          <div className="business-hours">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
