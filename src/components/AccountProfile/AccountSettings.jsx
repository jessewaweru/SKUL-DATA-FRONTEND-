import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FiSettings, FiSave, FiGlobe, FiInfo, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import "../AccountProfile/accountprofile.css";
import useUser from "../../hooks/useUser";

const AccountSettings = () => {
  const { user } = useUser();
  const { data: school, isLoading } = useQuery({
    queryKey: ["schoolSettings"],
    queryFn: async () => {
      const response = await axios.get("/api/schools/students/");
      // For school admin, they can only see their own school
      return response.data.find(
        (s) => s.id === user.school_admin_profile.school.id
      );
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    timezone: "Africa/Nairobi",
    academic_year_structure: "TERM",
  });

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || "",
        phone: school.phone || "",
        email: school.email || "",
        website: school.website || "",
        address: school.address || "",
        city: school.city || "",
        timezone: school.timezone || "Africa/Nairobi",
        academic_year_structure: school.academic_year_structure || "TERM",
      });
    }
  }, [school]);

  const updateSchool = useMutation({
    mutationFn: (updatedData) =>
      axios.patch(`/api/schools/students/${school.id}/`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      toast.success("School settings updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: (error) => {
      let errorMessage = "Failed to update school settings";
      if (error.response) {
        if (error.response.data && typeof error.response.data === "object") {
          errorMessage = Object.values(error.response.data).flat().join("\n");
        } else {
          errorMessage = error.response.data || errorMessage;
        }
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSchool.mutate(formData);
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>
          <FiSettings /> School Settings
        </h2>
        <p>Manage your school's profile and system settings</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h3 className="section-title">
            <FiUser /> Basic Information
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label>School Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="section-title">
            <FiGlobe /> Location & Time
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
              >
                <option value="Africa/Nairobi">
                  East Africa Time (Nairobi)
                </option>
                <option value="Africa/Dar_es_Salaam">
                  East Africa Time (Dar es Salaam)
                </option>
                <option value="Africa/Kampala">
                  East Africa Time (Kampala)
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Academic Year Structure</label>
              <select
                name="academic_year_structure"
                value={formData.academic_year_structure}
                onChange={handleChange}
              >
                <option value="TERM">Term System</option>
                <option value="SEMESTER">Semester System</option>
                <option value="QUARTER">Quarter System</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="action-button">
            Cancel
          </button>
          <button type="submit" className="action-button primary">
            <FiSave /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
