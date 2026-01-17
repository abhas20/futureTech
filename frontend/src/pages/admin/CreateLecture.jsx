import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 px-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border p-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Create Lectures
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add and manage lectures for your course
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/addcourses/${courseId}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition">
            <FaArrowLeft /> Back to Course
          </motion.button>
        </div>

        {/* ADD LECTURE */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="visible"
          className="bg-gray-50 border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800">
            Add New Lecture
          </h2>

          <input
            type="text"
            placeholder="e.g. Introduction to MERN Stack"
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) => setLectureTitle(e.target.value)}
            value={lectureTitle}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={createLectureHandler}
            className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center">
            {loading ? (
              <ClipLoader size={22} color="white" />
            ) : (
              "+ Create Lecture"
            )}
          </motion.button>
        </motion.div>

        {/* LECTURE LIST */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-800">
            Course Lectures ({lectureData.length})
          </h3>

          {lectureData.length === 0 ? (
            <p className="text-sm text-gray-500">
              No lectures added yet. Start by creating one above.
            </p>
          ) : (
            lectureData.map((lecture, index) => (
              <motion.div
                key={lecture._id}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
                <div>
                  <p className="font-medium text-gray-800">
                    Lecture {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">
                    {lecture.lectureTitle}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    navigate(`/editlecture/${courseId}/${lecture._id}`)
                  }
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-black hover:bg-gray-800 text-white transition">
                  <FaEdit />
                  <span className="text-sm">Edit</span>
                </motion.button>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default CreateLecture;
