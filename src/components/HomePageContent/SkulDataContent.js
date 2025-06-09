import adminDashboard from "../../assets/admin-dashboard.jpg";
import teacherPortal from "../../assets/teacher-portal.jpg";
import parentImg from "../../assets/parent.jpg";
import schoolBooks from "../../assets/school-books.jpg";
import featuresImg from "../../assets/features1.png";
import africaSchool from "../../assets/africa-school.jpg";

export const skulDataContent = {
  // Hero Section Content
  heroSections: [
    {
      title: "Digital Transformation for African Schools",
      description:
        "Modern data management solution designed specifically for African educational institutions from kindergarten to higher grades.",
    },
    {
      title: "Centralized School Operations Platform",
      description:
        "Manage academic records, staff data, and school documents all in one secure, cloud-based system.",
    },
    {
      title: "Paperless Education Ecosystem",
      description:
        "Digitize school records, automate reports, and bridge communication between schools, teachers and parents.",
    },
  ],

  // Feature Sections
  features: [
    {
      title: "Comprehensive School Administration",
      description:
        "Superusers get complete control over all school data - academic records, staff management, financial documents, and institutional reporting. Our dashboard provides tools to manage the entire school ecosystem from one centralized platform.",
      // image: "src/assets/admin-dashboard.jpg",
      image: adminDashboard,
      isReversed: false,
      icon: "🏫",
    },
    {
      title: "Smart Teacher Portals",
      description:
        "Teachers can easily input academic records through spreadsheet-like interfaces or upload scanned documents. Automatic PDF report generation for each student saves hours of manual work. Role-based access ensures teachers only see data relevant to their classes.",
      // image: "src/assets/teacher-portal.jpg",
      image: teacherPortal,
      isReversed: true,
      icon: "👩🏾‍🏫",
    },
    {
      title: "Parent Engagement System",
      description:
        "Parents receive automated performance reports and school announcements. Our mobile-friendly interface gives parents visibility into their child's progress without overwhelming them with unnecessary school data.",
      // image: "src/assets/parent.jpg",
      image: parentImg,
      isReversed: false,
      icon: "👨🏾‍👩🏾‍👧🏾",
    },
    {
      title: "Document Management Hub",
      description:
        "Secure digital repository for all school documents - exams, syllabi, staff records, and more. Intelligent categorization system with metadata tagging (class, subject, author) makes retrieval instant. Bulk upload capabilities handle paper-to-digital transitions.",
      // image: "src/assets/school-books.jpg",
      image: schoolBooks,
      isReversed: true,
      icon: "🗄️",
    },
  ],

  // Solutions Section
  solutions: {
    title: "Built for African Educational Needs",
    description:
      "Our platform addresses specific challenges faced by schools in African contexts, with offline capabilities, low-bandwidth optimization, and multilingual support.",
    features: [
      "Superuser-controlled ecosystem with hierarchical access",
      "Excel-like data entry with bulk import/export functionality",
      "Automated PDF report generation in multiple formats",
      "Document scanning and categorization system",
      "Role-specific dashboards (Admin/Teacher/Parent)",
      "Mobile-first design for low-end devices",
      "Periodic data backups with local server option",
    ],
    // image: "src/assets/features1.png",
    image: featuresImg,
  },

  // Process Section
  onboarding: {
    steps: [
      {
        title: "School Registration",
        description:
          "School administrator creates the master account and becomes Superuser",
        icon: "📝",
      },
      {
        title: "Account Provisioning",
        description:
          "Superuser creates teacher accounts or enables self-registration with school verification",
        icon: "👥",
      },
      {
        title: "Data Migration",
        description:
          "Upload existing records via spreadsheet or document scanning",
        icon: "📤",
      },
      {
        title: "Ongoing Management",
        description:
          "Daily operations handled through role-specific dashboards",
        icon: "🔄",
      },
    ],
    image: "onboarding-process.jpg",
  },

  // CTA Section
  cta: {
    title: "Ready to Digitize Your School's Operations?",
    description:
      "Join the growing network of African schools using Skul-Data to modernize their data management. Schedule a demo to see how we can transform your institution's operations.",
    buttonText: "Request Demo",
    // backgroundImage: "src/assets/africa-school.jpg",
    backgroundImage: africaSchool,
  },
};
