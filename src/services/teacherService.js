import api from "./api";

// export const fetchTeachers = async () => {
//   try {
//     const response = await api.get("/api/users/teachers");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//     throw error;
//   }
// };

// teacherService.js
export const fetchTeachers = async (schoolId) => {
  try {
    const response = await api.get("/users/teachers/", {
      params: { school: schoolId },
    });
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

// export const fetchSchoolTeachersDirect = async () => {
//   try {
//     const schoolId = 1; // Still hardcoded, but should be dynamic

//     // Fetch teachers and classes in parallel
//     const [teachersResponse, classesResponse] = await Promise.all([
//       api.get(`/api/schools/${schoolId}/teachers/`),
//       api.get(`/api/schools/classes/`, { params: { school: schoolId } }),
//     ]);

//     const classesMap = {};
//     classesResponse.data.results?.forEach((c) => {
//       classesMap[c.id] = c.name;
//     });

//     // Transform data for frontend
//     return teachersResponse.data.teachers.map((teacher) => ({
//       id: teacher.id,
//       full_name: `${teacher.first_name} ${teacher.last_name}`,
//       email: teacher.email,
//       phone_number: teacher.phone_number || "-",
//       status: teacher.status,
//       subjects_taught: teacher.subjects_taught?.map((s) => s.name) || [],
//       assigned_classes:
//         teacher.assigned_classes_ids?.map((id) => ({
//           id,
//           name: classesMap[id] || `Class ${id}`,
//         })) || [],
//       hire_date: teacher.hire_date,
//       last_login: teacher.last_login,
//     }));
//   } catch (error) {
//     console.error("DIRECT Teacher Fetch Error:", error);
//     throw error;
//   }
// };

export const fetchSchoolTeachersDirect = async (schoolId) => {
  try {
    // Fetch teachers and classes in parallel
    const [teachersResponse, classesResponse] = await Promise.all([
      api.get(`/api/schools/${schoolId}/teachers/`),
      api.get(`/api/schools/classes/`, { params: { school: schoolId } }),
    ]);

    const classesMap = {};
    classesResponse.data.results?.forEach((c) => {
      classesMap[c.id] = c.name;
    });

    // Transform data for frontend
    return teachersResponse.data.teachers.map((teacher) => ({
      id: teacher.id,
      full_name: `${teacher.first_name} ${teacher.last_name}`,
      email: teacher.email,
      phone_number: teacher.phone_number || "-",
      status: teacher.status,
      subjects_taught: teacher.subjects_taught?.map((s) => s.name) || [],
      assigned_classes:
        teacher.assigned_classes_ids?.map((id) => ({
          id,
          name: classesMap[id] || `Class ${id}`,
        })) || [],
      hire_date: teacher.hire_date,
      last_login: teacher.last_login,
    }));
  } catch (error) {
    console.error("Teacher fetch error:", error);
    throw error;
  }
};

// export const fetchTeachers = async () => {
//   try {
//     // Add school_id parameter to filter by school
//     const school_id = localStorage.getItem("current_school_id"); // Get from where you stored it
//     const response = await api.get(`/api/users/teachers`, {
//       params: { school: school_id },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//     throw error;
//   }
// };

export const fetchUsers = async () => {
  try {
    const response = await api.get("/users/me/");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchTeacherById = async (id) => {
  try {
    const response = await api.get(`/teachers/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teacher with ID ${id}:`, error);
    throw error;
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post("/teachers/", teacherData);
    return response.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await api.patch(`/teachers/${id}/`, teacherData);
    return response.data;
  } catch (error) {
    console.error(`Error updating teacher with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    await api.delete(`/teachers/${id}/`);
  } catch (error) {
    console.error(`Error deleting teacher with ID ${id}:`, error);
    throw error;
  }
};

export const changeTeacherStatus = async (id, statusData) => {
  try {
    const response = await api.post(
      `/teachers/${id}/change_status/`,
      statusData
    );
    return response.data;
  } catch (error) {
    console.error(`Error changing status for teacher with ID ${id}:`, error);
    throw error;
  }
};

export const assignTeacherClasses = async (id, assignmentData) => {
  try {
    const response = await api.post(
      `/teachers/${id}/assign_classes/`,
      assignmentData
    );
    return response.data;
  } catch (error) {
    console.error(`Error assigning classes to teacher with ID ${id}:`, error);
    throw error;
  }
};

export const assignTeacherSubjects = async (id, assignmentData) => {
  try {
    const response = await api.post(
      `/teachers/${id}/assign_subjects/`,
      assignmentData
    );
    return response.data;
  } catch (error) {
    console.error(`Error assigning subjects to teacher with ID ${id}:`, error);
    throw error;
  }
};

export const fetchTeacherReports = async (teacherId) => {
  try {
    const response = await api.get(`/teachers/${teacherId}/reports/`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching reports for teacher with ID ${teacherId}:`,
      error
    );
    throw error;
  }
};

export const fetchTeacherDocuments = async (teacherId) => {
  try {
    const response = await api.get(`/teachers/${teacherId}/documents/`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching documents for teacher with ID ${teacherId}:`,
      error
    );
    throw error;
  }
};

export const fetchTeacherActivity = async (teacherId) => {
  try {
    const response = await api.get(`/teachers/${teacherId}/activity/`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching activity for teacher with ID ${teacherId}:`,
      error
    );
    throw error;
  }
};
