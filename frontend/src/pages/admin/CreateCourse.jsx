// import axios from "axios";
// import React, { useState } from "react";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";
// import { serverUrl } from "../../App";
// import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";
// import { motion } from "framer-motion";

// const CreateCourse = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");

//   const CreateCourseHandler = async () => {
//     if (!title || !category) {
//       return toast.error("Please fill all fields");
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         serverUrl + "/api/course/create",
//         { title, category },
//         { withCredentials: true },
//       );
//       toast.success("Course Created Successfully 🎉");
//       navigate("/courses");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
//       {/* Back Button */}
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => navigate("/dashboard")}
//         className="fixed top-8 left-8 bg-white shadow-xl rounded-full p-3 hover:bg-blue-100 transition">
//         <FaArrowLeftLong className="w-5 h-5 text-black" />
//       </motion.button>

//       {/* Card */}
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.1 }}
//         className="w-full max-w-xl bg-blue-100 rounded-3xl shadow-2xl p-10 border border-gray-200">
//         <h2 className="text-3xl font-bold text-center text-black mb-2">
//           Create New Course
//         </h2>
//         <p className="text-center text-gray-600 mb-8">
//           Start building your next amazing course 🚀
//         </p>

//         <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
//           {/* Course Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Course Title
//             </label>
//             <input
//               type="text"
//               placeholder="e.g. Complete React Mastery"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full rounded-2xl border bg-white border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm"
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Category
//             </label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full rounded-2xl border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm">
//               <option value="">Select category</option>
//               <option value="App Development">App Development</option>
//               <option value="AI/ML">AI / ML</option>
//               <option value="AI Tools">AI Tools</option>
//               <option value="Data Science">Data Science</option>
//               <option value="Data Analytics">Data Analytics</option>
//               <option value="Ethical Hacking">Ethical Hacking</option>
//               <option value="UI UX Designing">UI / UX Designing</option>
//               <option value="Web Development">Web Development</option>
//               <option value="Others">Others</option>
//             </select>
//           </div>

//           {/* Submit */}
//           <motion.button
//             whileHover={{ scale: loading ? 1 : 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             disabled={loading}
//             onClick={CreateCourseHandler}
//             className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white py-3 rounded-2xl font-semibold shadow-lg hover:bg-blue-900 disabled:opacity-70 transition">
//             {loading ? <ClipLoader size={22} color="white" /> : "Create Course"}
//           </motion.button>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default CreateCourse;

import axios from "axios";
import React, { useState } from "react";
import {
  FaArrowLeft,
  FaCrown,
  FaLightbulb,
  FaRocket,
  FaCompass,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const CreateCourseHandler = async () => {
    if (!title || !category) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);
    try {
      await axios.post(
        serverUrl + "/api/course/create",
        { title, category },
        { withCredentials: true },
      );
      toast.success("Course Created Successfully 🎉");
      navigate("/courses");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#fdfdfd] px-4 overflow-hidden">
      {/* --- PREMIUM UI ENHANCERS (Floating Blobs) --- */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-amber-100/50 rounded-full blur-[100px]" />

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/dashboard")}
        className="fixed top-8 left-8 z-50 bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100 text-slate-800 p-4 rounded-2xl transition-all"
      >
        <FaArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* --- MAIN CREATION CARD --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_100px_rgba(15,23,42,0.1)] border border-white p-10 md:p-14"
      >
        {/* Subtle Top Gradient Border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full" />

        <div className="text-center space-y-3 mb-12">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 px-5 py-2 rounded-full text-amber-700 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <FaCrown /> Instructor Portal
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Create{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">

            Course
            </span>
          </h2>
          <p className="text-slate-500 font-medium">
            Start building your next amazing course 🚀
          </p>
          <p className="text-slate-500 font-medium">
            Step into the spotlight and share your knowledge.
          </p>
        </div>

        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          {/* Title Input Group */}
          <div className="space-y-3 relative">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
              <FaLightbulb className="text-amber-500 animate-pulse" /> Course
              Name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="e.g. The Art of Modern Leadership"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-5 text-slate-800 text-lg font-bold placeholder:text-slate-300 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-[8px] focus:ring-amber-400/5 transition-all shadow-sm"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
              </div>
            </div>
          </div>

          {/* Category Selector Group */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
              <FaCompass className="text-blue-500" /> Academic Domain
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-5 text-slate-800 font-bold focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-[8px] focus:ring-amber-400/5 transition-all cursor-pointer shadow-sm"
              >
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="AI/ML">Artificial Intelligence</option>
                <option value="Data Science">Data Science</option>
                <option value="UI UX Designing">UI / UX Mastery</option>
                <option value="Ethical Hacking">Cyber Security</option>
                <option value="App Development">App Development</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Others">General Interest</option>
                <option value="None">None</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-8 text-amber-500">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={CreateCourseHandler}
            className="w-full relative overflow-hidden group bg-slate-900 py-6 rounded-[1.5rem] shadow-2xl transition-all"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <ClipLoader size={24} color="#f59e0b" />
              ) : (
                <>
                  <span className="text-white group-hover:text-slate-950 font-black text-sm uppercase tracking-[0.3em] transition-colors">
                    Deploy Course
                  </span>
                  <FaRocket className="text-amber-500 group-hover:text-slate-950 transition-colors" />
                </>
              )}
            </div>
          </motion.button>
        </form>

        <div className="mt-12 flex items-center justify-center gap-4 grayscale opacity-40">
          <div className="h-[1px] w-12 bg-slate-300" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-800">
            TLE Terminators
          </p>
          <div className="h-[1px] w-12 bg-slate-300" />
        </div>
      </motion.div>
    </div>
  );
};

export default CreateCourse;