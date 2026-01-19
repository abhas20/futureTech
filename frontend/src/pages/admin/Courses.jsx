
import React, { useEffect } from "react";
import {
  FaEdit,
  FaPlus,
  FaArrowLeft,
  FaBookOpen,
  FaGlobe,
  FaCalendarAlt,
  FaLayerGroup,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { setCreatorCourseData } from "../../redux/courseSlice";
import img1 from "../../assets/empty.jpg";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function Courses() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creatorCourseData } = useSelector((state) => state.course);

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getcreatorcourses`,
          { withCredentials: true },
        );
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load courses");
      }
    };
    getCreatorData();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      {/* ROYAL HEADER */}
      <div className="bg-slate-900 pt-10 pb-28 px-6 md:px-12 relative overflow-hidden">
        {/* Animated Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/dashboard")}
                className="p-4 bg-white/10 rounded-2xl text-white backdrop-blur-md border border-white/10 transition-all"
              >
                <FaArrowLeft size={18} />
              </motion.button>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  MY <span className="text-amber-400">COURSES</span>
                </h1>
                <p className="text-slate-400 mt-2 flex items-center gap-2 font-medium">
                  <FaBookOpen className="text-amber-500" />
                  Managing {creatorCourseData?.length || 0} Professional
                  Programs
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgb(245 158 11 / 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/createcourses")}
              className="group flex items-center gap-3 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
              CREATE NEW COURSE
            </motion.button>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 -mt-12"
      >
        {/* Desktop Header Labels */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-4 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">
          <div className="col-span-6">General Details</div>
          <div className="col-span-2 text-center">Investment</div>
          <div className="col-span-2 text-center">Visibility</div>
          <div className="col-span-2 text-right">Settings</div>
        </div>

        {/* COURSE LIST */}
        <div className="space-y-5">
          <AnimatePresence>
            {creatorCourseData?.map((course) => (
              <motion.div
                key={course._id}
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white border border-slate-200/60 rounded-[2rem] p-5 md:p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                  {/* Info Column */}
                  <div className="md:col-span-6 flex items-center gap-6">
                    <div className="relative shrink-0">
                      <img
                        src={course.thumbnail || img1}
                        alt="Course"
                        className="w-20 h-20 md:w-28 md:h-28 rounded-3xl object-cover shadow-md group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute -top-2 -right-2 bg-amber-400 shadow-lg rounded-xl p-2 border-2 border-white">
                        <FaGlobe className="text-slate-900 text-xs" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 overflow-hidden">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-1 mb-2 italic">
                        {course.description || "No description provided."}
                      </p>

                      {/* Meta Tags Horizontal Bar */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider">
                          {course.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <FaLayerGroup size={10} />
                          <span>{course.lectures?.length || 0} Lectures</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs border-l pl-3 border-slate-200">
                          <FaCalendarAlt size={10} />
                          <span>
                            {new Date(course.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Column */}
                  <div className="md:col-span-2 text-center">
                    <div className="inline-block px-4 py-2 bg-slate-50 rounded-2xl">
                      <p className="text-2xl font-black text-slate-800">
                        {course.price ? (
                          `₹${course.price}`
                        ) : (
                          <span className="text-slate-400">FREE</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Status Column */}
                  <div className="md:col-span-2 flex justify-center">
                    <div
                      className={`flex items-center gap-2.5 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border ${
                        course.isPublished
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${course.isPublished ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                      ></span>
                      {course.isPublished ? "Live" : "Draft"}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="md:col-span-2 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/addcourses/${course._id}`)}
                      className="p-5 bg-slate-900 text-white hover:bg-blue-600 rounded-[1.5rem] transition-all shadow-xl"
                    >
                      <FaEdit size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* EMPTY STATE */}
        {creatorCourseData?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 mt-10"
          >
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FaBookOpen className="text-slate-300 text-4xl" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">
              No Courses Found
            </h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Your dashboard is looking a bit empty. Ready to share your
              knowledge with the world?
            </p>
          </motion.div>
        )}

        <footer className="mt-20 pb-10">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>
          <p className="text-slate-400 text-[10px] font-bold text-center uppercase tracking-[0.3em]">
            Quality Education Management System{" "}
            <span className="text-amber-500 mx-2">•</span> TLE Terminators
          </p>
        </footer>
      </motion.div>
    </div>
  );
}

export default Courses;