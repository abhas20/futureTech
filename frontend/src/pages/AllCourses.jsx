// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { serverUrl } from "../App";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   FaBookOpen,
// //   FaStar,
// //   FaUserGraduate,
// //   FaArrowLeft,
// // } from "react-icons/fa";
// // import { useDispatch } from "react-redux";
// // import { setCourseData } from "../redux/courseSlice";
// // import { motion } from "framer-motion";

// // const cardVariants = {
// //   hidden: { opacity: 0, y: 30 },
// //   visible: (i) => ({
// //     opacity: 1,
// //     y: 0,
// //     transition: { delay: i * 0.08 },
// //   }),
// // };

// // const AllCourses = () => {
// //   const [courses, setCourses] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     const fetchCourses = async () => {
// //       try {
// //         const { data } = await axios.get(
// //           `${serverUrl}/api/course/getpublishedcourses`,
// //         );
// //         setCourses(data);
// //         dispatch(setCourseData(data));
// //       } catch (error) {
// //         console.error("Error fetching courses:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchCourses();
// //   }, [dispatch]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-blue-100">
// //         <motion.div
// //           animate={{ rotate: 360 }}
// //           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// //           className="h-12 w-12 rounded-full border-4 border-black border-t-transparent"
// //         />
// //         <p className="text-gray-600 text-sm">Loading courses...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       transition={{ duration: 0.4 }}
// //       className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-10 relative">
// //       {/* Back Button */}
// //       <motion.button
// //         whileHover={{ scale: 1.1 }}
// //         whileTap={{ scale: 0.95 }}
// //         onClick={() => navigate("/")}
// //         className="fixed top-8 left-8 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100">
// //         <FaArrowLeft className="text-gray-800" />
// //       </motion.button>

// //       {/* Header */}
// //       <div className="text-center max-w-2xl mx-auto mb-12">
// //         <h1 className="text-4xl font-bold text-gray-900 mb-3">
// //           Explore Our Courses
// //         </h1>
// //         <p className="text-gray-600">
// //           Learn new skills from expertly crafted content 🚀
// //         </p>
// //       </div>

// //       {/* Courses Grid */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
// //         {courses.length > 0 ? (
// //           courses.map((course, index) => (
// //             <motion.div
// //               key={course._id}
// //               custom={index}
// //               variants={cardVariants}
// //               initial="hidden"
// //               animate="visible"
// //               whileHover={{ y: -6 }}
// //               onClick={() => navigate(`/viewcourse/${course._id}`)}
// //               className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100">
// //               {/* Thumbnail */}
// //               <div className="relative h-48 overflow-hidden">
// //                 <img
// //                   src={
// //                     course.thumbnail ||
// //                     "https://via.placeholder.com/400x250?text=No+Thumbnail"
// //                   }
// //                   alt={course.title}
// //                   className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
// //                 />
// //                 <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow">
// //                   {course.category}
// //                 </span>
// //               </div>

// //               {/* Content */}
// //               <div className="p-5 space-y-3">
// //                 <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
// //                   {course.title}
// //                 </h3>

// //                 <p className="text-sm text-gray-500 line-clamp-2">
// //                   {course.description || "No description available."}
// //                 </p>

// //                 <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
// //                   <div className="flex items-center gap-1">
// //                     <FaUserGraduate className="text-indigo-500" />
// //                     <span>{course.enrolledStudents?.length || 0}</span>
// //                   </div>

// //                   <div className="flex items-center gap-1">
// //                     <FaStar className="text-yellow-400" />
// //                     <span>{course.rating || 4.5}</span>
// //                   </div>

// //                   <div className="flex items-center gap-1">
// //                     <FaBookOpen className="text-green-500" />
// //                     <span>{course.lectures?.length || 0}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           ))
// //         ) : (
// //           <div className="col-span-full text-center py-24 text-gray-500">
// //             No courses published yet.
// //           </div>
// //         )}
// //       </div>
// //     </motion.div>
// //   );
// // };

// // export default AllCourses;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { serverUrl } from "../App";
// import { useNavigate } from "react-router-dom";
// import {
//   FaBookOpen,
//   FaStar,
//   FaUserGraduate,
//   FaArrowLeft,
//   FaCrown,
//   FaSearch,
// } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { setCourseData } from "../redux/courseSlice";
// import { motion } from "framer-motion";

// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
//   }),
// };

// const AllCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const { data } = await axios.get(
//           `${serverUrl}/api/course/getpublishedcourses`,
//         );
//         setCourses(data);
//         dispatch(setCourseData(data));
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc] relative overflow-hidden">
//         {/* Compact Loading State */}
//         <div className="absolute top-0 left-0 w-full h-full bg-blue-50/50 -z-10" />
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-amber-500"
//         />
//         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
//           Loading Catalog...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//       className="min-h-screen bg-[#f8fafc] px-4 py-4 relative overflow-x-hidden font-sans" // Reduced py-6 to py-4
//     >
//       {/* Background Decor (Subtle & Tight) */}
//       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[100px] -z-10" />
//       <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/40 rounded-full blur-[100px] -z-10" />

//       {/* Floating Back Button (Compact with Golden Hover) */}
//       <motion.button
//         whileHover={{ scale: 1.1, x: -3, borderColor: "#fbbf24" }} // Add golden border on hover
//         whileTap={{ scale: 0.95 }}
//         onClick={() => navigate("/")}
//         className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-800 p-3 rounded-xl transition-colors" // Adjusted top/left position
//       >
//         <FaArrowLeft className="text-sm" />
//       </motion.button>

//       {/* Header Section (Minimized Vertical Space & Golden Theme) */}
//       <div className="text-center max-w-4xl mx-auto mb-6 mt-0 pt-2">
//         {" "}
//         {/* Removed large margins, added minimal padding */}
//         <motion.div
//           initial={{ y: -10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-3 py-1 rounded-full shadow-sm mb-2" // Golden background for badge
//         >
//           <FaCrown className="text-amber-600 text-xs" />{" "}
//           {/* Darker gold icon */}
//           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-800">
//             Royal Catalog
//           </span>{" "}
//           {/* Darker gold text */}
//         </motion.div>
//         <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
//           Explore{" "}
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600">
//             Premium Courses
//           </span>{" "}
//           {/* Golden Gradient Text */}
//         </h1>
//       </div>

//       {/* Courses Grid (Tighter Gap) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto pb-10">
//         {" "}
//         {/* Added xl breakpoint for 4 columns */}
//         {courses.length > 0 ? (
//           courses.map((course, index) => (
//             <motion.div
//               key={course._id}
//               custom={index}
//               variants={cardVariants}
//               initial="hidden"
//               animate="visible"
//               whileHover={{ y: -5, borderColor: "#fbbf24" }} // Golden border on hover
//               onClick={() => navigate(`/viewcourse/${course._id}`)}
//               className="group bg-white rounded-[1.5rem] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)] transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 flex flex-col h-full"
//             >
//               {/* Thumbnail Section */}
//               <div className="relative h-40 overflow-hidden">
//                 {" "}
//                 {/* Slightly reduced height */}
//                 <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10" />
//                 <img
//                   src={
//                     course.thumbnail ||
//                     "https://via.placeholder.com/400x250?text=No+Thumbnail"
//                   }
//                   alt={course.title}
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//                 {/* Category Badge */}
//                 <div className="absolute top-3 right-3 z-20">
//                   <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
//                     {course.category}
//                   </span>
//                 </div>
//                 {/* Price Tag (Golden) */}
//                 <div className="absolute bottom-3 left-3 z-20">
//                   <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 text-xs font-black px-3 py-1 rounded-lg shadow-lg">
//                     {" "}
//                     {/* Golden Gradient Button */}
//                     {course.price ? `₹${course.price}` : "FREE"}
//                   </span>
//                 </div>
//               </div>

//               {/* Content Section */}
//               <div className="p-4 flex flex-col flex-1">
//                 {" "}
//                 {/* Reduced padding */}
//                 <div className="flex-1 space-y-2">
//                   <h3 className="text-lg font-black text-slate-800 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
//                     {" "}
//                     {/* Hover text color changed to gold/amber */}
//                     {course.title}
//                   </h3>

