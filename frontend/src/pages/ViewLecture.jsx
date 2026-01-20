// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { FaArrowLeft, FaTrophy } from "react-icons/fa";
// import axios from "axios";
// import { serverUrl } from "../App";
// import { toast } from "react-toastify";
// import CourseSidebar from "../components/CourseSlidebar";
// import LectureViewForUser from "../components/LectureView";
// import QuizView from "../components/QuizView";

// function ViewCourse() {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { userData } = useSelector((state) => state.user);

//   const [loading, setLoading] = useState(true);
//   const [course, setCourse] = useState(null);
//   const [lectures, setLectures] = useState([]);
//   const [quizzes, setQuizzes] = useState([]);

//   // Active State
//   const [activeTab, setActiveTab] = useState("lectures"); // 'lectures' or 'quizzes'
//   const [activeUnit, setActiveUnit] = useState(null); // The specific lecture or quiz object

//   // Fetch Course & Quiz Data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 1. Fetch Course & Lectures
//         const courseRes = await axios.get(
//           `${serverUrl}/api/course/getcourse/${courseId}`,
//           { withCredentials: true },
//         );
//         setCourse(courseRes.data);
//         setLectures(courseRes.data.lectures || []);

//         // 2. Fetch Quizzes
//         const quizRes = await axios.get(
//           `${serverUrl}/api/quiz/course/${courseId}`,
//           { withCredentials: true },
//         );
//         setQuizzes(quizRes.data.quizzes || []);

//         // 3. Set Default Active Unit (First Lecture)
//         if (courseRes.data.lectures?.length > 0) {
//           setActiveUnit(courseRes.data.lectures[0]);
//           setActiveTab("lectures");
//         }
//       } catch (error) {
//         console.error("Error loading course:", error);
//         toast.error("Failed to load course content");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (courseId) fetchData();
//   }, [courseId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* --- Header --- */}
//       <div className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/allcourses")}
//             className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
//             <FaArrowLeft />
//           </button>
//           <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">
//             {course?.title}
//           </h1>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
//             <FaTrophy className="text-yellow-500" />
//             <span>{userData?.xp || 0} XP</span>
//           </div>
//           <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
//             {userData?.name?.charAt(0).toUpperCase()}
//           </div>
//         </div>
//       </div>

//       {/* --- Main Content Layout --- */}
//       <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-6 gap-6">
//         {/* LEFT COLUMN: Dynamic Content (Lecture or Quiz) */}
//         <div className="flex-1 flex flex-col gap-6 min-w-0">
//           {activeTab === "lectures" && activeUnit ? (
//             <LectureViewForUser
//               lecture={activeUnit}
//               lectures={lectures}
//               courseCreator={course?.creator}
//             />
//           ) : activeTab === "quizzes" && activeUnit ? (
//             <QuizView quiz={activeUnit} userId={userData?._id} />
//           ) : (
//             <div className="h-64 flex items-center justify-center bg-white rounded-2xl shadow-sm text-gray-500">
//               Select an item from the sidebar to begin.
//             </div>
//           )}
//         </div>

//         {/* RIGHT COLUMN: Sidebar List */}
//         <div className="lg:w-[400px]">
//           <CourseSidebar
//             lectures={lectures}
//             quizzes={quizzes}
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             activeUnit={activeUnit}
//             setActiveUnit={setActiveUnit}
//             courseCreator={course?.creator}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ViewCourse;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrophy,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaPlayCircle,
  FaClipboardList,
} from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import CourseSidebar from "../components/CourseSlidebar";
import LectureViewForUser from "../components/LectureView";
import QuizView from "../components/QuizView";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active State
  const [activeTab, setActiveTab] = useState("lectures");
  const [activeUnit, setActiveUnit] = useState(null);

  // Fetch Course & Quiz Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const courseRes = await axios.get(
          `${serverUrl}/api/course/getcourse/${courseId}`,
          { withCredentials: true },
        );
        setCourse(courseRes.data);
        setLectures(courseRes.data.lectures || []);

        const quizRes = await axios.get(
          `${serverUrl}/api/quiz/course/${courseId}`,
          { withCredentials: true },
        );
        setQuizzes(quizRes.data.quizzes || []);

        if (courseRes.data.lectures?.length > 0) {
          setActiveUnit(courseRes.data.lectures[0]);
          setActiveTab("lectures");
        }
      } catch (error) {
        console.error("Error loading course:", error);
        toast.error("Failed to load course content");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
        <ClipLoader size={50} color="#fbbf24" />
        <p className="text-amber-400 font-bold uppercase tracking-widest text-xs mt-4">
          Loading Classroom...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans overflow-hidden text-slate-100">
      {/* --- Top Navigation Bar (Royal Dark Theme) --- */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-2xl"
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/allcourses")}
            className="p-3 hover:bg-white/5 rounded-xl transition text-slate-300 hover:text-amber-400 border border-transparent hover:border-white/10"
          >
            <FaArrowLeft />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-black text-white truncate max-w-[200px] md:max-w-md tracking-tight">
              {course?.title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-amber-400/80 font-bold uppercase tracking-widest hidden md:flex">
              {activeTab === "lectures" ? (
                <FaPlayCircle />
              ) : (
                <FaClipboardList />
              )}
              {activeUnit
                ? activeUnit.title || activeUnit.lectureTitle
                : "Select a topic"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* XP Badge (Gold Gradient) */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)]">
            <FaTrophy className="text-yellow-400 drop-shadow-md" />
            <span>{userData?.xp || 0} XP</span>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200">
                {userData?.name}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Student
              </p>
            </div>
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-lg"
                alt="User"
              />
            ) : (
              <FaUserCircle className="text-3xl text-slate-600" />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-300 text-xl ml-2 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </motion.div>

      {/* --- Main Content Layout --- */}
      <div className="flex-1 flex relative h-[calc(100vh-80px)]">
        {/* LEFT COLUMN: Dynamic Content (Video/Quiz) - Dark Theater Mode */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#020617] relative">
          {/* Subtle Blue Glow in Background */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
              <motion.div
                key={activeUnit?._id || "empty"}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                {activeTab === "lectures" && activeUnit ? (
                  <LectureViewForUser
                    lecture={activeUnit}
                    lectures={lectures}
                    courseCreator={course?.creator}
                  />
                ) : activeTab === "quizzes" && activeUnit ? (
                  <QuizView quiz={activeUnit} userId={userData?._id} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600">
                    <FaPlayCircle className="text-6xl mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-sm">
                      Select content to begin
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (Desktop) - Light/Glass for Contrast */}
        <div className="hidden lg:block w-[400px] border-l border-slate-800 bg-slate-900 h-full overflow-y-auto z-40 shadow-2xl">
          <CourseSidebar
            lectures={lectures}
            quizzes={quizzes}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeUnit={activeUnit}
            setActiveUnit={setActiveUnit}
            courseCreator={course?.creator}
          />
        </div>

        {/* MOBILE SIDEBAR (Drawer) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 w-full md:w-[400px] h-full bg-slate-900 border-l border-slate-800 z-50 shadow-2xl lg:hidden"
            >
              <CourseSidebar
                lectures={lectures}
                quizzes={quizzes}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeUnit={activeUnit}
                setActiveUnit={(unit) => {
                  setActiveUnit(unit);
                  setSidebarOpen(false);
                }}
                courseCreator={course?.creator}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ViewCourse;