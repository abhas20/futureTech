// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FaArrowLeft, FaEdit } from "react-icons/fa";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { serverUrl } from "../../App";
// import { ClipLoader } from "react-spinners";
// import { useDispatch, useSelector } from "react-redux";
// import { setLectureData } from "../../redux/lectureSlice";
// import { motion } from "framer-motion";

// /* ---------- ANIMATION VARIANTS ---------- */
// const container = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.08 },
//   },
// };

// const item = {
//   hidden: { opacity: 0, y: 15 },
//   visible: { opacity: 1, y: 0 },
// };

// function CreateLecture() {
//   const navigate = useNavigate();
//   const { courseId } = useParams();
//   const [lectureTitle, setLectureTitle] = useState("");
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const { lectureData } = useSelector((state) => state.lecture);

//   const createLectureHandler = async () => {
//     if (!lectureTitle.trim()) {
//       toast.error("Lecture title cannot be empty");
//       return;
//     }
//     setLoading(true);
//     try {
//       const result = await axios.post(
//         `${serverUrl}/api/course/createlecture/${courseId}`,
//         { lectureTitle },
//         { withCredentials: true },
//       );

//       dispatch(setLectureData([...lectureData, result.data.lecture]));
//       toast.success("Lecture created successfully");
//       setLectureTitle("");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to create lecture");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const getLecture = async () => {
//       try {
//         const result = await axios.get(
//           `${serverUrl}/api/course/getcourselecture/${courseId}`,
//           { withCredentials: true },
//         );
//         dispatch(setLectureData(result.data.lectures));
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to load lectures");
//       }
//     };
//     getLecture();
//   }, [courseId, dispatch]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 px-4">
//       <motion.div
//         initial={{ scale: 0.96, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.1 }}
//         className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border p-8 space-y-8">
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-extrabold text-gray-900">
//               Create Lectures
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Add and manage lectures for your course
//             </p>
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.08 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate(`/addcourses/${courseId}`)}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition">
//             <FaArrowLeft /> Back to Course
//           </motion.button>
//         </div>

//         {/* ADD LECTURE */}
//         <motion.div
//           variants={item}
//           initial="hidden"
//           animate="visible"
//           className="bg-gray-50 border rounded-2xl p-6 space-y-4">
//           <h2 className="font-semibold text-lg text-gray-800">
//             Add New Lecture
//           </h2>

//           <input
//             type="text"
//             placeholder="e.g. Introduction to MERN Stack"
//             className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
//             onChange={(e) => setLectureTitle(e.target.value)}
//             value={lectureTitle}
//           />

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             disabled={loading}
//             onClick={createLectureHandler}
//             className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center">
//             {loading ? (
//               <ClipLoader size={22} color="white" />
//             ) : (
//               "+ Create Lecture"
//             )}
//           </motion.button>
//         </motion.div>

//         {/* LECTURE LIST */}
//         <motion.div
//           variants={container}
//           initial="hidden"
//           animate="visible"
//           className="space-y-3">
//           <h3 className="font-semibold text-lg text-gray-800">
//             Course Lectures ({lectureData.length})
//           </h3>

//           {lectureData.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               No lectures added yet. Start by creating one above.
//             </p>
//           ) : (
//             lectureData.map((lecture, index) => (
//               <motion.div
//                 key={lecture._id}
//                 variants={item}
//                 whileHover={{ scale: 1.02 }}
//                 className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
//                 <div>
//                   <p className="font-medium text-gray-800">
//                     Lecture {index + 1}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {lecture.lectureTitle}
//                   </p>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() =>
//                     navigate(`/editlecture/${courseId}/${lecture._id}`)
//                   }
//                   className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-black hover:bg-gray-800 text-white transition">
//                   <FaEdit />
//                   <span className="text-sm">Edit</span>
//                 </motion.button>
//               </motion.div>
//             ))
//           )}
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// }

// export default CreateLecture;

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaPlus,
  FaBookOpen,
  FaLayerGroup,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setLectureData } from "../../redux/lectureSlice";
import { motion } from "framer-motion";

/* ---------- ANIMATION VARIANTS ---------- */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true },
      );

      dispatch(setLectureData([...lectureData, result.data.lecture]));
      toast.success("Lecture created successfully");
      setLectureTitle("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLecture = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getcourselecture/${courseId}`,
          { withCredentials: true },
        );
        dispatch(setLectureData(result.data.lectures));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load lectures");
      }
    };
    getLecture();
  }, [courseId, dispatch]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100"
      >
        {/* HEADER: Matching the Edit Lecture Theme */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate(`/addcourses/${courseId}`)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Create Lectures
                </h2>
                <p className="text-slate-400 text-sm opacity-90">
                  Organize and structure your course content
                </p>
              </div>
            </div>
            <div className="hidden md:flex bg-white/10 px-4 py-2 rounded-2xl items-center gap-3">
              <FaLayerGroup className="text-blue-400" />
              <span className="text-sm font-bold uppercase tracking-widest">
                {lectureData.length} Lectures
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          {/* ADD LECTURE CARD */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-6 md:p-8 shadow-sm"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>

            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  New Entry
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Draft Your Next Lesson
              </h2>

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="e.g. 01. Introduction to the Core Concepts"
                  className="flex-[3] rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-slate-700 text-lg shadow-sm"
                  onChange={(e) => setLectureTitle(e.target.value)}
                  value={lectureTitle}
                />

                <button
                  disabled={loading}
                  onClick={createLectureHandler}
                  className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <ClipLoader size={22} color="white" />
                  ) : (
                    <>
                      <FaPlus size={14} />
                      <span>Create</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* LECTURE LIST */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Curriculum Overview
              </h3>
              {lectureData.length > 0 && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {lectureData.length} total lessons
                </span>
              )}
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              {lectureData.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <div className="mx-auto w-16 h-16 bg-slate-100 text-slate-300 flex items-center justify-center rounded-full mb-4">
                    <FaBookOpen size={28} />
                  </div>
                  <p className="text-slate-500 font-medium">
                    No lectures added yet.
                  </p>
                  <p className="text-slate-400 text-sm">
                    Start your course by creating your first lecture above.
                  </p>
                </div>
              ) : (
                lectureData.map((lecture, index) => (
                  <motion.div
                    key={lecture._id}
                    variants={item}
                    whileHover={{ y: -3 }}
                    className="group flex items-center justify-between bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mb-0.5">
                          Lesson
                        </p>
                        <p className="font-bold text-slate-800 text-lg truncate group-hover:text-blue-600 transition-colors">
                          {lecture.lectureTitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/editlecture/${courseId}/${lecture._id}`)
                      }
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm"
                    >
                      <FaEdit
                        size={12}
                        className="text-blue-500 group-hover:text-blue-300"
                      />
                      <span>Edit Content</span>
                    </button>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateLecture;