import { useApi } from "./useApi";
import { useMemo } from "react";

export const useTimetableApi = () => {
  const api = useApi();

  const logApiCall = (method, url, data) => {
    console.log("[TimetableAPI]", {
      method,
      url,
      hasData: !!data,
      timestamp: new Date().toISOString(),
    });
  };

  // Use useMemo to return a stable API object reference
  return useMemo(() => {
    return {
      // Timetable endpoints
      getTimetables: (schoolId) => {
        const url = `/api/school_timetables/timetables/?school=${schoolId}`;
        logApiCall("GET", url);
        return api.get(url);
      },
      getTimetable: (id) => {
        const url = `/api/school_timetables/timetables/${id}/`;
        logApiCall("GET", url);
        return api.get(url);
      },
      createTimetable: (data) => {
        const url = "/api/school_timetables/timetables/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      updateTimetable: (id, data) => {
        const url = `/api/school_timetables/timetables/${id}/`;
        logApiCall("PATCH", url, data);
        return api.patch(url, data);
      },
      deleteTimetable: (id) => {
        const url = `/api/school_timetables/timetables/${id}/`;
        logApiCall("DELETE", url);
        return api.delete(url);
      },
      generateTimetable: (data) => {
        const url = "/api/school_timetables/timetables/generate/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      regenerateTimetable: (id, data) => {
        const url = `/api/school_timetables/timetables/${id}/regenerate/`;
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      cloneTimetable: (data) => {
        const url = "/api/school_timetables/timetables/clone/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      activateTimetable: (id) => {
        const url = `/api/school_timetables/timetables/${id}/activate/`;
        logApiCall("POST", url);
        return api.post(url);
      },

      // Lesson endpoints
      getLessons: (timetableId = null) => {
        const url = timetableId
          ? `/api/school_timetables/lessons/?timetable=${timetableId}`
          : `/api/school_timetables/lessons/`;
        logApiCall("GET", url);
        return api.get(url);
      },
      createLesson: (data) => {
        const url = "/api/school_timetables/lessons/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      updateLesson: (id, data) => {
        const url = `/api/school_timetables/lessons/${id}/`;
        logApiCall("PATCH", url, data);
        return api.patch(url, data);
      },
      deleteLesson: (id) => {
        const url = `/api/school_timetables/lessons/${id}/`;
        logApiCall("DELETE", url);
        return api.delete(url);
      },

      // Teacher-specific lesson endpoints
      getTeacherLessons: (teacherId) => {
        const url = `/api/school_timetables/lessons/?teacher=${teacherId}`;
        logApiCall("GET", url);
        return api.get(url);
      },

      // Since there's no specific teacher timetable endpoint, we'll use lessons
      getTeacherTimetables: (teacherId) => {
        console.log(
          "[TimetableAPI] getTeacherTimetables called with teacherId:",
          teacherId
        );
        // This will get all lessons for a specific teacher
        return this.getTeacherLessons(teacherId);
      },

      // Constraint endpoints
      getConstraints: (schoolCode) => {
        const url = `/api/school_timetables/timetable-constraints/?school=${schoolCode}`;
        logApiCall("GET", url);
        return api.get(url);
      },
      createConstraint: (data) => {
        const url = "/api/school_timetables/timetable-constraints/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      updateConstraint: (id, data) => {
        const url = `/api/school_timetables/timetable-constraints/${id}/`;
        logApiCall("PATCH", url, data);
        return api.patch(url, data);
      },
      deleteConstraint: (id) => {
        const url = `/api/school_timetables/timetable-constraints/${id}/`;
        logApiCall("DELETE", url);
        return api.delete(url);
      },

      // Subject group endpoints
      getSubjectGroups: (schoolId) => {
        const url = `/api/school_timetables/subject-groups/?school=${schoolId}`;
        logApiCall("GET", url);
        return api.get(url);
      },
      createSubjectGroup: (data) => {
        const url = "/api/school_timetables/subject-groups/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      updateSubjectGroup: (id, data) => {
        const url = `/api/school_timetables/subject-groups/${id}/`;
        logApiCall("PATCH", url, data);
        return api.patch(url, data);
      },
      deleteSubjectGroup: (id) => {
        const url = `/api/school_timetables/subject-groups/${id}/`;
        logApiCall("DELETE", url);
        return api.delete(url);
      },

      // Teacher availability endpoints
      getTeacherAvailability: (teacherId) => {
        const url = `/api/school_timetables/teacher-availability/?teacher=${teacherId}`;
        logApiCall("GET", url);
        return api.get(url);
      },
      updateTeacherAvailability: (id, data) => {
        const url = `/api/school_timetables/teacher-availability/${id}/`;
        logApiCall("PATCH", url, data);
        return api.patch(url, data);
      },
      bulkUpdateTeacherAvailability: (data) => {
        const url = "/api/school_timetables/teacher-availability/bulk-update/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },

      // Time slot endpoints
      getTimeSlots: (schoolId) => {
        const url = `/api/school_timetables/time-slots/?school=${schoolId}`;
        logApiCall("GET", url);
        return api.get(url);
      },
      createTimeSlot: (data) => {
        const url = "/api/school_timetables/time-slots/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      updateTimeSlot: (id, data) => {
        const url = `/api/school_timetables/time-slots/${id}/`;
        logApiCall("PATCH", url, data);
        return api.patch(url, data);
      },
      deleteTimeSlot: (id) => {
        const url = `/api/school_timetables/time-slots/${id}/`;
        logApiCall("DELETE", url);
        return api.delete(url);
      },

      // Timetable structure endpoints
      getTimetableStructures: (schoolId) => {
        const url = `/api/school_timetables/timetable-structures/?school=${schoolId}`;
        logApiCall("GET", url);
        return api.get(url);
      },
      createTimetableStructure: (data) => {
        const url = "/api/school_timetables/timetable-structures/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },
      updateTimetableStructure: (id, data) => {
        const url = `/api/school_timetables/timetable-structures/${id}/`;
        logApiCall("PATCH", url, data);
        return api.patch(url, data);
      },
      deleteTimetableStructure: (id) => {
        const url = `/api/school_timetables/timetable-structures/${id}/`;
        logApiCall("DELETE", url);
        return api.delete(url);
      },

      // Feedback endpoint
      sendFeedback: (data) => {
        const url = "/api/feedback/";
        logApiCall("POST", url, data);
        return api.post(url, data);
      },

      // School data endpoints
      getSubjects: (schoolCode) => {
        const url = `/api/students/subjects/?school_id=${schoolCode}`;
        logApiCall("GET", url);
        return api.get(url);
      },
      getTeachers: (schoolIdentifier) => {
        const isNumeric =
          !isNaN(schoolIdentifier) && !isNaN(parseFloat(schoolIdentifier));
        const param = isNumeric ? "school" : "school_code";
        const url = `/api/users/teachers/?${param}=${schoolIdentifier}`;
        logApiCall("GET", url);
        return api.get(url);
      },
      getClasses: (schoolId) => {
        const url = `/api/schools/classes/?school_id=${schoolId}`;
        logApiCall("GET", url);
        return api.get(url);
      },
    };
  }, [api]); // api should be stable if useApi is implemented correctly
};
