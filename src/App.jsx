import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient.js";
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5Xd0VjWX5WcnZST2BeWkZ/"
);
import { MantineProvider } from "@mantine/core";
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
import DashboardHome from "./components/SchoolDashboards/SchoolDashboardSection/DashboardHome.jsx";
import UserAccounts from "./components/SchoolDashboards/SchoolDashboardSection/Users/UserAccounts.jsx";
import UserRoles from "./components/SchoolDashboards/SchoolDashboardSection/Users/UserRoles.jsx";
import UserSessions from "./components/SchoolDashboards/SchoolDashboardSection/Users/UserSessions.jsx";
import CreateUser from "./components/SchoolDashboards/SchoolDashboardSection/Users/UserCreation/CreateUser.jsx";
import EditUser from "./components/SchoolDashboards/SchoolDashboardSection/Users/UserCreation/EditUser.jsx";
import ReportsPage from "./components/SchoolDashboards/SchoolDashboardSection/Reports/ReportsPage.jsx";
import GeneratedReports from "./components/SchoolDashboards/SchoolDashboardSection/Reports/GeneratedReports.jsx";
import ReportTemplates from "./components/SchoolDashboards/SchoolDashboardSection/Reports/ReportTemplates.jsx";
import ReportScheduler from "./components/SchoolDashboards/SchoolDashboardSection/Reports/ReportScheduler.jsx";
import ReportBuilder from "./components/SchoolDashboards/SchoolDashboardSection/Reports/ReportBuilder.jsx";
import ReportAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Reports/ReportAnalytics.jsx";
import ParentReportRequest from "./components/SchoolDashboards/SchoolDashboardSection/Reports/ParentReportRequest.jsx";
import ReportsOverview from "./components/SchoolDashboards/SchoolDashboardSection/Reports/ReportsOverview.jsx";
import DocumentsMainPage from "./components/SchoolDashboards/SchoolDashboardSection/Documents/DocumentsLayout.jsx";
import DocumentsOverview from "./components/SchoolDashboards/SchoolDashboardSection/Documents/DocumentsOverview.jsx";
import DocumentCategories from "./components/SchoolDashboards/SchoolDashboardSection/Documents/DocumentCategories.jsx";
import DocumentTemplates from "./components/SchoolDashboards/SchoolDashboardSection/Documents/DocumentTemplates.jsx";
import SharedDocuments from "./components/SchoolDashboards/SchoolDashboardSection/Documents/SharedDocuments.jsx";
import DocumentUploads from "./components/SchoolDashboards/SchoolDashboardSection/Documents/DocumentUploads.jsx";
import ClassesPage from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassesPage.jsx";
import ClassManagement from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassManagement.jsx";
import ClassDetails from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassDetails.jsx";
import ClassCreateForm from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassCreateForm.jsx";
import ClassAttendanceSummary from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassAttendance.jsx";
import ClassDocumentsPage from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassDocumentsPage.jsx";
import ClassTimetablesPage from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassTimetablesPage.jsx";
import ClassAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassAnalytics.jsx";
import StreamsManagement from "./components/SchoolDashboards/SchoolDashboardSection/Classes/StreamsManagement.jsx";
import ClassesOverview from "./components/SchoolDashboards/SchoolDashboardSection/Classes/ClassesOverview.jsx";
import StudentsPage from "./components/SchoolDashboards/SchoolDashboardSection/Students/StudentsPage.jsx";
import StudentsOverview from "./components/SchoolDashboards/SchoolDashboardSection/Students/StudentsOverview.jsx";
import StudentDirectory from "./components/SchoolDashboards/SchoolDashboardSection/Students/StudentDirectory.jsx";
import StudentProfile from "./components/SchoolDashboards/SchoolDashboardSection/Students/StudentProfile.jsx";
import CreateStudent from "./components/SchoolDashboards/SchoolDashboardSection/Students/CreateStudent.jsx";
import EditStudent from "./components/SchoolDashboards/SchoolDashboardSection/Students/EditStudent.jsx";
import StudentAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Students/StudentAnalytics.jsx";
import TeachersPage from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeachersPage.jsx";
import TeachersOverview from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeachersOverview.jsx";
import TeacherProfiles from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeacherProfiles.jsx";
import TeacherCreateForm from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeacherCreateForm.jsx";
import TeacherProfileDetail from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeacherProfileDetail.jsx";
import TeacherEditForm from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeacherEditForm.jsx";
import TeacherReports from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeacherReports.jsx";
import TeacherDocuments from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeacherDocuments.jsx";
import TeacherActivityLogs from "./components/SchoolDashboards/SchoolDashboardSection/Teachers/TeacherActivityLogs.jsx";
import ParentsPage from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentsPage.jsx";
import ParentsOverview from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentsOverview.jsx";
import ParentDetailWrapper from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentDetailWrapper.jsx";
import ParentProfile from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentProfile.jsx";
import ParentChildren from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentChildren.jsx";
import ParentDocuments from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentDocuments.jsx";
import ParentNotifications from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentNotifications.jsx";
import ParentActions from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentActions.jsx";
import CreateParent from "./components/SchoolDashboards/SchoolDashboardSection/Parents/CreateParent.jsx";
import ParentMessages from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentMessages.jsx";
import ParentReportsAccess from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentReportsAccess.jsx";
import AllParents from "./components/SchoolDashboards/SchoolDashboardSection/Parents/AllParents.jsx";
import ParentAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Analytics/Parents/ParentAnalytics.jsx";
import DocumentAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Analytics/Documents/DocumentAnalytics.jsx";
import SchoolWideAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Analytics/SchoolWideAnalytics.jsx";
import AnalyticsPage from "./components/SchoolDashboards/SchoolDashboardSection/Analytics/AnalyticsPage.jsx";
import AnalyticsOverview from "./components/SchoolDashboards/SchoolDashboardSection/Analytics/AnalyticsOverview.jsx";
import TeacherAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Analytics/Teachers/TeacherAnalytics.jsx";
import ReportBasedAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Analytics/Reports/ReportBasedAnalytics.jsx";
import AnalyticsBuilder from "./components/SchoolDashboards/SchoolDashboardSection/Analytics/AnalyticsBuilder.jsx";
import EventManagement from "./components/SchoolDashboards/SchoolDashboardSection/Scheduler/EventManagement.jsx";
import CalendarView from "./components/SchoolDashboards/SchoolDashboardSection/Scheduler/CalendarView.jsx";
import EventTemplates from "./components/SchoolDashboards/SchoolDashboardSection/Scheduler/EventTemplates.jsx";
import SchedulerPage from "./components/SchoolDashboards/SchoolDashboardSection/Scheduler/SchedulerPage.jsx";
import ActionLogs from "./components/SchoolDashboards/SchoolDashboardSection/ActionLogs/ActionLogs.jsx";
import AccountProfilePage from "./components/AccountProfile/AccountProfilePage.jsx";
import AccountProfile from "./components/AccountProfile/AccountProfile.jsx";
import AccountSecurity from "./components/AccountProfile/AccountSecurity.jsx";
import AccountSubscription from "./components/AccountProfile/AccountSubscription.jsx";
import AccountMessages from "./components/AccountProfile/AccountMessages.jsx";
import AccountNotifications from "./components/AccountProfile/AccountNotifications.jsx";
import AccountSettings from "./components/AccountProfile/AccountSettings.jsx";
import TeacherDashboardPage from "./pages/TeacherDashboardPage.jsx";
import ParentDashboardPage from "./pages/ParentDashboardPage/ParentDashboardPage.jsx";
import ParentBulkImport from "./components/SchoolDashboards/SchoolDashboardSection/Parents/ParentBulkImport.jsx";
import MessagesPage from "./components/SchoolDashboards/SchoolDashboardSection/Messages/MessagesPage.jsx";
import MessagesInbox from "./components/SchoolDashboards/SchoolDashboardSection/Messages/MessagesInbox.jsx";
import MessagesCompose from "./components/SchoolDashboards/SchoolDashboardSection/Messages/MessagesCompose.jsx";
import MessagesContacts from "./components/SchoolDashboards/SchoolDashboardSection/Messages/MessagesContacts.jsx";
import MessagesSent from "./components/SchoolDashboards/SchoolDashboardSection/Messages/MessagesSent.jsx";
import AdminManagement from "./components/SchoolDashboards/SchoolDashboardSection/Users/AdminManagement/AdminManagement.jsx";
import TimetablesPage from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetablesPage.jsx";
import ViewAllTimetables from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/ViewAllTimetables.jsx";
import CreateTimetableWrapper from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/CreateTimetableWrapper.jsx";
import TimetableSetupStep1 from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetableSetupStep1.jsx";
import TimetableSetupStep2 from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetableSetupStep2.jsx";
import TimetableSetupStep3 from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetableSetupStep3.jsx";
import TimetableSetupStep4 from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetableSetupStep4.jsx";
import TimetableSetupStep5 from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetableSetupStep5.jsx";
import TimetableDetailView from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetableDetailView.jsx";
import TeacherTimetables from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TeacherTimetables.jsx";
import SubjectsManagement from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/SubjectsManagement.jsx";
import TimetableConstraints from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetableConstraints.jsx";
import TimetableFeedback from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/TimetableFeedback.jsx";
import SubjectGroupsManagement from "./components/SchoolDashboards/SchoolDashboardSection/Timetables/SubjectGroupsManagement.jsx";
import FeeManagementPage from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeeManagementPage.jsx";
import FeeDashboard from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeeDashboard.jsx";
import FeeUploads from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeeUploads.jsx";
import FeeRecords from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeeRecords.jsx";
import FeePayments from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeePayments.jsx";
import FeeInvoices from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeeInvoices.jsx";
import FeeReminders from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeeReminders.jsx";
import FeeReports from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeeReports.jsx";
import FeeSettings from "./components/SchoolDashboards/SchoolDashboardSection/FeeManagement/FeeSettings.jsx";
import ExamsPage from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamsPage.jsx";
import ExamsDashboard from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamsDashboard.jsx";
import ExamSetupWrapper from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamSetupWrapper.jsx";
import ExamSetupStep1 from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamSetupStep1.jsx";
import ExamSetupStep2 from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamSetupStep2.jsx";
import ExamSetupStep3 from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamSetupStep3.jsx";
import GradingSystemsManagement from "./components/SchoolDashboards/SchoolDashboardSection/Exams/GradingSystemsManagement.jsx";
import EnterMarksWrapper from "./components/SchoolDashboards/SchoolDashboardSection/Exams/EnterMarksWrapper.jsx";
import SelectExamForMarks from "./components/SchoolDashboards/SchoolDashboardSection/Exams/SelectExamForMarks.jsx";
import EnterMarksManual from "./components/SchoolDashboards/SchoolDashboardSection/Exams/EnterMarksManual.jsx";
import UploadMarksSheet from "./components/SchoolDashboards/SchoolDashboardSection/Exams/UploadMarksSheet.jsx";
import ExamResultsWrapper from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamResultsWrapper.jsx";
import ExamResultsOverview from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamResultsOverview.jsx";
import ClassExamResults from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ClassExamResults.jsx";
import StudentExamResults from "./components/SchoolDashboards/SchoolDashboardSection/Exams/StudentExamResults.jsx";
import PublishExamResults from "./components/SchoolDashboards/SchoolDashboardSection/Exams/PublishExamResults.jsx";
import ExamReportsWrapper from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamReportsWrapper.jsx";
import ExamReportsOverview from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamReportsOverview.jsx";
import TermExamReports from "./components/SchoolDashboards/SchoolDashboardSection/Exams/TermExamReports.jsx";
import ConsolidatedReports from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ConsolidatedReports.jsx";
import ExamAnalytics from "./components/SchoolDashboards/SchoolDashboardSection/Exams/ExamAnalytics.jsx";
import KCSEDashboard from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSEDashboard";
import KCSETemplateDownload from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSETemplateDownload";
import KCSEUploadResults from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSEUploadResults";
import KCSEResultsView from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSEResultsView";
import KCSESchoolPerformance from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSESchoolPerformance";
import KCSESubjectAnalysis from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSESubjectAnalysis";
import KCSEComparativeAnalysis from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSEComparativeAnalysis";
import KCSETeacherPerformance from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSETeacherPerformance";
import KCSEManagement from "./components/SchoolDashboards/SchoolDashboardSection/KCSE/KCSEManagement.jsx";

