import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaStar,
  FaUserGraduate,
  FaArrowLeft,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08 },
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-black border-t-transparent"
        />
        <p className="text-gray-600 text-sm">Loading courses...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-10 relative">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100">
        <FaArrowLeft className="text-gray-800" />
      </motion.button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Explore Our Courses
        </h1>
        <p className="text-gray-600">
          Learn new skills from expertly crafted content 🚀
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <motion.div
              key={course._id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -6 }}
              onClick={() => navigate(`/viewcourse/${course._id}`)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100">
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    course.thumbnail ||
                    "https://via.placeholder.com/400x250?text=No+Thumbnail"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {course.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {course.description || "No description available."}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-1">
                    <FaUserGraduate className="text-indigo-500" />
                    <span>{course.enrolledStudents?.length || 0}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{course.rating || 4.5}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaBookOpen className="text-green-500" />
                    <span>{course.lectures?.length || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-24 text-gray-500">
            No courses published yet.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AllCourses;
