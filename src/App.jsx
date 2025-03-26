import LoginRegister from "./pages/LoginRegister";
import { SuperuserDashboard } from "./pages/Dashboard";
import { ParentDashboard } from "./pages/Dashboard";
import { TeacherDashboard } from "./pages/Dashboard";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./pages/HomePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
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

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
// function App() {
//   return (
//     <RouterProvider router={router}>
//       <UserProvider>
//         <Homepage />
//       </UserProvider>
//     </RouterProvider>
//   );
// }

export default App;
