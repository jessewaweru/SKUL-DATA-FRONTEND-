export const createDashboardApi = (api) => ({
  // Get dashboard statistics
  getStats: async () => {
    try {
      // First get the current user to get school ID
      let schoolId = null;

      try {
        const userRes = await api.get("/users/me/");
        console.log("Current user response:", userRes.data);

        // Try multiple ways to get school ID
        if (userRes.data.school?.id) {
          schoolId = userRes.data.school.id;
          console.log("✅ Got school ID from user.school:", schoolId);
        } else if (userRes.data.school_admin_profile?.school?.id) {
          schoolId = userRes.data.school_admin_profile.school.id;
          console.log("✅ Got school ID from school_admin_profile:", schoolId);
        }

        if (!schoolId) {
          console.error("❌ Could not determine school ID from user data");
          throw new Error("School ID not found. Please contact support.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Could not fetch user information");
      }

      console.log("Fetching dashboard stats for school ID:", schoolId);

      // Fetch data sequentially with individual error handling
      let students = [];
      try {
        const studentsRes = await api.get("/students/students/");
        students = studentsRes.data.results || studentsRes.data || [];
        console.log(`✅ Students fetched: ${students.length}`);
      } catch (error) {
        console.warn("Could not fetch students:", error.message);
      }

      let teachers = [];
      try {
        const teachersRes = await api.get(`/schools/${schoolId}/teachers/`);
        teachers = teachersRes.data.teachers || teachersRes.data || [];
        console.log(`✅ Teachers fetched: ${teachers.length}`);
      } catch (error) {
        console.warn("Could not fetch teachers:", error.message);
      }

      let classes = [];
      try {
        const classesRes = await api.get("/schools/classes/");
        if (Array.isArray(classesRes.data)) {
          classes = classesRes.data;
        } else if (classesRes.data.results) {
          classes = classesRes.data.results;
        } else {
          classes = [];
        }
        console.log(`✅ Classes fetched: ${classes.length}`);
      } catch (error) {
        console.warn("Could not fetch classes:", error.message);
      }

      let documents = [];
      try {
        const documentsRes = await api.get("/documents/documents/");
        if (Array.isArray(documentsRes.data)) {
          documents = documentsRes.data;
        } else if (documentsRes.data.results) {
          documents = documentsRes.data.results;
        } else {
          documents = [];
        }
        console.log(`✅ Documents fetched: ${documents.length}`);
      } catch (error) {
        console.warn("Could not fetch documents:", error.message);
      }

      let parents = [];
      try {
        const parentsRes = await api.get(`/schools/${schoolId}/parents/`);
        parents = parentsRes.data.parents || parentsRes.data || [];
        console.log(`✅ Parents fetched: ${parents.length}`);
      } catch (error) {
        console.warn("Could not fetch parents:", error.message);
      }

      let attendance = [];
      try {
        const attendanceRes = await api.get("/schools/class-attendances/", {
          timeout: 30000,
        });
        attendance = attendanceRes.data.results || attendanceRes.data || [];
        console.log(`✅ Attendance fetched: ${attendance.length} records`);
      } catch (error) {
        console.warn("Could not fetch attendance:", error.message);
      }

      let fees = [];
      try {
        const feesRes = await api.get("/fees/fee-records/");
        fees = feesRes.data.results || feesRes.data || [];
        console.log(`✅ Fees fetched: ${fees.length}`);
      } catch (error) {
        console.warn("Could not fetch fees:", error.message);
      }

      let activityLogs = [];
      try {
        const activityLogsRes = await api.get("/logs/action-logs/?limit=10");
        activityLogs = activityLogsRes.data.results || activityLogsRes.data;
        console.log(`✅ Activity logs fetched: ${activityLogs.length}`);
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
      console.log("📊 Dashboard Statistics:", {
        schoolId,
        totalStudents,
        activeTeachers,
        totalClasses,
        totalDocuments,
        totalParents,
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
        schoolId, // Return school ID for debugging
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
      throw error;
    }
  },
});

export default createDashboardApi;

// Helper functions remain the same...
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

    const monthAttendance = Array.isArray(attendance)
      ? attendance.filter((a) => {
          const aDate = new Date(a.date);
          return (
            aDate.getMonth() === date.getMonth() &&
            aDate.getFullYear() === date.getFullYear()
          );
        })
      : [];

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