console.log("DEBUG TEST - App component mounted"); // Debug A
console.log("Environment Variables:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
});

function App() {
  useEffect(() => {
    console.log("Current auth status:", {
      isLoggedIn: !!localStorage.getItem("accessToken"),
      tokens: {
        access: localStorage.getItem("accessToken"),
        refresh: localStorage.getItem("refreshToken"),
      },
    });
  }, []);
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
      path: "/teacher-dashboard",
      element: <TeacherDashboardPage />,
      children: [],
    },
    {
      path: "/parent-dashboard",
      element: <ParentDashboardPage />,
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
        {
          path: "users/admin-management", // Add this new route
          element: <AdminManagement />,
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
            // Move bulk-import outside the :parentId route
            {
              path: "bulk-import",
              element: <ParentBulkImport />,
            },
            {
              path: "all",
              element: <AllParents />,
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
              path: "documents/:classId",
              element: <ClassDocumentsPage />,
            },
            {
              path: "timetables",
              element: <ClassTimetablesPage />,
            },
            {
              path: "analytics/:classId",
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
        // Messages Section
        {
          path: "messages",
          element: <MessagesPage />,
          children: [
            {
              index: true,
              element: <Navigate to="inbox" replace />,
            },
            {
              path: "inbox",
              element: <MessagesInbox />,
            },
            {
              path: "sent",
              element: <MessagesSent />, // Similar to Inbox but for sent messages
            },
            {
              path: "compose",
              element: <MessagesCompose />,
            },
            {
              path: "contacts",
              element: <MessagesContacts />,
            },
          ],
        },
        // Timetables Section
        {
          path: "timetables",
          element: <TimetablesPage />,
          children: [
            {
              index: true,
              element: <Navigate to="view-all" replace />,
            },
            {
              path: "view-all",
              element: <ViewAllTimetables />,
            },
            {
              path: "create",
              element: <CreateTimetableWrapper />,
              children: [
                {
                  index: true,
                  element: <Navigate to="step-1" replace />,
                },
                {
                  path: "step-1", // Select classes and term
                  element: <TimetableSetupStep1 />,
                },
                {
                  path: "step-2", // Set timetable structure
                  element: <TimetableSetupStep2 />,
                },
                {
                  path: "step-3", // Assign subjects and teachers
                  element: <TimetableSetupStep3 />,
                },
                {
                  path: "step-4", // Set constraints
                  element: <TimetableSetupStep4 />,
                },
                {
                  path: "step-5", // Generate and review
                  element: <TimetableSetupStep5 />,
                },
                {
                  path: "subject-groups", // New route
                  element: <SubjectGroupsManagement />,
                },
              ],
            },
            {
              path: "teachers",
              element: <TeacherTimetables />,
            },
            {
              path: "subjects",
              element: <SubjectsManagement />,
            },
            {
              path: "constraints",
              element: <TimetableConstraints />,
            },
            {
              path: "feedback",
              element: <TimetableFeedback />,
            },
            {
              path: ":timetableId",
              element: <TimetableDetailView />,
            },
          ],
        },
        // Fee Management Section
        {
          path: "fee-management",
          element: <FeeManagementPage />,
          children: [
            {
              index: true,
              element: <FeeDashboard />,
            },
            {
              path: "uploads",
              element: <FeeUploads />,
            },
            {
              path: "records",
              element: <FeeRecords />,
            },
            {
              path: "payments",
              element: <FeePayments />,
            },
            {
              path: "invoices",
              element: <FeeInvoices />,
            },
            {
              path: "reminders",
              element: <FeeReminders />,
            },
            {
              path: "reports",
              element: <FeeReports />,
            },
            {
              path: "settings",
              element: <FeeSettings />,
            },
          ],
        },
        // Exams Management Section
        {
          path: "exams",
          element: <ExamsPage />,
          children: [
            {
              index: true,
              element: <ExamsDashboard />,
            },
            // KCSE Management Routes
            {
              path: "kcse",
              element: <KCSEManagement />,
              children: [
                {
                  index: true,
                  element: <Navigate to="dashboard" replace />,
                },
                {
                  path: "dashboard",
                  element: <KCSEDashboard />,
                },
                {
                  path: "download-template",
                  element: <KCSETemplateDownload />,
                },
                {
                  path: "upload-results",
                  element: <KCSEUploadResults />,
                },
                {
                  path: "results",
                  element: <KCSEResultsView />,
                },
                {
                  path: "school-performance",
                  element: <KCSESchoolPerformance />,
                },
                {
                  path: "subject-analysis",
                  element: <KCSESubjectAnalysis />,
                },
                {
                  path: "comparative-analysis",
                  element: <KCSEComparativeAnalysis />,
                },
                {
                  path: "teacher-performance",
                  element: <KCSETeacherPerformance />,
                },
              ],
            },
            {
              path: "setup",
              element: <ExamSetupWrapper />,
              children: [
                {
                  index: true,
                  element: <Navigate to="step-1" replace />,
                },
                {
                  path: "step-1", // Select exam type and basic info
                  element: <ExamSetupStep1 />,
                },
                {
                  path: "step-2", // Select subjects and grading
                  element: <ExamSetupStep2 />,
                },
                {
                  path: "step-3", // Set up exam schedule
                  element: <ExamSetupStep3 />,
                },
              ],
            },
            {
              path: "grading-systems",
              element: <GradingSystemsManagement />,
            },
            {
              path: "enter-marks",
              element: <EnterMarksWrapper />,
              children: [
                {
                  index: true,
                  element: <SelectExamForMarks />,
                },
                {
                  path: "manual/:examId/:subjectId",
                  element: <EnterMarksManual />,
                },
                {
                  path: "upload/:examId/:subjectId",
                  element: <UploadMarksSheet />,
                },
              ],
            },
            {
              path: "results",
              element: <ExamResultsWrapper />,
              children: [
                {
                  index: true,
                  element: <ExamResultsOverview />,
                },
                {
                  path: "class/:classId",
                  element: <ClassExamResults />,
                },
                {
                  path: "student/:studentId",
                  element: <StudentExamResults />,
                },
                {
                  path: "publish/:examId",
                  element: <PublishExamResults />,
                },
              ],
            },
            {
              path: "reports",
              element: <ExamReportsWrapper />,
              children: [
                {
                  index: true,
                  element: <ExamReportsOverview />,
                },
                {
                  path: "term/:termId",
                  element: <TermExamReports />,
                },
                {
                  path: "consolidated",
                  element: <ConsolidatedReports />,
                },
              ],
            },
            {
              path: "analytics",
              element: <ExamAnalytics />,
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
      path: "/account",
      element: <AccountProfilePage />,
      children: [
        {
          index: true,
          element: <Navigate to="profile" replace />,
        },
        {
          path: "profile",
          element: <AccountProfile />,
        },
        {
          path: "security",
          element: <AccountSecurity />,
        },
        {
          path: "subscription",
          element: <AccountSubscription />,
        },
        {
          path: "messages",
          element: <AccountMessages />,
        },
        {
          path: "notifications",
          element: <AccountNotifications />,
        },
        {
          path: "settings",
          element: <AccountSettings />,
        },
      ],
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
    <MantineProvider>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <div className="App">
            <RouterProvider router={router} />
          </div>
        </QueryClientProvider>
      </UserProvider>
    </MantineProvider>
  );
}

export default App;
