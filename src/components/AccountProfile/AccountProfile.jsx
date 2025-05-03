import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import "../AccountProfile/accountprofile.css";

const AccountProfile = () => {
  // Fetch school profile
  const { data: school, isLoading: schoolLoading } = useQuery({
    queryKey: ["schoolProfile"],
    queryFn: async () => {
      const response = await axios.get("/api/schools/students/");
      return response.data[0]; // Assuming the first result is the current school
    },
  });

  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const response = await axios.get("/api/scheduler/user-events/");
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading } = useQuery({
    queryKey: ["staffMembers"],
    queryFn: async () => {
      const response = await axios.get("/api/teachers/");
      // Log to debug shape
      console.log("Staff response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  if (schoolLoading || eventsLoading || staffLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="account-profile-container">
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={school?.logo || "https://api.dicebear.com/9.x/notionists/svg"}
            alt="School Logo"
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          <h1 className="school-name">{school?.name}</h1>
          <p className="school-type">{school?.type}</p>
          <div className="contact-info">
            <span className="contact-item">
              <FiMail /> {school?.email}
            </span>
            <span className="contact-item">
              <FiPhone /> {school?.phone || "Not provided"}
            </span>
          </div>
          <p className="registration-date">
            Member since{" "}
            {new Date(school?.registration_date).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="profile-cards-grid">
        {/* Staff Members Card */}
        <div className="profile-card">
          <h3 className="card-title">
            <FiUsers /> Staff Members
          </h3>
          <div className="staff-list">
            {Array.isArray(staffMembers) &&
              staffMembers.slice(0, 5).map((staff) => (
                <div key={staff.id} className="staff-item">
                  <img
                    src={
                      staff.user_details?.avatar ||
                      `https://api.dicebear.com/9.x/notionists/svg?seed=${staff.user_details?.id}`
                    }
                    alt={staff.user_details?.name}
                    className="staff-avatar"
                  />
                  <span className="staff-name">
                    {staff.user_details?.first_name}{" "}
                    {staff.user_details?.last_name}
                  </span>
                  <span className="staff-role">Teacher</span>
                </div>
              ))}
            {staffMembers.length > 5 && (
              <button className="view-all-button">
                View all {staffMembers.length} staff <FiArrowRight />
              </button>
            )}
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div className="profile-card">
          <h3 className="card-title">
            <FiCalendar /> Upcoming Events
          </h3>
          <div className="events-list">
            {Array.isArray(upcomingEvents) &&
              upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-date">
                    {new Date(event.start_datetime).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">{event.title}</h4>
                    <p className="event-time">
                      {new Date(event.start_datetime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            {upcomingEvents.length > 3 && (
              <button className="view-all-button">
                View all {upcomingEvents.length} events <FiArrowRight />
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="profile-card">
          <h3 className="card-title">Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{school?.stats?.students || 0}</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{school?.stats?.teachers || 0}</span>
              <span className="stat-label">Teachers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{school?.stats?.classes || 0}</span>
              <span className="stat-label">Classes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{school?.stats?.parents || 0}</span>
              <span className="stat-label">Parents</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
