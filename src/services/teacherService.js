import api from "./api";

export const fetchTeachers = async () => {
  try {
    const response = await api.get("/teachers/");
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
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
