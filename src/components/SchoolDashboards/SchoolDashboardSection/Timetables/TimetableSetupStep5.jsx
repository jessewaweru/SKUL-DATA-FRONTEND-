import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTimetableGenerator } from "../../../../hooks/useTimetableGenerator";
import TimetablePreview from "../../../common/SchoolTimetable/TimetablePreview";
import TimetableGrid from "../../../common/SchoolTimetable/TimetableGrid";
import "./timetables.css";

const TimetableSetupStep5 = ({ timetableData, updateData }) => {
  const { generate, loading, generatedTimetable, errors } =
    useTimetableGenerator();
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState(null);
  const [formattedTimetable, setFormattedTimetable] = useState(null);

  useEffect(() => {
    // Auto-generate when coming to this step
    if (!generatedTimetable && timetableData.classes.length > 0) {
      handleGenerate();
    }
  }, []);

  useEffect(() => {
    if (generatedTimetable) {
      formatTimetableData(generatedTimetable);
    }
  }, [generatedTimetable]);

  const handleGenerate = async () => {
    await generate({
      school_id: timetableData.school,
      class_ids: timetableData.classes,
      academic_year: timetableData.academicYear,
      term: timetableData.term,
      subjects: timetableData.subjects,
      constraints: timetableData.constraints,
    });
  };

  const formatTimetableData = (timetable) => {
    if (!timetable || !timetable.classes || !timetable.lessons) {
      return;
    }

    // Find the first class if none is selected
    const selectedClassId = activeClass || timetable.classes[0]?.id;
    if (!selectedClassId) return;

    const classTimetable = {
      id: timetable.id,
      school_class: timetable.classes.find((c) => c.id === selectedClassId),
      academic_year: timetable.academic_year,
      term: timetable.term,
      is_active: timetable.is_active,
      lessons: timetable.lessons.filter(
        (lesson) => lesson.class_id === selectedClassId
      ),
      time_slots: timetable.time_slots || generateDefaultTimeSlots(),
    };

    setFormattedTimetable(classTimetable);
    if (!activeClass) setActiveClass(selectedClassId);
  };

  const generateDefaultTimeSlots = () => {
    // Fallback time slots if not provided by API
    return [
      {
        id: 1,
        start_time: "08:00",
        end_time: "08:40",
        name: "Period 1",
        is_break: false,
      },
      {
        id: 2,
        start_time: "08:40",
        end_time: "09:20",
        name: "Period 2",
        is_break: false,
      },
      {
        id: 3,
        start_time: "09:20",
        end_time: "09:50",
        name: "Morning Break",
        is_break: true,
      },
      {
        id: 4,
        start_time: "09:50",
        end_time: "10:30",
        name: "Period 3",
        is_break: false,
      },
      {
        id: 5,
        start_time: "10:30",
        end_time: "11:10",
        name: "Period 4",
        is_break: false,
      },
      {
        id: 6,
        start_time: "11:10",
        end_time: "11:40",
        name: "Short Break",
        is_break: true,
      },
      {
        id: 7,
        start_time: "11:40",
        end_time: "12:20",
        name: "Period 5",
        is_break: false,
      },
      {
        id: 8,
        start_time: "12:20",
        end_time: "13:00",
        name: "Period 6",
        is_break: false,
      },
      {
        id: 9,
        start_time: "13:00",
        end_time: "14:00",
        name: "Lunch Break",
        is_break: true,
      },
      {
        id: 10,
        start_time: "14:00",
        end_time: "14:40",
        name: "Period 7",
        is_break: false,
      },
      {
        id: 11,
        start_time: "14:40",
        end_time: "15:20",
        name: "Period 8",
        is_break: false,
      },
    ];
  };

  const handleSave = async () => {
    try {
      // Here you would call your API endpoint to save the timetable
      // For example: await api.saveTimetable(generatedTimetable);
      alert("Timetable saved successfully!");
      navigate("/school_timetables/timetables/view-all");
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Failed to save timetable");
    }
  };

  const handlePrev = () => {
    navigate("/school_timetables/timetables/create/step-4");
  };

  const handleClassChange = (classId) => {
    setActiveClass(classId);
    formatTimetableData(generatedTimetable);
  };

  if (loading) return <div className="loading">Generating timetable...</div>;

  return (
    <div className="timetable-step-5">
      <h3>Review Generated Timetable</h3>

      <div className="generation-actions">
        <button className="btn-regenerate" onClick={handleGenerate}>
          Regenerate
        </button>
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={!generatedTimetable || errors.length > 0}
        >
          Save Timetable
        </button>
      </div>

      {errors.length > 0 && (
        <div className="generation-errors">
          <h4>Generation Issues:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {formattedTimetable && generatedTimetable?.classes?.length > 0 && (
        <div className="timetable-preview-container">
          <div className="class-selector">
            <h4>Select Class to View:</h4>
            <select
              value={activeClass || ""}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              {generatedTimetable.classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="timetable-header">
            <h4>{formattedTimetable.school_class?.name} Timetable</h4>
            <p>
              {formattedTimetable.academic_year} - Term{" "}
              {formattedTimetable.term}
            </p>
          </div>

          <TimetableGrid timetable={formattedTimetable} />
        </div>
      )}

      {!formattedTimetable && !loading && (
        <div className="no-timetable">
          <p>No timetable data available. Please generate a timetable.</p>
        </div>
      )}

      <div className="step-actions">
        <button className="btn-prev" onClick={handlePrev}>
          Back: Set Constraints
        </button>
      </div>
    </div>
  );
};

export default TimetableSetupStep5;

// const TimetableSetupStep5 = () => {
//   const { timetableData } = useOutletContext();
//   const navigate = useNavigate();
//   const [generatedTimetable, setGeneratedTimetable] = useState(null);
//   const [errors, setErrors] = useState([]);

//   useEffect(() => {
//     if (timetableData?.classes?.length > 0) {
//       generateTimetable();
//     }
//   }, [timetableData]);

//   const generateTimetable = () => {
//     try {
//       // Create a more complete timetable structure
//       const newTimetable = {
//         id: Date.now(),
//         school_class: {
//           id: timetableData.classes[0],
//           name: `Grade ${timetableData.classes[0] === 101 ? "1 A" : "1 B"}`,
//         },
//         academic_year: timetableData.academicYear,
//         term: timetableData.term,
//         is_active: false,
//         lessons: generateLessons(),
//         time_slots: generateTimeSlots(),
//       };

//       setGeneratedTimetable(newTimetable);
//       setErrors([]);
//     } catch (error) {
//       setErrors(["Failed to generate timetable. Please check your inputs."]);
//       console.error("Timetable generation error:", error);
//     }
//   };

//   const generateTimeSlots = () => {
//     // Create consistent time slots for the week
//     const timeSlots = [
//       {
//         id: 1,
//         start_time: "08:00",
//         end_time: "08:40",
//         name: "Period 1",
//         is_break: false,
//       },
//       {
//         id: 2,
//         start_time: "08:40",
//         end_time: "09:20",
//         name: "Period 2",
//         is_break: false,
//       },
//       {
//         id: 3,
//         start_time: "09:20",
//         end_time: "09:50",
//         name: "Morning Break",
//         is_break: true,
//       },
//       {
//         id: 4,
//         start_time: "09:50",
//         end_time: "10:30",
//         name: "Period 3",
//         is_break: false,
//       },
//       {
//         id: 5,
//         start_time: "10:30",
//         end_time: "11:10",
//         name: "Period 4",
//         is_break: false,
//       },
//       {
//         id: 6,
//         start_time: "11:10",
//         end_time: "11:40",
//         name: "Short Break",
//         is_break: true,
//       },
//       {
//         id: 7,
//         start_time: "11:40",
//         end_time: "12:20",
//         name: "Period 5",
//         is_break: false,
//       },
//       {
//         id: 8,
//         start_time: "12:20",
//         end_time: "13:00",
//         name: "Period 6",
//         is_break: false,
//       },
//       {
//         id: 9,
//         start_time: "13:00",
//         end_time: "14:00",
//         name: "Lunch Break",
//         is_break: true,
//       },
//       {
//         id: 10,
//         start_time: "14:00",
//         end_time: "14:40",
//         name: "Period 7",
//         is_break: false,
//       },
//       {
//         id: 11,
//         start_time: "14:40",
//         end_time: "15:20",
//         name: "Period 8",
//         is_break: false,
//       },
//     ];

//     return timeSlots;
//   };

//   const generateLessons = () => {
//     if (!timetableData?.subjects || timetableData.subjects.length === 0) {
//       return [];
//     }

//     const lessons = [];
//     const days = ["MON", "TUE", "WED", "THU", "FRI"];
//     const teachingSlots = generateTimeSlots().filter((slot) => !slot.is_break);

//     // Create a more realistic schedule where subjects repeat on different days
//     timetableData.subjects.forEach((subjectData, subjIndex) => {
//       const subject = {
//         id: subjectData.subject_id,
//         name: getSubjectName(subjectData.subject_id),
//         code: getSubjectCode(subjectData.subject_id),
//       };

//       const teacher = {
//         id: subjectData.teacher_id,
//         user: {
//           full_name: getTeacherName(subjectData.teacher_id),
//         },
//       };

//       // Assign this subject to 2-3 different days
//       const daysToAssign = Math.min(3, days.length);

//       for (let i = 0; i < daysToAssign; i++) {
//         const dayIndex = (subjIndex + i) % days.length;
//         const slotIndex = (subjIndex + i) % Math.min(teachingSlots.length, 5); // Use first 5 periods

//         if (teachingSlots[slotIndex]) {
//           lessons.push({
//             id: `lesson-${subject.id}-${days[dayIndex]}-${slotIndex}`,
//             subject,
//             teacher,
//             time_slot: {
//               ...teachingSlots[slotIndex],
//               day_of_week: days[dayIndex],
//             },
//             is_double_period: Math.random() > 0.8, // 20% chance of double period
//           });
//         }
//       }
//     });

//     return lessons;
//   };

//   const getSubjectName = (subjectId) => {
//     const subjects = {
//       1: "Mathematics",
//       2: "English",
//       3: "Science",
//       4: "Social Studies",
//       5: "Kiswahili",
//     };
//     return subjects[subjectId] || "Subject";
//   };

//   const getSubjectCode = (subjectId) => {
//     const subjects = {
//       1: "MATH",
//       2: "ENG",
//       3: "SCI",
//       4: "SST",
//       5: "KISW",
//     };
//     return subjects[subjectId] || "SUBJ";
//   };

//   const getTeacherName = (teacherId) => {
//     const teachers = {
//       1: "John Smith",
//       2: "Mary Johnson",
//       3: "Gideon Othiambo",
//       4: "John Kamau",
//       5: "Nancy Wambui",
//     };
//     return teachers[teacherId] || "Teacher";
//   };

//   const handleGenerate = () => {
//     generateTimetable();
//   };

//   const handleSave = () => {
//     alert("Timetable saved successfully!");
//     navigate("/dashboard/timetables/view-all");
//   };

//   const handlePrev = () => {
//     navigate("/dashboard/timetables/create/step-4");
//   };

//   return (
//     <div className="timetable-step-5">
//       <h2>Review Generated Timetable</h2>

//       <div className="generation-actions">
//         <button className="btn-regenerate" onClick={handleGenerate}>
//           Regenerate
//         </button>
//         <button
//           className="btn-save"
//           onClick={handleSave}
//           disabled={!generatedTimetable || errors.length > 0}
//         >
//           Save Timetable
//         </button>
//       </div>

//       {errors.length > 0 && (
//         <div className="generation-errors">
//           <h4>Generation Issues:</h4>
//           <ul>
//             {errors.map((error, index) => (
//               <li key={`error-${index}`}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {generatedTimetable && (
//         <div className="timetable-preview-container">
//           <h3>{generatedTimetable.school_class.name} Timetable</h3>
//           <p>
//             {generatedTimetable.academic_year} - Term {generatedTimetable.term}
//           </p>

//           <TimetableGrid timetable={generatedTimetable} />
//         </div>
//       )}

//       <div className="step-actions">
//         <button className="btn-prev" onClick={handlePrev}>
//           Back: Set Constraints
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TimetableSetupStep5;
