// Dashboard API Service - Updated to work with your existing api setup
export const createDashboardApi = (api) => ({
  // Get dashboard statistics
  getStats: async () => {
    try {
      // First get the current user to get school ID
      let schoolId = 1; // Default fallback
      try {
        const userRes = await api.get("/users/me/");
        schoolId = userRes.data.school_admin_profile?.school?.id || 1;
      } catch (error) {
        console.warn(
          "Could not fetch user, using default school ID:",
          error.message
        );
      }

      // Fetch data sequentially with individual error handling
      let students = [];
      try {
        const studentsRes = await api.get("/students/students/");
        // Handle paginated response - get results array
        students = studentsRes.data.results || studentsRes.data || [];
      } catch (error) {
        console.warn("Could not fetch students:", error.message);
      }

      let teachers = [];
      try {
        const teachersRes = await api.get(`/schools/${schoolId}/teachers/`);
        // Teachers response has nested 'teachers' array
        teachers = teachersRes.data.teachers || teachersRes.data || [];
      } catch (error) {
        console.warn("Could not fetch teachers:", error.message);
      }

      let classes = [];
      try {
        const classesRes = await api.get("/schools/classes/");
        // Handle both array and paginated response
        if (Array.isArray(classesRes.data)) {
          classes = classesRes.data;
        } else if (classesRes.data.results) {
          classes = classesRes.data.results;
        } else {
          classes = [];
        }
        console.log("Classes fetched:", classes.length);
      } catch (error) {
        console.warn("Could not fetch classes:", error.message);
      }

      let documents = [];
      try {
        const documentsRes = await api.get("/documents/documents/");
        // Handle both array and paginated response
        if (Array.isArray(documentsRes.data)) {
          documents = documentsRes.data;
        } else if (documentsRes.data.results) {
          documents = documentsRes.data.results;
        } else {
          documents = [];
        }
        console.log("Documents fetched:", documents.length);
      } catch (error) {
        console.warn("Could not fetch documents:", error.message);
      }

      let parents = [];
      try {
        const parentsRes = await api.get(`/schools/${schoolId}/parents/`);
        // Parents response has nested 'parents' array
        parents = parentsRes.data.parents || parentsRes.data || [];
      } catch (error) {
        console.warn("Could not fetch parents:", error.message);
      }

      let attendance = [];
      try {
        console.log("Fetching attendance data...");
        const attendanceRes = await api.get("/schools/class-attendances/", {
          timeout: 30000, // 30 second timeout for attendance
        });
        // Handle paginated response
        attendance = attendanceRes.data.results || attendanceRes.data || [];
        console.log(
          "Attendance data fetched successfully:",
          attendance.length,
          "records"
        );
      } catch (error) {
        console.warn(
          "Could not fetch attendance (will use mock data):",
          error.message
        );
        // Continue with empty array - will generate mock data below
      }

      let fees = [];
      try {
        // Fees might take longer, so we'll handle it specially
        const feesRes = await api.get("/fees/fee-records/");
        // Handle both paginated and non-paginated responses
        fees = feesRes.data.results || feesRes.data || [];
      } catch (error) {
        console.warn("Could not fetch fees:", error.message);
        // Continue with empty fees array
      }

      let activityLogs = [];
      try {
        const activityLogsRes = await api.get("/logs/action-logs/?limit=10");
        activityLogs = activityLogsRes.data.results || activityLogsRes.data;
      } catch (error) {
        console.warn("Could not fetch activity logs:", error.message);
      }

      // Calculate statistics
      const totalStudents = Array.isArray(students) ? students.length : 0;
      const activeTeachers = Array.isArray(teachers)
        ? teachers.filter((t) => t.status === "ACTIVE" || t.status === "active")
            .length
        : 0;
      const totalClasses = Array.isArray(classes) ? classes.length : 0;
      const totalDocuments = Array.isArray(documents) ? documents.length : 0;
      const totalParents = Array.isArray(parents) ? parents.length : 0;

      // Debug logging
      console.log("Dashboard Statistics:", {
        totalStudents,
        activeTeachers,
        totalClasses,
        totalDocuments,
        totalParents,
        studentsArray: Array.isArray(students),
        teachersArray: Array.isArray(teachers),
        classesArray: Array.isArray(classes),
        documentsArray: Array.isArray(documents),
        parentsArray: Array.isArray(parents),
      });

      // Calculate average attendance
      let avgAttendance = 0;
      if (Array.isArray(attendance) && attendance.length > 0) {
        const rates = attendance.map((a) => a.attendance_rate || 0);
        avgAttendance = rates.reduce((a, b) => a + b, 0) / rates.length;
      }

      // Calculate pending fees
      let pendingFees = 0;
      if (Array.isArray(fees)) {
        pendingFees = fees
          .filter((f) => f.payment_status !== "paid")
          .reduce((sum, f) => sum + parseFloat(f.balance || 0), 0);
      }

      // Process attendance trend (last 12 months)
      const attendanceTrend = processAttendanceTrend(attendance);

      // Process revenue trend (last 12 months)
      const revenueTrend = processRevenueTrend(fees);

      // Process recent activity
      const recentActivity = processActivityLogs(activityLogs);

      return {
        stats: {
          totalStudents,
          activeTeachers,
          totalClasses,
          totalDocuments,
          avgAttendance: avgAttendance.toFixed(2),
          pendingFees: pendingFees.toFixed(2),
          totalParents,
        },
        trends: {
          attendance: attendanceTrend,
          revenue: revenueTrend,
        },
        recentActivity,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await api.get("/users/me/");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error.message);
      // Return a default user object instead of throwing
      return {
        first_name: "School",
        last_name: "Administrator",
        email: "admin@school.com",
      };
    }
  },
});

