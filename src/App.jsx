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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
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
