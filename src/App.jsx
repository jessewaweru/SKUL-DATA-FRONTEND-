import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5Xd0VjWX5WcnZST2BeWkZ/"
);
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";
import LoginRegister from "./pages/LoginRegister.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./context/AuthProvider";
import MainLayout from "./components/MainLayout.jsx";
import ContactPage from "./pages/Contact/Contact.jsx";
import Pricing from "./pages/Pricing/Pricing.jsx";
import Calendar from "./pages/Calender/Calender.jsx";
import DashboardHome from "./components/Dashboards/SchoolDashboard/DashboardHome.jsx";
import UserAccounts from "./components/Dashboards/SchoolDashboard/Users/UserAccounts.jsx";
import UserRoles from "./components/Dashboards/SchoolDashboard/Users/UserRoles.jsx";
import UserSessions from "./components/Dashboards/SchoolDashboard/Users/UserSessions.jsx";
import CreateUser from "./components/Dashboards/SchoolDashboard/Users/UserCreation/CreateUser.jsx";
import EditUser from "./components/Dashboards/SchoolDashboard/Users/UserCreation/EditUser.jsx";

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <MainLayout />,
//     },
//     {
//       path: "/pricing",
//       element: <Pricing />,
//     },
//     {
//       path: "/login",
//       element: <LoginRegister mode="login" />,
//     },
//     {
//       path: "/register",
//       element: <LoginRegister mode="register" />,
//     },
//     {
//       path: "/dashboard",
//       element: <DashboardPage />,
//     },
//     {
//       path: "/contact",
//       element: <ContactPage />,
//     },
//     {
//       path: "/calender",
//       element: <Calendar />,
//     },
//     {
//       path: "*",
//       element: <Navigate to="/" replace />,
//     },
//   ]);

//   return (
//     <UserProvider>
//       <RouterProvider router={router} />
//     </UserProvider>
//   );
// }

// export default App;

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
    },
    {
      path: "/pricing",
      element: <Pricing />,
    },
    {
      path: "/login",
      element: <LoginRegister mode="login" />,
    },
    {
      path: "/register",
      element: <LoginRegister mode="register" />,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
      children: [
        {
          index: true,
          element: <DashboardHome />,
        },
        {
          path: "users",
          element: <UserAccounts />, // Default view when Users is clicked
        },
        {
          path: "users/accounts",
          element: <UserAccounts />,
        },
        {
          path: "users/roles",
          element: <UserRoles />,
        },
        {
          path: "users/create",
          element: <CreateUser />,
        },
        {
          path: "users/edit/:userId",
          element: <EditUser />,
        },
        {
          path: "users/sessions",
          element: <UserSessions />,
        },
        // Documents Section
        // {
        //   path: "documents",
        //   element: <DocumentsPage />,
        // },
        // // Reports Section
        // {
        //   path: "reports",
        //   element: <ReportsPage />,
        // },
        // // Teachers Section
        // {
        //   path: "teachers",
        //   element: <TeachersPage />,
        // },
        // // Parents Section
        // {
        //   path: "parents",
        //   element: <ParentsPage />,
        // },
        // // Students Section
        // {
        //   path: "students",
        //   element: <StudentsPage />,
        // },
        // // Classes Section
        // {
        //   path: "classes",
        //   element: <ClassesPage />,
        // },
        // // Analytics Section
        // {
        //   path: "analytics",
        //   element: <AnalyticsPage />,
        // },
        // // Calendar Section
        // {
        //   path: "calendar",
        //   element: <Calendar />,
        // },
      ],
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },
    {
      path: "/calender",
      element: <Calendar />,
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
