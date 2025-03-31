import LoginRegister from "./pages/LoginRegister";
import { SuperuserDashboard } from "./pages/Dashboards/Dashboard.jsx";
import { ParentDashboard } from "./pages/Dashboards/Dashboard.jsx";
import { TeacherDashboard } from "./pages/Dashboards/Dashboard.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
    },
    {
      path: "/login",
      element: <LoginRegister />,
    },
    {
      path: "/superuser-dashboard",
      element: (
        <ProtectedRoute allowedRoles={["superuser"]}>
          <SuperuserDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/parent-dashboard",
      element: (
        <ProtectedRoute allowedRoles={["parent"]}>
          <ParentDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/teacher-dashboard",
      element: (
        <ProtectedRoute allowedRoles={["teacher"]}>
          <TeacherDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
