
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlay, FaLayerGroup, FaSearch, FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";

function EnrolledCourse() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // Staggered Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 relative font-sans overflow-x-hidden">
      {/* --- Background Decor (Light & Royal) --- */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-100/60 via-blue-50/40 to-transparent -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* --- Header Section --- */}
        <div className="relative mb-12 text-center">
          {/* Back Button - Desktop */}
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            // Dark text on light background for visibility
            className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex w-12 h-12 items-center justify-center bg-white shadow-md rounded-2xl text-slate-600 border border-slate-100 transition-all z-20 hover:text-blue-600"
          >
            <FaArrowLeftLong />
          </motion.button>

          {/* Back Button - Mobile */}
          <div className="md:hidden flex justify-start mb-6">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 flex items-center justify-center bg-white shadow-md rounded-xl text-slate-600 border border-slate-100"
            >
              <FaArrowLeftLong />
            </button>
          </div>

          <div className="inline-block relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-200 shadow-sm mb-3 mx-auto"
            >
              <FaCrown className="text-amber-500 text-xs" />
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">
                TLE Terminators
              </span>
            </motion.div>

            {/* Title - Dark Text for Light Background */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              My Enrolled{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Courses
              </span>
            </h1>
          </div>
        </div>

        {/* --- Content Area --- */}
        {userData.enrolledCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur-xl rounded-[3rem] shadow-xl border border-white mx-auto max-w-3xl text-center p-8 mt-10"
          >
            <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mb-8 shadow-inner border-4 border-white">
              <FaSearch className="text-5xl text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
              No Active Enrollments
            </h3>
            <p className="text-slate-500 font-bold mb-10 max-w-md mx-auto leading-relaxed text-sm uppercase tracking-wide">
              Your dashboard looks a bit empty. Explore our catalog to start
              building your skills today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/allcourses")}
              className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 uppercase tracking-widest text-xs hover:bg-blue-700 transition-colors"
            >
              Browse Catalog
            </motion.button>
          </motion.div>
        ) : (
          /* --- Course Grid --- */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {userData.enrolledCourses.map((course) => (
              <motion.div
                key={course._id}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-white rounded-[2.5rem] shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-full group cursor-pointer relative"
                onClick={() => navigate(`/viewlecture/${course._id}`)}
              >
                {/* Image Section - No Text Overlays */}
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-500 z-10" />
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <FaPlay className="text-blue-600 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex-1 space-y-3">
                    {/* Level Tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <FaLayerGroup className="text-amber-500 text-xs" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {course.level} Level
                      </span>
                    </div>

                    <h2 className="text-lg font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {course.title}
                    </h2>
                  </div>

                  {/* Progress Section Removed */}

                  {/* CTA Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full py-3.5 rounded-2xl font-bold text-white bg-slate-900 shadow-lg group-hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                  >
                    <FaPlay size={10} /> Continue Learning
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default EnrolledCourse;