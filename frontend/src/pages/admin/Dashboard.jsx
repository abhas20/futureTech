import React from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  const courseProgressData =
    creatorCourseData?.map((course) => ({
      name: course.title.slice(0, 10) + "...",
      lectures: course.lectures.length || 0,
    })) || [];

  const enrollData =
    creatorCourseData?.map((course) => ({
      name: course.title.slice(0, 10) + "...",
      enrolled: course.enrolledStudents?.length || 0,
    })) || [];

  const totalEarnings =
    creatorCourseData?.reduce((sum, course) => {
      const count = course.enrolledStudents?.length || 0;
      return sum + (course.price ? course.price * count : 0);
    }, 0) || 0;

     const totalCourses = creatorCourseData?.length || 0;
     const totalStudents = creatorCourseData?.reduce(
       (sum, c) => sum + (c.enrolledStudents?.length || 0),
       0,
     );
     const totalLectures = creatorCourseData?.reduce(
       (sum, c) => sum + (c.lectures?.length || 0),
       0,
     );
     const avgLectures = totalCourses ? totalLectures / totalCourses : 0;

     // Pie chart data
     const pieData = [
       { name: "Students", value: totalStudents || 0 },
       { name: "Avg Lectures", value: avgLectures || 0 },
       { name: "Total Lectures", value: totalLectures || 0 },
     ];

     const COLORS = ["#2563eb", "#f59e0b", "#10b981"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* BACK */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-20 bg-white shadow-xl rounded-full p-3 hover:bg-blue-50">
        <FaArrowLeftLong className="w-5 h-5 text-black" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col lg:flex-row gap-8 items-center">
          <img
            src={userData?.photoUrl || img}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
          />

          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold text-black">
              Welcome back, {userData?.name || "Educator"} 👋
            </h1>
            <p className="text-gray-600 mt-2 max-w-xl">
              {userData?.description ||
                "Create impactful courses and track your growth effortlessly."}
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/createcourses")}
                className="px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-800">
                + Create Course
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/courses")}
                className="px-6 py-3 border border-black rounded-xl hover:bg-gray-50">
                View My Courses
              </motion.button>
            </div>
          </div>

          {/* EARNINGS CARD */}
          <div className="bg-gradient-to-br from-black to-blue-600 text-white rounded-2xl p-6 w-full sm:w-[260px] shadow-xl">
            <p className="text-sm opacity-80">Total Earnings</p>
            <p className="text-3xl font-bold mt-1">
              ₹{totalEarnings.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-3xl font-bold text-black">
              {creatorCourseData?.length || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-3xl font-bold text-black">
              {creatorCourseData?.reduce(
                (sum, c) => sum + (c.enrolledStudents?.length || 0),
                0,
              )}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-sm text-gray-500">Avg Lectures / Course</p>
            <p className="text-3xl font-bold text-black">
              {creatorCourseData?.length
                ? Math.round(
                    creatorCourseData.reduce(
                      (s, c) => s + (c.lectures?.length || 0),
                      0,
                    ) / creatorCourseData.length,
                  )
                : 0}
            </p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-black">
              Course Content Progress
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={courseProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="lectures" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-black">
              Student Enrollments
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="enrolled" fill="#000000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-black">
            Your Course Stats
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={5}
                label>
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
