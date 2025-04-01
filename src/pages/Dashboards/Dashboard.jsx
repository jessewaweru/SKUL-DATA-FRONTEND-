import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

const Dashboard = ({ userRole }) => {
  const { user } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (user) {
      axios
        .get(`api/${user.role}-dashboard`)
        .then((res) => setDashboardData(res.data))
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [user, userRole]);

  if (!user) return <p>Loading...</p>;
  if (!dashboardData) return <p>Fetching data...</p>;

  return (
    <div className="dashboard-container">
      <ProfileDropdown />
      <h1>{user.role} Dashboard</h1>
      <div className="dashboard-stats">
        {Object.keys(dashboardData).map((key) => {
          return (
            <div key={key} className="dashboard-card">
              <h3>{key.replace("_", " ")}</h3>
              <p>{dashboardData[key]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SuperuserDashboard = () => <Dashboard userRole={"superuser"} />;
export const TeacherDashboard = () => <Dashboard userRole={"teacher"} />;
export const ParentDashboard = () => <Dashboard userRole={"parent"} />;
