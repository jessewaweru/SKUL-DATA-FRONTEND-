// import { useContext } from "react";
// import { UserContext } from "../context/UserContext";

// const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };

// export default useUser;

import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  // Extract school data from either the user object or profile
  const school =
    context.user?.school || context.user?.school_admin_profile?.school || null;

  // Debug log here
  console.log("User context full data:", {
    user: context.user,
    school,
    adminProfile: context.user?.school_admin_profile,
    schoolId: school?.id,
    schoolCode: school?.code,
  });

  return {
    ...context,
    user: {
      ...context.user,
      school, // Ensure school is included in the user object
    },
  };
};

export default useUser;
