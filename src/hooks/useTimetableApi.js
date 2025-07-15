import { useApi } from "./useApi";

export const useTimetableApi = () => {
  const api = useApi();

  const logApiCall = (method, url, data) => {
    console.log("[TimetableAPI]", {
      method,
      url,
      hasData: !!data,
      timestamp: new Date().toISOString(),
    }); // Debug 17
  };

  return {
    // Timetable endpoints
    getTimetables: (schoolId) =>
      api.get(`/api/school_timetables/timetables/?school=${schoolId}`),
    getTimetable: (id) => api.get(`/api/school_timetables/timetables/${id}/`),
    createTimetable: (data) =>
      api.post("/api/school_timetables/timetables/", data),
    updateTimetable: (id, data) =>
      api.patch(`/api/school_timetables/timetables/${id}/`, data),
    deleteTimetable: (id) =>
      api.delete(`/api/school_timetables/timetables/${id}/`),
    generateTimetable: (data) =>
      api.post("/api/school_timetables/timetables/generate/", data),
    regenerateTimetable: (id, data) =>
      api.post(`/api/school_timetables/timetables/${id}/regenerate/`, data),
    cloneTimetable: (data) =>
      api.post("/api/school_timetables/timetables/clone/", data),
    activateTimetable: (id) =>
      api.post(`/api/school_timetables/timetables/${id}/activate/`),

    // Lesson endpoints
    getLessons: (timetableId) =>
      api.get(`/api/school_timetables/lessons/?timetable=${timetableId}`),
    createLesson: (data) => api.post("/api/school_timetables/lessons/", data),
    updateLesson: (id, data) =>
      api.patch(`/api/school_timetables/lessons/${id}/`, data),
    deleteLesson: (id) => api.delete(`/api/school_timetables/lessons/${id}/`),

    // Teacher timetable endpoints
    getTeacherTimetables: (teacherId) =>
      api.get(`/api/school_timetables/timetables/teachers/${teacherId}/`),

    // Constraint endpoints
    // getConstraints: (schoolId) =>
    //   api.get(
    //     `/api/school_timetables/timetable-constraints/?school=${schoolId}`
    //   ),
    getConstraints: (schoolCode) =>
      api.get(
        `/api/school_timetables/timetable-constraints/?school=${schoolCode}`
      ),
    createConstraint: (data) =>
      api.post("/api/school_timetables/timetable-constraints/", data),
    updateConstraint: (id, data) =>
      api.patch(`/api/school_timetables/timetable-constraints/${id}/`, data),
    deleteConstraint: (id) =>
      api.delete(`/api/school_timetables/timetable-constraints/${id}/`),

    // Subject group endpoints
    getSubjectGroups: (schoolId) =>
      api.get(`/api/school_timetables/subject-groups/?school=${schoolId}`),
    createSubjectGroup: (data) =>
      api.post("/api/school_timetables/subject-groups/", data),
    updateSubjectGroup: (id, data) =>
      api.patch(`/api/school_timetables/subject-groups/${id}/`, data),
    deleteSubjectGroup: (id) =>
      api.delete(`/api/school_timetables/subject-groups/${id}/`),

    // Teacher availability endpoints
    getTeacherAvailability: (teacherId) =>
      api.get(
        `/api/school_timetables/teacher-availability/?teacher=${teacherId}`
      ),
    updateTeacherAvailability: (id, data) =>
      api.patch(`/api/school_timetables/teacher-availability/${id}/`, data),
    bulkUpdateTeacherAvailability: (data) =>
      api.post(
        "/api/school_timetables/teacher-availability/bulk-update/",
        data
      ),

    // Time slot endpoints
    getTimeSlots: (schoolId) =>
      api.get(`/api/school_timetables/time-slots/?school=${schoolId}`),
    createTimeSlot: (data) =>
      api.post("/api/school_timetables/time-slots/", data),
    updateTimeSlot: (id, data) =>
      api.patch(`/api/school_timetables/time-slots/${id}/`, data),
    deleteTimeSlot: (id) =>
      api.delete(`/api/school_timetables/time-slots/${id}/`),

    // Timetable structure endpoints
    getTimetableStructures: (schoolId) =>
      api.get(
        `/api/school_timetables/timetable-structures/?school=${schoolId}`
      ),
    createTimetableStructure: (data) =>
      api.post("/api/school_timetables/timetable-structures/", data),
    updateTimetableStructure: (id, data) =>
      api.patch(`/api/school_timetables/timetable-structures/${id}/`, data),
    deleteTimetableStructure: (id) =>
      api.delete(`/api/school_timetables/timetable-structures/${id}/`),

    // Feedback endpoint
    sendFeedback: (data) => api.post("/api/feedback/", data),

    // School data endpoints - FIXED URLS with proper /api/ prefix
    getSubjects: (schoolCode) => {
      // Rename parameter to be explicit
      const url = `/api/students/subjects/?school_id=${schoolCode}`; // Keep school_id param name
      logApiCall("GET", url);
      return api.get(url);
    },
    // getTeachers: (schoolId) =>
    //   api.get(`/api/users/teachers/?school=${schoolId}`),
    getTeachers: (schoolIdentifier) => {
      // Determine if identifier is numeric (ID) or string (code)
      const isNumeric =
        !isNaN(schoolIdentifier) && !isNaN(parseFloat(schoolIdentifier));
      const param = isNumeric ? "school" : "school_code";
      const url = `/api/users/teachers/?${param}=${schoolIdentifier}`;
      logApiCall("GET", url);
      return api.get(url);
    },
    getClasses: (schoolId) => {
      const url = `/api/schools/classes/?school_id=${schoolId}`; // Change to school_id
      logApiCall("GET", url);
      return api.get(url);
    },
  };
};