//                   <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
//                     {course.description ||
//                       "Expert-led curriculum designed for modern professionals."}
//                   </p>
//                 </div>
//                 {/* Stats Footer (Pill Style) */}
//                 <div className="mt-4 pt-3 border-t border-slate-50 grid grid-cols-3 gap-2">
//                   {" "}
//                   {/* Reduced margin/padding */}
//                   <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
//                     <FaUserGraduate className="text-blue-600 text-[10px] mb-1" />
//                     <span className="text-[10px] font-bold text-slate-700">
//                       {course.enrolledStudents?.length || 0}
//                     </span>
//                   </div>
//                   <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-slate-50 group-hover:bg-amber-50 transition-colors">
//                     <FaStar className="text-amber-500 text-[10px] mb-1" />
//                     <span className="text-[10px] font-bold text-slate-700">
//                       {course.rating || 4.5}
//                     </span>
//                   </div>
//                   <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-slate-50 group-hover:bg-sky-50 transition-colors">
//                     <FaBookOpen className="text-sky-500 text-[10px] mb-1" />
//                     <span className="text-[10px] font-bold text-slate-700">
//                       {course.lectures?.length || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))
//         ) : (
//           <div className="col-span-full flex flex-col items-center justify-center py-10 opacity-60">
//             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
//               <FaSearch className="text-slate-300 text-xl" />
//             </div>
//             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
//               Catalog is currently empty.
//             </p>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default AllCourses;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaStar,
  FaUserGraduate,
  FaArrowLeft,
  FaCrown,
  FaSearch,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/course/getpublishedcourses`,
        );
        setCourses(data);
        dispatch(setCourseData(data));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc] relative overflow-hidden">
        {/* Compact Loading State */}
        <div className="absolute top-0 left-0 w-full h-full bg-blue-50/50 -z-10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-amber-500"
        />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Loading Catalog...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#f8fafc] px-4 py-4 relative overflow-x-hidden font-sans"
    >
      {/* Background Decor (Subtle & Tight) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/40 rounded-full blur-[100px] -z-10" />

      {/* Floating Back Button (Compact) */}
      <motion.button
        whileHover={{ scale: 1.1, x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-800 p-3 rounded-xl hover:border-amber-400 transition-colors"
      >
        <FaArrowLeft className="text-sm" />
      </motion.button>

      {/* Header Section */}
      <div className="text-center max-w-4xl mx-auto mb-10 mt-4">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-white border border-amber-200 px-3 py-1 rounded-full shadow-sm mb-3"
        >
          <FaCrown className="text-amber-500 text-xs" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
            TLE Terminators
          </span>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Explore{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
            Premium Courses
          </span>
        </h1>

        {/* RESTORED TEXT */}
        <p className="text-slate-500 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Unlock your potential with expertly crafted content designed to
          elevate your career.
        </p>
      </div>

      {/* Courses Grid - 3 COLUMNS ONLY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-12">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <motion.div
              key={course._id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/viewcourse/${course._id}`)}
              className="group bg-white rounded-[1.8rem] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)] transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 hover:border-amber-200 flex flex-col h-full"
            >
              {/* Thumbnail Section */}
              <div className="relative h-52 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10" />
                <img
                  src={
                    course.thumbnail ||
                    "https://via.placeholder.com/400x250?text=No+Thumbnail"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                    {course.category}
                  </span>
                </div>

                {/* Price Tag (Golden) */}
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-lg shadow-lg">
                    {course.price ? `₹${course.price}` : "FREE"}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-black text-slate-800 line-clamp-1 group-hover:text-blue-700 transition-colors leading-snug">
                    {course.title}
                  </h3>

                  <h2>
                    {" "}
                    Educator :{" "}
                    {course.creator ? course.creator.name : "AUTHOR"}{" "}
                  </h2>

                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {course.description ||
                      "Expert-led curriculum designed for modern professionals."}
                  </p>
                </div>

                {/* Stats Footer (Pill Style) */}
                <div className="mt-6 pt-4 border-t border-slate-50 grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                    <FaUserGraduate className="text-blue-600 text-[10px] mb-1" />
                    <span className="text-[11px] font-bold text-slate-700">
                      {course.enrolledStudents?.length || 0}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-amber-50 transition-colors">
                    <FaStar className="text-amber-500 text-[10px] mb-1" />
                    <span className="text-[11px] font-bold text-slate-700">
                      {course.rating || 4.5}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-sky-50 transition-colors">
                    <FaBookOpen className="text-sky-500 text-[10px] mb-1" />
                    <span className="text-[11px] font-bold text-slate-700">
                      {course.lectures?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 opacity-60">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-slate-300 text-xl" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              Catalog is currently empty.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AllCourses;