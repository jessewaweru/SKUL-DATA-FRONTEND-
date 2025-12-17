import { useContext, useMemo } from "react";
import { UserContext } from "../context/UserContext";

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  // Use useMemo to prevent infinite re-renders by memoizing the computed values
  const computedValues = useMemo(() => {
    // Extract school data from multiple possible sources
    let school = null;
    let schoolId = null;
    let schoolCode = null;

    // Priority order for finding school:
    // 1. Direct school property
    // 2. From school_admin_profile
    // 3. From user role (if role has school property)
    // 4. From teacher_profile
    // 5. From parent_profile

    if (context.user?.school) {
      school = context.user.school;
      schoolId = school.id;
      schoolCode = school.code;
    } else if (context.user?.school_admin_profile?.school) {
      school = context.user.school_admin_profile.school;
      schoolId = school.id;
      schoolCode = school.code;
    } else if (context.user?.role?.school) {
      // This is likely where your school info is based on the console logs
      schoolId = context.user.role.school;
      school = { id: schoolId };
      // schoolCode will remain null unless we have the full school object
    } else if (context.user?.teacher_profile?.school) {
      school = context.user.teacher_profile.school;
      schoolId = school.id;
      schoolCode = school.code;
    } else if (context.user?.parent_profile?.school) {
      school = context.user.parent_profile.school;
      schoolId = school.id;
      schoolCode = school.code;
    }

    return {
      school,
      schoolId,
      schoolCode,
      enhancedUser: {
        ...context.user,
        school, // Ensure school is included in the user object
      },
    };
  }, [
    context.user?.id, // Only depend on stable values that actually change
    context.user?.role?.school,
    context.user?.school?.id,
    context.user?.school_admin_profile?.school?.id,
    context.user?.teacher_profile?.school?.id,
    context.user?.parent_profile?.school?.id,
  ]);

  // Debug log here - but only when values actually change
  if (import.meta.env && import.meta.env.MODE === "development") {
    console.log("User context computed data:", {
      user: context.user,
      school: computedValues.school,
      adminProfile: context.user?.school_admin_profile,
      roleSchool: context.user?.role?.school,
      schoolId: computedValues.schoolId,
      schoolCode: computedValues.schoolCode,
    });
  }

  return {
    ...context,
    user: computedValues.enhancedUser,
    school: computedValues.school,
    schoolId: computedValues.schoolId,
    schoolCode: computedValues.schoolCode,
  };
};

export default useUser;
