import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient.js";
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
import { UserProvider } from "./context/AuthProvider.jsx";
import { RouterProvider } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import { createBrowserRouter, Navigate } from "react-router-dom";
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
import ReportsPage from "./components/Dashboards/SchoolDashboard/Reports/ReportsPage.jsx";
import GeneratedReports from "./components/Dashboards/SchoolDashboard/Reports/GeneratedReports.jsx";
import ReportTemplates from "./components/Dashboards/SchoolDashboard/Reports/ReportTemplates.jsx";
import ReportScheduler from "./components/Dashboards/SchoolDashboard/Reports/ReportScheduler.jsx";
import ReportBuilder from "./components/Dashboards/SchoolDashboard/Reports/ReportBuilder.jsx";
import ReportAnalytics from "./components/Dashboards/SchoolDashboard/Reports/ReportAnalytics.jsx";
import ParentReportRequest from "./components/Dashboards/SchoolDashboard/Reports/ParentReportRequest.jsx";
import ReportsOverview from "./components/Dashboards/SchoolDashboard/Reports/ReportsOverview .jsx";
import DocumentsMainPage from "./components/Dashboards/SchoolDashboard/Documents/DocumentsLayout.jsx";
import DocumentsOverview from "./components/Dashboards/SchoolDashboard/Documents/DocumentsOverview.jsx";
import DocumentCategories from "./components/Dashboards/SchoolDashboard/Documents/DocumentCategories.jsx";
import DocumentTemplates from "./components/Dashboards/SchoolDashboard/Documents/DocumentTemplates.jsx";
import SharedDocuments from "./components/Dashboards/SchoolDashboard/Documents/SharedDocuments.jsx";
import DocumentUploads from "./components/Dashboards/SchoolDashboard/Documents/DocumentUploads.jsx";
import ClassesPage from "./components/Dashboards/SchoolDashboard/Classes/ClassesPage.jsx";
import ClassManagement from "./components/Dashboards/SchoolDashboard/Classes/ClassManagement.jsx";
import ClassDetails from "./components/Dashboards/SchoolDashboard/Classes/ClassDetails.jsx";
import ClassCreateForm from "./components/Dashboards/SchoolDashboard/Classes/ClassCreateForm.jsx";
import ClassAttendanceSummary from "./components/Dashboards/SchoolDashboard/Classes/ClassAttendance.jsx";
import ClassDocumentsPage from "./components/Dashboards/SchoolDashboard/Classes/ClassDocumentsPage.jsx";
import ClassTimetablesPage from "./components/Dashboards/SchoolDashboard/Classes/ClassTimetablesPage.jsx";
import ClassAnalytics from "./components/Dashboards/SchoolDashboard/Classes/ClassAnalytics.jsx";
import StreamsManagement from "./components/Dashboards/SchoolDashboard/Classes/StreamsManagement.jsx";
import ClassesOverview from "./components/Dashboards/SchoolDashboard/Classes/ClassesOverview.jsx";
import StudentsPage from "./components/Dashboards/SchoolDashboard/Students/StudentsPage.jsx";
import StudentsOverview from "./components/Dashboards/SchoolDashboard/Students/StudentsOverview.jsx";
import StudentDirectory from "./components/Dashboards/SchoolDashboard/Students/StudentDirectory.jsx";
import StudentProfile from "./components/Dashboards/SchoolDashboard/Students/StudentProfile.jsx";
import CreateStudent from "./components/Dashboards/SchoolDashboard/Students/CreateStudent.jsx";
import EditStudent from "./components/Dashboards/SchoolDashboard/Students/EditStudent.jsx";
import StudentAnalytics from "./components/Dashboards/SchoolDashboard/Students/StudentAnalytics.jsx";
import TeachersPage from "./components/Dashboards/SchoolDashboard/Teachers/TeachersPage.jsx";
import TeachersOverview from "./components/Dashboards/SchoolDashboard/Teachers/TeachersOverview.jsx";
import TeacherProfiles from "./components/Dashboards/SchoolDashboard/Teachers/TeacherProfiles.jsx";
import TeacherCreateForm from "./components/Dashboards/SchoolDashboard/Teachers/TeacherCreateForm.jsx";
import TeacherProfileDetail from "./components/Dashboards/SchoolDashboard/Teachers/TeacherProfileDetail.jsx";
import TeacherEditForm from "./components/Dashboards/SchoolDashboard/Teachers/TeacherEditForm.jsx";
import TeacherReports from "./components/Dashboards/SchoolDashboard/Teachers/TeacherReports.jsx";
import TeacherDocuments from "./components/Dashboards/SchoolDashboard/Teachers/TeacherDocuments.jsx";
import TeacherActivityLogs from "./components/Dashboards/SchoolDashboard/Teachers/TeacherActivityLogs.jsx";
import ParentsPage from "./components/Dashboards/SchoolDashboard/Parents/ParentsPage.jsx";
import ParentsOverview from "./components/Dashboards/SchoolDashboard/Parents/ParentsOverview.jsx";
import ParentDetailWrapper from "./components/Dashboards/SchoolDashboard/Parents/ParentDetailWrapper.jsx";
import ParentProfile from "./components/Dashboards/SchoolDashboard/Parents/ParentProfile.jsx";
import ParentChildren from "./components/Dashboards/SchoolDashboard/Parents/ParentChildren.jsx";
import ParentDocuments from "./components/Dashboards/SchoolDashboard/Parents/ParentDocuments.jsx";
import ParentNotifications from "./components/Dashboards/SchoolDashboard/Parents/ParentNotifications.jsx";
import ParentActions from "./components/Dashboards/SchoolDashboard/Parents/ParentActions.jsx";
import CreateParent from "./components/Dashboards/SchoolDashboard/Parents/CreateParent.jsx";
import ParentMessages from "./components/Dashboards/SchoolDashboard/Parents/ParentMessages.jsx";
import ParentReportsAccess from "./components/Dashboards/SchoolDashboard/Parents/ParentReportsAccess.jsx";
import AllParents from "./components/Dashboards/SchoolDashboard/Parents/AllParents.jsx";
import ParentAnalytics from "./components/Dashboards/SchoolDashboard/Analytics/Parents/ParentAnalytics.jsx";
import DocumentAnalytics from "./components/Dashboards/SchoolDashboard/Analytics/Documents/DocumentAnalytics.jsx";
import SchoolWideAnalytics from "./components/Dashboards/SchoolDashboard/Analytics/SchoolWideAnalytics.jsx";
import AnalyticsPage from "./components/Dashboards/SchoolDashboard/Analytics/AnalyticsPage.jsx";
import AnalyticsOverview from "./components/Dashboards/SchoolDashboard/Analytics/AnalyticsOverview.jsx";
import TeacherAnalytics from "./components/Dashboards/SchoolDashboard/Analytics/Teachers/TeacherAnalytics.jsx";
import ReportBasedAnalytics from "./components/Dashboards/SchoolDashboard/Analytics/Reports/ReportBasedAnalytics.jsx";
import AnalyticsBuilder from "./components/Dashboards/SchoolDashboard/Analytics/AnalyticsBuilder.jsx";
import EventManagement from "./components/Dashboards/SchoolDashboard/Scheduler/EventManagement.jsx";
import CalendarView from "./components/Dashboards/SchoolDashboard/Scheduler/CalendarView.jsx";
import EventTemplates from "./components/Dashboards/SchoolDashboard/Scheduler/EventTemplates.jsx";
import SchedulerPage from "./components/Dashboards/SchoolDashboard/Scheduler/SchedulerPage.jsx";
import ActionLogs from "./components/Dashboards/SchoolDashboard/ActionLogs/ActionLogs.jsx";

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
        {
          path: "documents",
          element: <DocumentsMainPage />,
          children: [
            {
              index: true,
              element: <DocumentsOverview />, // Main documents list view
            },
            {
              path: "categories",
              element: <DocumentCategories />,
            },
            {
              path: "uploads",
              element: <DocumentUploads />,
            },
            {
              path: "shared",
              element: <SharedDocuments />,
            },
            {
              path: "templates",
              element: <DocumentTemplates />,
            },
          ],
        },
        // Reports Section
        {
          path: "reports",
          element: <ReportsPage />,
          children: [
            {
              index: true,
              element: <ReportsOverview />,
            },
            {
              index: true,
              element: <GeneratedReports />,
            },
            {
              path: "templates",
              element: <ReportTemplates />,
            },
            {
              path: "scheduler",
              element: <ReportScheduler />,
            },
            {
              path: "builder",
              element: <ReportBuilder />,
            },
            {
              path: "analytics",
              element: <ReportAnalytics />,
            },
            {
              path: "requests",
              element: <ParentReportRequest />,
            },
          ],
        },
        // Teachers Section
        {
          path: "teachers",
          element: <TeachersPage />,
          children: [
            {
              index: true,
              element: <TeachersOverview />,
            },
            {
              path: "profiles",
              element: <TeacherProfiles />,
              children: [
                {
                  index: true,
                  // Empty path shows the list
                },
                {
                  path: "create",
                  element: <TeacherCreateForm />,
                },
                {
                  path: ":id",
                  element: <TeacherProfileDetail />,
                },
                {
                  path: ":id/edit",
                  element: <TeacherEditForm />,
                },
              ],
            },
            {
              path: "reports",
              element: <TeacherReports />,
            },
            {
              path: "documents",
              element: <TeacherDocuments />,
            },
            {
              path: "activity-logs",
              element: <TeacherActivityLogs />,
            },
          ],
        },
        // Parents Section
        {
          path: "parents",
          element: <ParentsPage />,
          children: [
            {
              index: true,
              element: <ParentsOverview />,
            },
            {
              path: "create",
              element: <CreateParent />,
            },
            {
              path: ":parentId",
              element: <ParentDetailWrapper />,
              children: [
                {
                  index: true,
                  element: <Navigate to="profile" replace />,
                },
                {
                  path: "profile",
                  element: <ParentProfile />,
                },
                {
                  path: "children",
                  element: <ParentChildren />,
                },
                {
                  path: "documents",
                  element: <ParentDocuments />,
                },
                {
                  path: "notifications",
                  element: <ParentNotifications />,
                },
                {
                  path: "actions",
                  element: <ParentActions />,
                },
                {
                  path: "reports-access",
                  element: <ParentReportsAccess />,
                },
                {
                  path: "messages",
                  element: <ParentMessages />,
                },
              ],
            },
            {
              path: "all",
              element: <AllParents />, // Alternative list view if needed
            },
          ],
        },
        // Students Section
        {
          path: "students",
          element: <StudentsPage />,
          children: [
            {
              index: true,
              element: <StudentsOverview />,
            },
            {
              path: "directory",
              element: <StudentDirectory />,
            },
            {
              path: "profile/:studentId",
              element: <StudentProfile />,
            },
            {
              path: "analytics",
              element: <StudentAnalytics />,
            },
            {
              path: "create",
              element: <CreateStudent />,
            },
            {
              path: "edit/:studentId",
              element: <EditStudent />,
            },
          ],
        },
        // Classes Section
        {
          path: "classes",
          element: <ClassesPage />,
          children: [
            {
              index: true,
              element: <ClassesOverview />,
            },
            {
              path: "manage",
              element: <ClassManagement />,
              children: [
                {
                  path: ":classId",
                  element: <ClassDetails />,
                },
                {
                  path: "new",
                  element: <ClassCreateForm />,
                },
              ],
            },
            {
              path: "streams",
              element: <StreamsManagement />,
            },
            {
              path: "attendance",
              element: <ClassAttendanceSummary />,
            },
            {
              path: "documents",
              element: <ClassDocumentsPage />,
            },
            {
              path: "timetables",
              element: <ClassTimetablesPage />,
            },
            {
              path: "analytics",
              element: <ClassAnalytics />,
            },
          ],
        },
        // Analytics Section
        {
          path: "analytics",
          element: <AnalyticsPage />,
          children: [
            {
              index: true,
              element: <AnalyticsOverview />,
            },
            {
              path: "teachers",
              element: <TeacherAnalytics />,
            },
            {
              path: "students",
              element: <StudentAnalytics />,
            },
            {
              path: "classes",
              element: <ClassAnalytics />,
            },
            {
              path: "documents",
              element: <DocumentAnalytics />,
            },
            {
              path: "reports",
              element: <ReportBasedAnalytics />,
            },
            {
              path: "parents",
              element: <ParentAnalytics />,
            },
            {
              path: "school-wide",
              element: <SchoolWideAnalytics />,
            },
            {
              path: "builder",
              element: <AnalyticsBuilder />,
            },
          ],
        },
        // Action logs Section
        {
          path: "action-logs",
          element: <ActionLogs />,
          children: [
            {
              index: true,
              element: null, // Main component handles all views
            },
            {
              path: "users",
              element: null,
            },
            {
              path: "documents",
              element: null,
            },
            {
              path: "system",
              element: null,
            },
          ],
        },
        // Scheduler(Calendar) Section
        {
          path: "scheduler",
          element: <SchedulerPage />,
          children: [
            {
              index: true,
              element: <CalendarView />,
            },
            {
              path: "events",
              element: <EventManagement />,
            },
            {
              path: "templates",
              element: <EventTemplates />,
            },
          ],
        },
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
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;
