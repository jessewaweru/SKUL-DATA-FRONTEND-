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
