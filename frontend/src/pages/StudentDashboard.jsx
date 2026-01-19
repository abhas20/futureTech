
import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  FaTrophy,
  FaClipboardCheck,
  FaChartLine,
  FaArrowLeft,
  FaMedal,
  FaCrown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

function StudentDashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ totalQuizzes: 0, avgPercentage: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/quiz/user/analytics`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setData(res.data.data);
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Error loading dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <ClipLoader size={50} color="#2563eb" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-4">
          Loading Analytics...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[100px] -z-10" />

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-800 p-3 rounded-xl hover:border-amber-400 transition-all"
      >
        <FaArrowLeft />
      </motion.button>

      <div className="max-w-6xl mx-auto space-y-10 pt-16">
        {/* Header */}
        <div className="text-center md:text-left">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3"
          >
            <FaCrown className="text-blue-600 text-xs" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-800">
              TLE Terminators
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            My Learning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
              Dashboard
            </span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Track your progress and compare your performance against peers.
          </p>
        </div>

        {/* 1. Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-5 relative overflow-hidden"
          >
            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-blue-50 rounded-full blur-2xl -z-10" />
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 text-2xl shadow-sm">
              <FaClipboardCheck />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                Quizzes Taken
              </p>
              <h3 className="text-4xl font-black text-slate-900 mt-1">
                {stats.totalQuizzes}
              </h3>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-5 relative overflow-hidden"
          >
            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-emerald-50 rounded-full blur-2xl -z-10" />
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 text-2xl shadow-sm">
              <FaChartLine />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                Average Score
              </p>
              <h3 className="text-4xl font-black text-slate-900 mt-1">
                {stats.avgPercentage}%
              </h3>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-5 relative overflow-hidden"
          >
            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-amber-50 rounded-full blur-2xl -z-10" />
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 text-2xl shadow-sm">
              <FaTrophy />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                Current Level
              </p>
              <h3 className="text-4xl font-black text-slate-900 mt-1">1</h3>
            </div>
          </motion.div>
        </div>

        {/* 2. The Performance Graph (Comparison Mode) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Performance Trend
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                Your Score vs Class Average
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold">
                Last 10 Quizzes
              </span>
            </div>
          </div>

          {data.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="quizTitle"
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 100]}
                    unit="%"
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      backgroundColor: "#fff",
                      padding: "12px",
                    }}
                    formatter={(value, name) => {
                      if (name === "percentage")
                        return [`${value}%`, "Your Score"];
                      if (name === "classAverage")
                        return [`${value}%`, "Class Avg"];
                      if (name === "highestScore")
                        return [`${value}%`, "Topper"];
                      return [value, name];
                    }}
                    labelStyle={{
                      fontWeight: "bold",
                      color: "#1e293b",
                      marginBottom: "5px",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="classAverage"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="transparent"
                    name="Class Avg"
                  />

                  <Area
                    type="monotone"
                    dataKey="highestScore"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="transparent"
                    name="Highest"
                  />

                  <Area
                    type="monotone"
                    dataKey="percentage"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    name="You"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <FaChartLine className="text-slate-300 text-4xl mx-auto mb-4" />
              <p className="text-slate-500 font-bold">
                No quiz data available yet.
              </p>
            </div>
          )}
        </motion.div>

        {/* 3. Recent Activity List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FaMedal />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Recent Quiz History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-6 pl-8">Quiz Title</th>
                  <th className="p-6">Date</th>
                  <th className="p-6">Your Score</th>
                  <th className="p-6 hidden sm:table-cell">Class Avg</th>
                  <th className="p-6 hidden sm:table-cell">Topper</th>
                  <th className="p-6 pr-8 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data
                  .slice()
                  .reverse()
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-6 pl-8 font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {item.quizTitle}
                      </td>
                      <td className="p-6 text-sm text-slate-500 font-medium">
                        {item.date}
                      </td>

                      <td className="p-6">
                        <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                          {item.score} / {item.totalQuestions}
                        </span>
                      </td>

                      <td className="p-6 text-slate-500 font-medium hidden sm:table-cell">
                        {item.classAverage}%
                      </td>
                      <td className="p-6 text-emerald-600 font-bold hidden sm:table-cell">
                        {item.highestScore}%
                      </td>

                      <td className="p-6 pr-8 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            item.percentage >= 70
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.percentage >= 70 ? "bg-emerald-500" : "bg-amber-500"}`}
                          ></span>
                          {item.percentage >= 70 ? "Passed" : "Review"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentDashboard;