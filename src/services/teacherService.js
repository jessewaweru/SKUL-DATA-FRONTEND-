import api from "./api";

// Primary method - fetch teachers using the Django viewset
export const fetchTeachers = async (schoolId) => {
  try {
    console.log("Fetching teachers for school:", schoolId);

    const response = await api.get("/api/users/teachers/", {
      params: { school: schoolId },
    });

    console.log("API Response:", response);

    // Handle both paginated and non-paginated responses
    const teachersData = response.data.results || response.data;

    console.log("Teachers data:", teachersData);

    // Transform data to match frontend expectations
    return teachersData.map((teacher) => ({
      id: teacher.id,
      full_name: `${teacher.first_name} ${teacher.last_name}`,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      phone_number: teacher.phone_number || "-",
      status: teacher.status,
      subjects_taught: teacher.subjects_taught?.map((s) => s.name) || [],
      assigned_classes: teacher.assigned_classes_ids || [],
      hire_date: teacher.hire_date,
      last_login: teacher.last_login,
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      years_of_experience: teacher.years_of_experience,
      is_class_teacher: teacher.is_class_teacher,
      is_department_head: teacher.is_department_head,
      is_administrator: teacher.is_administrator,
      office_location: teacher.office_location,
      office_hours: teacher.office_hours,
    }));
  } catch (error) {
    console.error("Error fetching teachers:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Alternative method using school-specific endpoint
export const fetchSchoolTeachersDirect = async (schoolId) => {
  try {
    console.log("Fetching teachers directly for school:", schoolId);

    // Try multiple possible endpoints
    let teachersResponse;

    try {
      // First try the school-specific endpoint
      teachersResponse = await api.get(`/api/schools/${schoolId}/teachers/`);
    } catch (schoolEndpointError) {
      console.warn(
        "School endpoint failed, trying users endpoint:",
        schoolEndpointError
      );

      // Fallback to users endpoint with school filter
      teachersResponse = await api.get(`/api/users/teachers/`, {
        params: { school: schoolId },
      });
    }

    console.log("Teachers response:", teachersResponse);

    // Handle different response structures
    let teachersData;
    if (teachersResponse.data.teachers) {
      teachersData = teachersResponse.data.teachers;
    } else if (teachersResponse.data.results) {
      teachersData = teachersResponse.data.results;
    } else if (Array.isArray(teachersResponse.data)) {
      teachersData = teachersResponse.data;
    } else {
      throw new Error("Unexpected response format");
    }

    // Fetch classes for mapping (optional)
    let classesMap = {};
    try {
      const classesResponse = await api.get(`/api/schools/classes/`, {
        params: { school: schoolId },
      });

      const classes = classesResponse.data.results || classesResponse.data;
      classes.forEach((c) => {
        classesMap[c.id] = c.name;
      });
    } catch (classError) {
      console.warn("Could not fetch classes for mapping:", classError);
    }

    // Transform data for frontend
    return teachersData.map((teacher) => ({
      id: teacher.id,
      full_name: `${teacher.first_name} ${teacher.last_name}`,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
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
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      years_of_experience: teacher.years_of_experience,
      is_class_teacher: teacher.is_class_teacher,
      is_department_head: teacher.is_department_head,
      is_administrator: teacher.is_administrator,
      office_location: teacher.office_location,
      office_hours: teacher.office_hours,
    }));
  } catch (error) {
    console.error("Teacher fetch error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Get current user info
export const fetchUsers = async () => {
  try {
    const response = await api.get("/api/users/me/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

// Enhanced error handling for fetchTeacherById
export const fetchTeacherById = async (id) => {
  try {
    console.log("Fetching teacher by ID:", id);

    if (!id) {
      throw new Error("Teacher ID is required");
    }

    const response = await api.get(`/api/users/teachers/${id}/`);
    console.log("Teacher data retrieved:", response.data);

    return response.data;
  } catch (error) {
    console.error(`Error fetching teacher with ID ${id}:`, error);
    console.error("Error response:", error.response?.data);

    // Provide more specific error messages
    if (error.response?.status === 404) {
      throw new Error(`Teacher with ID ${id} not found`);
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to view this teacher");
    } else {
      throw new Error(`Failed to fetch teacher: ${error.message}`);
    }
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post("/api/users/teachers/", teacherData);
    return response.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await api.patch(`/api/users/teachers/${id}/`, teacherData);
    return response.data;
  } catch (error) {
    console.error(`Error updating teacher with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    await api.delete(`/api/users/teachers/${id}/`);
  } catch (error) {
    console.error(`Error deleting teacher with ID ${id}:`, error);
    throw error;
  }
};

export const changeTeacherStatus = async (id, statusData) => {
  try {
    const response = await api.post(
      `/api/users/teachers/${id}/change_status/`,
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
      `/api/users/teachers/${id}/assign_classes/`,
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
      `/api/users/teachers/${id}/assign_subjects/`,
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
    const response = await api.get(`/api/users/teachers/${teacherId}/reports/`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching reports for teacher with ID ${teacherId}:`,
      error
    );
    throw error;
  }
};

export const fetchTeacherDocuments = async (teacherId, filters = {}) => {
  try {
    console.log("=== fetchTeacherDocuments Debug ===");
    console.log("Teacher ID:", teacherId, "Type:", typeof teacherId);
    console.log("Filters:", filters);

    if (!teacherId) {
      throw new Error("Teacher ID is required");
    }

    // Ensure teacherId is numeric
    const numericTeacherId = parseInt(teacherId);
    if (isNaN(numericTeacherId)) {
      throw new Error("Teacher ID must be a valid number");
    }

    // Build query parameters
    const params = {
      teacher: numericTeacherId,
      ...filters,
    };

    console.log("API Request params:", params);

    // Make the API call
    const response = await api.get("/api/users/teacher-documents/", { params });

    console.log("API Response status:", response.status);
    console.log("API Response headers:", response.headers);
    console.log("Raw API Response data:", response.data);

    // Handle both paginated and non-paginated responses
    let documentsData;
    if (response.data.results) {
      // Paginated response
      documentsData = response.data.results;
      console.log("Paginated response - results:", documentsData.length);
    } else if (Array.isArray(response.data)) {
      // Direct array response
      documentsData = response.data;
      console.log("Array response - items:", documentsData.length);
    } else {
      // Single object or other format
      documentsData = response.data ? [response.data] : [];
      console.log(
        "Single/other response converted to array:",
        documentsData.length
      );
    }

    // Ensure we always return an array
    const documents = Array.isArray(documentsData) ? documentsData : [];
    console.log("Final documents array length:", documents.length);

    // Log each document for debugging
    documents.forEach((doc, index) => {
      console.log(`Document ${index + 1}:`, {
        id: doc.id,
        title: doc.title,
        teacher: doc.teacher,
        document_type: doc.document_type,
      });
    });

    // Transform documents to ensure consistent structure
    const transformedDocs = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      document_type: doc.document_type,
      description: doc.description || "",
      file: doc.file,
      uploaded_at: doc.uploaded_at,
      uploaded_by: doc.uploaded_by || null,
      is_confidential: doc.is_confidential || false,
      teacher: doc.teacher || numericTeacherId,
    }));

    console.log("Transformed documents:", transformedDocs);
    return transformedDocs;
  } catch (error) {
    console.error("=== fetchTeacherDocuments Error ===");
    console.error("Error object:", error);
    console.error("Error message:", error.message);
    console.error("Response status:", error.response?.status);
    console.error("Response data:", error.response?.data);
    console.error("Response headers:", error.response?.headers);

    // If it's a 404 or empty result, return empty array instead of throwing
    if (
      error.response?.status === 404 ||
      (error.response?.status === 200 && !error.response.data)
    ) {
      console.log("No documents found, returning empty array");
      return [];
    }

    // For other errors, still return empty array to prevent component crashes
    console.log("Error occurred, returning empty array to prevent crashes");
    return [];
  }
};

// Improved uploadTeacherDocument function
export const uploadTeacherDocument = async (teacherId, documentData) => {
  try {
    console.log("Uploading document for teacher:", teacherId, documentData);

    if (!teacherId) {
      throw new Error("Teacher ID is required");
    }

    // Get current user ID
    let currentUserId;
    try {
      const currentUser = await fetchUsers();
      currentUserId = currentUser.id;
    } catch (userError) {
      console.warn(
        "Could not get current user, trying to get from localStorage"
      );
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      currentUserId = storedUser.id;

      if (!currentUserId) {
        throw new Error("Could not determine current user ID");
      }
    }

    const formData = new FormData();

    // Add required fields
    formData.append("teacher_id", teacherId);
    formData.append("uploaded_by_id", currentUserId);

    // Add document fields
    if (documentData.title) formData.append("title", documentData.title);
    if (documentData.document_type)
      formData.append("document_type", documentData.document_type);
    if (documentData.description)
      formData.append("description", documentData.description);
    if (documentData.is_confidential !== undefined) {
      formData.append(
        "is_confidential",
        documentData.is_confidential.toString()
      );
    }
    if (documentData.file) formData.append("file", documentData.file);

    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await api.post("/api/users/teacher-documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", response);
    return response.data;
  } catch (error) {
    console.error("Error uploading teacher document:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Improved deleteTeacherDocument function
export const deleteTeacherDocument = async (documentId) => {
  try {
    console.log("Deleting teacher document:", documentId);

    if (!documentId) {
      throw new Error("Document ID is required");
    }

    await api.delete(`/api/users/teacher-documents/${documentId}/`);
    console.log("Document deleted successfully");
  } catch (error) {
    console.error(
      `Error deleting teacher document with ID ${documentId}:`,
      error
    );
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Helper function to get current user ID with better error handling
const getCurrentUserId = async () => {
  try {
    // First try to get from API
    const user = await fetchUsers();
    return user.id;
  } catch (apiError) {
    console.warn("Could not get user from API, trying localStorage:", apiError);

    // Fallback to localStorage
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser.id) {
        return storedUser.id;
      }
    } catch (storageError) {
      console.error("Could not parse user from localStorage:", storageError);
    }

    throw new Error("Could not determine current user ID");
  }
};

// Update teacher document
export const updateTeacherDocument = async (documentId, documentData) => {
  try {
    const response = await api.patch(
      `/api/users/teacher-documents/${documentId}/`,
      documentData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating teacher document with ID ${documentId}:`,
      error
    );
    throw error;
  }
};

// Get teacher document by ID
export const fetchTeacherDocumentById = async (documentId) => {
  try {
    const response = await api.get(
      `/api/users/teacher-documents/${documentId}/`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching teacher document with ID ${documentId}:`,
      error
    );
    throw error;
  }
};

// Enhanced fetchTeacherDocuments with better error handling
export const fetchTeacherDocumentsEnhanced = async (
  teacherId,
  filters = {}
) => {
  try {
    console.log(
      "Fetching documents for teacher:",
      teacherId,
      "with filters:",
      filters
    );

    const params = { teacher: teacherId, ...filters };

    const response = await api.get("/api/users/teacher-documents/", { params });

    console.log("Documents API Response:", response);

    // Handle both paginated and non-paginated responses
    const documentsData = response.data.results || response.data;

    console.log("Processed documents data:", documentsData);

    // Ensure we always return an array
    return Array.isArray(documentsData) ? documentsData : [];
  } catch (error) {
    console.error("Error fetching teacher documents:", error);
    console.error("Error response:", error.response?.data);

    // Return empty array on error to prevent crashes
    return [];
  }
};

// Bulk upload documents
export const bulkUploadTeacherDocuments = async (teacherId, files) => {
  try {
    const uploads = files.map((fileData) =>
      uploadTeacherDocument(teacherId, fileData)
    );
    const results = await Promise.allSettled(uploads);

    return {
      successful: results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value),
      failed: results
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason),
    };
  } catch (error) {
    console.error("Error in bulk upload:", error);
    throw error;
  }
};

// export const fetchTeacherDocuments = async (teacherId) => {
//   try {
//     const response = await api.get(`/api/users/teacher-documents/`, {
//       params: { teacher: teacherId },
//     });

//     // Handle both paginated and non-paginated responses
//     const documentsData = response.data.results || response.data;

//     // Transform data to match frontend expectations
//     return Array.isArray(documentsData)
//       ? documentsData.map((doc) => ({
//           id: doc.id,
//           title: doc.title,
//           document_type: doc.document_type,
//           file: doc.file,
//           description: doc.description,
//           uploaded_by: doc.uploaded_by,
//           uploaded_at: doc.uploaded_at,
//           is_confidential: doc.is_confidential,
//           file_size: doc.file_size || "N/A",
//         }))
//       : [];
//   } catch (error) {
//     console.error(
//       `Error fetching documents for teacher with ID ${teacherId}:`,
//       error
//     );
//     throw error;
//   }
// };

// New function to fetch teacher documents using schools API
export const fetchTeacherDocumentsFromSchool = async (schoolId, teacherId) => {
  try {
    console.log("Fetching teacher documents from school API:", {
      schoolId,
      teacherId,
    });

    if (!schoolId || !teacherId) {
      throw new Error("Both school ID and teacher ID are required");
    }

    // Use the schools API endpoint similar to how you fetch teachers
    const response = await api.get(
      `/api/schools/${schoolId}/teacher-documents/`,
      {
        params: { teacher: teacherId },
      }
    );

    console.log("Teacher documents API Response:", response);

    // Handle both paginated and non-paginated responses
    const documentsData =
      response.data.results || response.data.documents || response.data;

    console.log("Processed documents data:", documentsData);

    // Ensure we always return an array
    const documents = Array.isArray(documentsData) ? documentsData : [];

    // Transform documents to ensure consistent structure
    return documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      document_type: doc.document_type,
      description: doc.description || "",
      file: doc.file,
      uploaded_at: doc.uploaded_at,
      uploaded_by: doc.uploaded_by || null,
      is_confidential: doc.is_confidential || false,
      teacher: doc.teacher || teacherId,
    }));
  } catch (error) {
    console.error("Error fetching teacher documents from school API:", error);
    console.error("Error response:", error.response?.data);

    // Return empty array on error to prevent crashes
    return [];
  }
};

// New function to fetch teacher by ID using schools API
export const fetchTeacherByIdFromSchool = async (schoolId, teacherId) => {
  try {
    console.log("Fetching teacher by ID from school API:", {
      schoolId,
      teacherId,
    });

    if (!schoolId || !teacherId) {
      throw new Error("Both school ID and teacher ID are required");
    }

    // First get all teachers from school, then find the specific one
    const response = await api.get(`/api/schools/${schoolId}/teachers/`);

    const teachersData =
      response.data.teachers || response.data.results || response.data;
    const teacher = teachersData.find((t) => t.id === parseInt(teacherId));

    if (!teacher) {
      throw new Error(
        `Teacher with ID ${teacherId} not found in school ${schoolId}`
      );
    }

    console.log("Teacher data retrieved from school API:", teacher);
    return teacher;
  } catch (error) {
    console.error(
      `Error fetching teacher with ID ${teacherId} from school API:`,
      error
    );
    console.error("Error response:", error.response?.data);

    if (error.response?.status === 404) {
      throw new Error(`Teacher with ID ${teacherId} not found`);
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to view this teacher");
    } else {
      throw new Error(`Failed to fetch teacher: ${error.message}`);
    }
  }
};

// Alternative method that works with your current school teachers endpoint
export const fetchTeacherDocumentsAlternative = async (schoolId, teacherId) => {
  try {
    console.log("Fetching teacher documents (alternative method):", {
      schoolId,
      teacherId,
    });

    // Since you don't have a specific documents endpoint in schools app yet,
    // let's try the users endpoint but with better error handling
    const response = await api.get("/api/users/teacher-documents/", {
      params: { teacher: teacherId },
    });

    console.log("Documents API Response:", response);

    const documentsData = response.data.results || response.data;
    const documents = Array.isArray(documentsData) ? documentsData : [];

    return documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      document_type: doc.document_type,
      description: doc.description || "",
      file: doc.file,
      uploaded_at: doc.uploaded_at,
      uploaded_by: doc.uploaded_by || null,
      is_confidential: doc.is_confidential || false,
      teacher: doc.teacher || teacherId,
    }));
  } catch (error) {
    console.error("Error in alternative document fetch:", error);
    return [];
  }
};

export const fetchTeacherActivity = async (teacherId) => {
  try {
    const response = await api.get(
      `/api/users/teachers/${teacherId}/activity/`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching activity for teacher with ID ${teacherId}:`,
      error
    );
    throw error;
  }
};

// Debug function to test API endpoints
export const debugTeacherDocuments = async (teacherId) => {
  console.log("=== Debug Teacher Documents ===");

  const endpoints = [
    "/api/users/teacher-documents/",
    `/api/users/teachers/${teacherId}/documents/`,
    `/api/users/teachers/${teacherId}/`,
    "/api/users/teachers/",
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      let params = {};
      if (endpoint === "/api/users/teacher-documents/") {
        params = { teacher: teacherId };
      }

      console.log(`Testing: ${endpoint}`, params);
      const response = await api.get(
        endpoint,
        params.teacher ? { params } : {}
      );
      results[endpoint] = {
        status: response.status,
        dataType: Array.isArray(response.data) ? "array" : typeof response.data,
        dataLength: Array.isArray(response.data)
          ? response.data.length
          : response.data?.results?.length || "N/A",
        sample: response.data,
      };
    } catch (error) {
      results[endpoint] = {
        status: error.response?.status || "failed",
        error: error.message,
      };
    }
  }

  console.log("API Debug Results:", results);
  return results;
};