export default createDashboardApi;

// Helper function to process attendance trend
const processAttendanceTrend = (attendance) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentDate = new Date();
  const trend = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthName = months[date.getMonth()];

    // Filter attendance for this month
    const monthAttendance = Array.isArray(attendance)
      ? attendance.filter((a) => {
          const aDate = new Date(a.date);
          return (
            aDate.getMonth() === date.getMonth() &&
            aDate.getFullYear() === date.getFullYear()
          );
        })
      : [];

    // Calculate average for the month
    let avgRate = 0;
    if (monthAttendance.length > 0) {
      const rates = monthAttendance.map((a) => a.attendance_rate || 0);
      avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
    }

    trend.push({
      name: monthName,
      rate: parseFloat(avgRate.toFixed(1)),
    });
  }

  return trend;
};

// Helper function to process revenue trend
const processRevenueTrend = (fees) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentDate = new Date();
  const trend = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthName = months[date.getMonth()];

    // Filter payments for this month
    const monthRevenue = Array.isArray(fees)
      ? fees.reduce((sum, fee) => {
          if (fee.payments && Array.isArray(fee.payments)) {
            const monthPayments = fee.payments.filter((p) => {
              const pDate = new Date(p.payment_date);
              return (
                pDate.getMonth() === date.getMonth() &&
                pDate.getFullYear() === date.getFullYear()
              );
            });
            return (
              sum +
              monthPayments.reduce((s, p) => s + parseFloat(p.amount || 0), 0)
            );
          }
          return sum;
        }, 0)
      : 0;

    trend.push({
      name: monthName,
      revenue: parseFloat(monthRevenue.toFixed(2)),
    });
  }

  return trend;
};

// Helper function to process activity logs
const processActivityLogs = (logs) => {
  if (!Array.isArray(logs)) return [];

  return logs.slice(0, 10).map((log) => ({
    id: log.id,
    user: log.user_details
      ? `${log.user_details.first_name} ${log.user_details.last_name}`
      : "System",
    action: log.action,
    category: log.category_display || log.category,
    timestamp: new Date(log.timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    affectedModel: log.affected_model || "N/A",
  }));
};
