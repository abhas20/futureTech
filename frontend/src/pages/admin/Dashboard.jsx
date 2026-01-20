// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Pie,
//   PieChart,
//   Cell,
// } from "recharts";
// import img from "../../assets/empty.jpg";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { motion } from "framer-motion";
// import QuizAnalysis from "../../components/QuizAnalysis";
// import axios from "axios";
// import { serverUrl } from "../../App";

// function Dashboard() {
//   const navigate = useNavigate();
//   const { userData } = useSelector((state) => state.user);
//   const { creatorCourseData } = useSelector((state) => state.course);
//   console.log(creatorCourseData)

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${serverUrl}/api/quiz/teacher/analytics`, {
//           withCredentials: true,
//         });
//         if (res.data.success) {
//           setData(res.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching teacher stats", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const courseProgressData =
//     creatorCourseData?.map((course) => ({
//       name: course.title.slice(0, 10) + "...",
//       lectures: course.lectures.length || 0,
//     })) || [];

//   const enrollData =
//     creatorCourseData?.map((course) => ({
//       name: course.title.slice(0, 10) + "...",
//       enrolled: course.enrolledStudents?.length || 0,
//     })) || [];

//   const totalEarnings =
//     creatorCourseData?.reduce((sum, course) => {
//       const count = course.enrolledStudents?.length || 0;
//       return sum + (course.price ? course.price * count : 0);
//     }, 0) || 0;

//      const totalCourses = creatorCourseData?.length || 0;
//      const totalStudents = creatorCourseData?.reduce(
//        (sum, c) => sum + (c.enrolledStudents?.length || 0),
//        0,
//      );
//      const totalLectures = creatorCourseData?.reduce(
//        (sum, c) => sum + (c.lectures?.length || 0),
//        0,
//      );
//      const avgLectures = totalCourses ? totalLectures / totalCourses : 0;

//      // Pie chart data
//      const pieData = [
//        { name: "Students Enrollled", value: totalStudents || 0 },
//        { name: "Avg Lectures", value: avgLectures || 0 },
//        { name: "Total Lectures", value: totalLectures || 0 },
//      ];

//      const COLORS = ["#2563eb", "#f59e0b", "#10b981"];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
//       {/* BACK */}
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => navigate("/")}
//         className="fixed top-6 left-6 z-20 bg-white shadow-xl rounded-full p-3 hover:bg-blue-50">
//         <FaArrowLeftLong className="w-5 h-5 text-black" />
//       </motion.button>

//       <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
//         {/* HEADER CARD */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col lg:flex-row gap-8 items-center">
//           <img
//             src={userData?.photoUrl || img}
//             className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
//           />

//           <div className="flex-1 text-center lg:text-left">
//             <h1 className="text-4xl font-extrabold text-black">
//               Welcome back, {userData?.name || "Educator"} 👋
//             </h1>
//             <p className="text-gray-600 mt-2 max-w-xl">
//               {userData?.description ||
//                 "Create impactful courses and track your growth effortlessly."}
//             </p>

//             {/* ACTIONS */}
//             <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate("/createcourses")}
//                 className="px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-800">
//                 + Create Course
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate("/courses")}
//                 className="px-6 py-3 border border-black rounded-xl hover:bg-gray-50">
//                 View My Courses
//               </motion.button>
//             </div>
//           </div>

//           {/* EARNINGS CARD */}
//           <div className="bg-gradient-to-br from-black to-blue-600 text-white rounded-2xl p-6 w-full sm:w-[260px] shadow-xl">
//             <p className="text-sm opacity-80">Total Earnings</p>
//             <p className="text-3xl font-bold mt-1">
//               ₹{totalEarnings.toLocaleString()}
//             </p>
//           </div>
//         </motion.div>

//         {/* STATS CARDS */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <p className="text-sm text-gray-500">Total Courses</p>
//             <p className="text-3xl font-bold text-black">
//               {creatorCourseData?.length || 0}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <p className="text-sm text-gray-500">Total Students</p>
//             <p className="text-3xl font-bold text-black">
//               {creatorCourseData?.reduce(
//                 (sum, c) => sum + (c.enrolledStudents?.length || 0),
//                 0,
//               )}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <p className="text-sm text-gray-500">Avg Lectures / Course</p>
//             <p className="text-3xl font-bold text-black">
//               {creatorCourseData?.length
//                 ? Math.round(
//                     creatorCourseData.reduce(
//                       (s, c) => s + (c.lectures?.length || 0),
//                       0,
//                     ) / creatorCourseData.length,
//                   )
//                 : 0}
//             </p>
//           </div>
//         </div>

//         {/* CHARTS */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-3xl shadow-lg p-6">
//             <h2 className="text-xl font-bold mb-4 text-black">
//               Course Content Progress
//             </h2>
//             <ResponsiveContainer width="100%" height={280}>
//               <BarChart data={courseProgressData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Bar dataKey="lectures" fill="#2563eb" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-3xl shadow-lg p-6">
//             <h2 className="text-xl font-bold mb-4 text-black">
//               Student Enrollments
//             </h2>
//             <ResponsiveContainer width="100%" height={280}>
//               <BarChart data={enrollData}>
//                 <CartesianGrid strokeDasharray="4 4" />
//                 <XAxis dataKey="name" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Bar dataKey="enrolled" fill="#000000" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </motion.div>
//         </div>
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-3xl shadow-lg p-6">
//           <h2 className="text-xl font-bold mb-6 text-black">
//             Your Course Stats
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 innerRadius={50}
//                 paddingAngle={5}
//                 label>
//                 {pieData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </motion.div>
//       </div>

//       {
//         loading  ? (
//           <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
//             <p>Loadind...</p>
//           </div>
//         )
//         :
//         <QuizAnalysis loading={loading} data={data} />
//       }

//     </motion.div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
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
import {
  FaPlus,
  FaLayerGroup,
  FaUsers,
  FaChartLine,
  FaWallet,
  FaCrown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import QuizAnalysis from "../../components/QuizAnalysis";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";

function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/quiz/teacher/analytics`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching teacher stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* --- LOGIC & NAMING CONVENTIONS KEPT EXACTLY SAME --- */
  const courseProgressData =
    creatorCourseData?.map((course) => ({
      name:
        course.title.length > 15
          ? course.title.slice(0, 15) + ".."
          : course.title,
      lectures: course.lectures.length || 0,
    })) || [];

  const enrollData =
    creatorCourseData?.map((course) => ({
      name:
        course.title.length > 15
          ? course.title.slice(0, 15) + ".."
          : course.title,
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
    { name: "Avg Lectures", value: Math.round(avgLectures) || 0 },
    { name: "Total Content", value: totalLectures || 0 },
  ];

  const COLORS = ["#1e40af", "#f59e0b", "#0ea5e9"]; // Royal Blue, Gold, Sky Blue

  /* Custom Tooltip Component for Charts */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100">
          <p className="font-bold text-slate-800 text-sm mb-1">{label}</p>
          <p className="text-blue-600 font-black text-lg">
            {payload[0].value}{" "}
            <span className="text-slate-400 text-xs font-normal">count</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8fafc] pb-20 relative overflow-hidden font-sans"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[120px] -z-10" />

      {/* Floating Back Button */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 z-50 bg-white/80 backdrop-blur-md shadow-xl border border-slate-100 text-slate-800 p-4 rounded-2xl transition-all hover:bg-white"
      >
        <FaArrowLeftLong className="w-5 h-5" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-6 pt-24 space-y-10">
        {/* --- HEADER SECTION --- */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] border border-white p-8 md:p-10 flex flex-col lg:flex-row gap-10 items-center relative overflow-hidden"
        >
          {/* Profile Image */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-blue-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
            <img
              src={userData?.photoUrl || img}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-2xl relative z-10"
              alt="Profile"
            />
            <div className="absolute bottom-2 right-2 z-20 bg-amber-400 text-white p-2 rounded-full border-2 border-white shadow-lg">
              <FaCrown size={14} />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Welcome back, {userData?.name?.split(" ")[0] || "Educator"}{" "}
              <span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
              {userData?.description ||
                "Track your impact, manage courses, and grow your student base."}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/createcourses")}
                className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-blue-900 transition-all flex items-center gap-2 font-bold text-sm"
              >
                <FaPlus className="text-amber-400" /> Create Course
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/courses")}
                className="px-8 py-3.5 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl hover:border-blue-200 hover:text-blue-700 transition-all font-bold text-sm"
              >
                View My Courses
              </motion.button>
            </div>
          </div>

          {/* Earnings Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-900 text-white rounded-[2rem] p-8 w-full lg:w-80 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <FaWallet size={80} />
            </div>
            <p className="text-blue-200 text-xs font-black uppercase tracking-[0.2em]">
              Total Earnings
            </p>
            <p className="text-4xl font-black mt-3 tracking-tighter">
              ₹{totalEarnings.toLocaleString()}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase">
                Live Stats
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Courses",
              val: totalCourses,
              icon: <FaLayerGroup />,
              col: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Total Students",
              val: totalStudents,
              icon: <FaUsers />,
              col: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: "Avg Lectures",
              val: Math.round(avgLectures),
              icon: <FaChartLine />,
              col: "text-sky-500",
              bg: "bg-sky-50",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex items-center gap-5 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
            >
              <div
                className={`${item.bg} ${item.col} p-4 rounded-2xl text-2xl`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {item.label}
                </p>
                <p className="text-3xl font-black text-slate-800 mt-1">
                  {item.val}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart 1: Course Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Course Content
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                  Total Lectures per Course
                </p>
              </div>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={courseProgressData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                    dy={10}
                  />
                  {/* FIX: allowDecimals={false} ensures only integers show on Y-Axis */}
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={<CustomTooltip />}
                  />
                  <Bar
                    dataKey="lectures"
                    fill="url(#colorBlue)"
                    radius={[10, 10, 10, 10]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart 2: Enrollments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Student Enrollment
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                  Active Students per Course
                </p>
              </div>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={enrollData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#f59e0b"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                    dy={10}
                  />
                  {/* FIX: allowDecimals={false} ensures only integers show on Y-Axis */}
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={<CustomTooltip />}
                  />
                  <Bar
                    dataKey="enrolled"
                    fill="url(#colorGold)"
                    radius={[10, 10, 10, 10]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* --- PIE CHART --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-5">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Overview Statistics
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                A comprehensive breakdown of your teaching ecosystem. Use these
                insights to balance your content creation efforts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {pieData.map((entry, index) => (
                  <div
                    key={`legend-${index}`}
                    className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl"
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                      {entry.name}
                    </span>
                    <span className="text-sm font-black ml-auto">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={6}
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading ? (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center z-[100]"
          >
            <ClipLoader size={50} color="#1e40af" />
            <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">
              Syncing Dashboard...
            </p>
          </motion.div>
        ) : (
          <div className="mt-16">
            <QuizAnalysis loading={loading} data={data} />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Dashboard;