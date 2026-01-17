import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="fixed top-8 left-8 bg-white shadow-xl rounded-full p-3 hover:bg-blue-100 transition">
        <FaArrowLeftLong className="w-5 h-5 text-black" />
      </motion.button>

      {/* Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xl bg-blue-100 rounded-3xl shadow-2xl p-10 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-black mb-2">
          Create New Course
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Start building your next amazing course 🚀
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              placeholder="e.g. Complete React Mastery"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border bg-white border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm">
              <option value="">Select category</option>
              <option value="App Development">App Development</option>
              <option value="AI/ML">AI / ML</option>
              <option value="AI Tools">AI Tools</option>
              <option value="Data Science">Data Science</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Ethical Hacking">Ethical Hacking</option>
              <option value="UI UX Designing">UI / UX Designing</option>
              <option value="Web Development">Web Development</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={CreateCourseHandler}
            className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white py-3 rounded-2xl font-semibold shadow-lg hover:bg-blue-900 disabled:opacity-70 transition">
            {loading ? <ClipLoader size={22} color="white" /> : "Create Course"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateCourse;
