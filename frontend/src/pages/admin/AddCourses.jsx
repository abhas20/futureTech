// import React, { useEffect, useRef, useState } from "react";
// import img from "../../assets/empty.jpg";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { MdEdit } from "react-icons/md";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";
// import { useDispatch, useSelector } from "react-redux";
// import { serverUrl } from "../../App";
// import { setCourseData } from "../../redux/courseSlice";
// import SelectField from "../../components/SelectField";
// import InputField from "../../components/InputField";

// function AddCourses() {
//   const navigate = useNavigate();
//   const { courseId } = useParams();
//   const dispatch = useDispatch();
//   const { courseData } = useSelector((state) => state.course);

//   const thumbRef = useRef();

//   const [loading, setLoading] = useState(false);
//   const [frontendImage, setFrontendImage] = useState(img);
//   const [backendImage, setBackendImage] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     subTitle: "",
//     description: "",
//     category: "",
//     level: "",
//     price: "",
//     isPublished: false,
//   });

//   /* ---------------- Fetch Course ---------------- */
//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const res = await axios.get(
//           `${serverUrl}/api/course/getcourse/${courseId}`,
//           { withCredentials: true },
//         );
//         setForm(res.data);
//         setFrontendImage(res.data.thumbnail || img);
//       } catch {
//         toast.error("Failed to load course");
//       }
//     };
//     fetchCourse();
//   }, [courseId]);

//   const handleChange = (field) => (e) =>
//     setForm({ ...form, [field]: e.target.value });

//   const handleThumbnail = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setBackendImage(file);
//     setFrontendImage(URL.createObjectURL(file));
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     const formData = new FormData();
//     Object.entries(form).forEach(([k, v]) => formData.append(k, v));
//     if (backendImage) formData.append("thumbnail", backendImage);

//     try {
//       const res = await axios.post(
//         `${serverUrl}/api/course/editcourse/${courseId}`,
//         formData,
//         { withCredentials: true },
//       );

//       dispatch(
//         setCourseData(
//           courseData.map((c) => (c._id === res.data._id ? res.data : c)),
//         ),
//       );

//       toast.success("Course updated successfully");
//       navigate("/courses");
//     } catch {
//       toast.error("Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeCourse = async () => {
//     if (!window.confirm("Are you sure you want to delete this course?")) return;
//     setLoading(true);
//     try {
//       await axios.delete(`${serverUrl}/api/course/removecourse/${courseId}`, {
//         withCredentials: true,
//       });
//       dispatch(setCourseData(courseData.filter((c) => c._id !== courseId)));
//       toast.success("Course deleted");
//       navigate("/courses");
//     } catch {
//       toast.error("Delete failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border p-8 space-y-10">
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <FaArrowLeftLong
//               className="cursor-pointer text-xl"
//               onClick={() => navigate("/courses")}
//             />
//             <div>
//               <h2 className="text-3xl font-extrabold text-black">
//                 Edit Course
//               </h2>
//               <p className="text-sm text-gray-500">
//                 Manage course details & publishing
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate(`/createlecture/${courseId}`)}
//             className="bg-black text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
//             Manage Lectures
//           </button>
//         </div>

//         {/* STATUS BAR */}
//         <div className="flex flex-wrap items-center gap-4">
//           <span
//             className={`px-4 py-2 rounded-full text-sm font-semibold ${
//               form.isPublished
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-yellow-700"
//             }`}>
//             {form.isPublished ? "Published" : "Draft"}
//           </span>

//           <button
//             onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
//             className="px-4 py-2 rounded-xl border font-medium hover:bg-gray-50">
//             {form.isPublished ? "Unpublish" : "Publish"}
//           </button>

//           <button
//             onClick={removeCourse}
//             className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">
//             Remove Course
//           </button>
//         </div>

//         {/* FORM */}
//         <div className="space-y-6">
//           <InputField
//             label="Course Title"
//             value={form.title}
//             onChange={handleChange("title")}
//             placeholder="e.g. Complete React Mastery"
//           />

//           <InputField
//             label="Subtitle"
//             value={form.subTitle}
//             onChange={handleChange("subTitle")}
//             placeholder="Short engaging subtitle"
//           />

//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               Description
//             </label>
//             <textarea
//               value={form.description}
//               onChange={handleChange("description")}
//               className="w-full rounded-xl border px-4 py-3 h-28 focus:ring-2 focus:ring-blue-600"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <SelectField
//               label="Category"
//               value={form.category}
//               onChange={handleChange("category")}
//               options={[
//                 "Web Development",
//                 "AI/ML",
//                 "Data Science",
//                 "UI UX Designing",
//                 "Ethical Hacking",
//                 "Others",
//               ]}
//             />

//             <SelectField
//               label="Level"
//               value={form.level}
//               onChange={handleChange("level")}
//               options={["Beginner", "Intermediate", "Advanced"]}
//             />

//             <InputField
//               label="Price (₹)"
//               type="number"
//               value={form.price}
//               onChange={handleChange("price")}
//             />
//           </div>

//           {/* THUMBNAIL */}
//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               Course Thumbnail
//             </label>
//             <input
//               ref={thumbRef}
//               type="file"
//               hidden
//               accept="image/*"
//               onChange={handleThumbnail}
//             />
//             <div
//               onClick={() => thumbRef.current.click()}
//               className="relative w-[320px] h-[180px] rounded-xl overflow-hidden border cursor-pointer group">
//               <img
//                 src={frontendImage}
//                 alt="thumbnail"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//                 <MdEdit className="text-white text-3xl" />
//               </div>
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
//             <button
//               onClick={() => navigate("/courses")}
//               className="flex-1 border py-3 rounded-xl hover:bg-gray-50">
//               Cancel
//             </button>

//             <button
//               onClick={handleSave}
//               disabled={loading}
//               className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
//               {loading ? (
//                 <ClipLoader size={20} color="white" />
//               ) : (
//                 "Save Changes"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddCourses;

import React, { useEffect, useRef, useState } from "react";
import img from "../../assets/empty.jpg";
import {
  FaArrowLeft,
  FaCamera,
  FaCloudUploadAlt,
  FaTrashAlt,
  FaSave,
  FaLayerGroup,
} from "react-icons/fa";
import { MdOutlinePublishedWithChanges, MdUnpublished } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { setCourseData } from "../../redux/courseSlice";
import { motion } from "framer-motion";

function AddCourses() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);

  const thumbRef = useRef();

  const [loading, setLoading] = useState(false);
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    description: "",
    category: "",
    level: "",
    price: "",
    isPublished: false,
  });

  /* ---------------- Fetch Course ---------------- */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/course/getcourse/${courseId}`,
          { withCredentials: true },
        );
        setForm(res.data);
        setFrontendImage(res.data.thumbnail || img);
      } catch {
        toast.error("Failed to load course");
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (backendImage) formData.append("thumbnail", backendImage);

    try {
      const res = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        { withCredentials: true },
      );

      dispatch(
        setCourseData(
          courseData.map((c) => (c._id === res.data._id ? res.data : c)),
        ),
      );

      toast.success("Course updated successfully");
      navigate("/courses");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const removeCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/api/course/removecourse/${courseId}`, {
        withCredentials: true,
      });
      dispatch(setCourseData(courseData.filter((c) => c._id !== courseId)));
      toast.success("Course deleted");
      navigate("/courses");
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-10">
      {/* HEADER SECTION - Royal Blue Theme */}
      <div className="bg-slate-900 pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate("/courses")}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300 backdrop-blur-md"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Course Settings
              </h1>
              <p className="text-slate-400 text-sm">
                Manage details, pricing and publication status
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate(`/createlecture/${courseId}`)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <FaLayerGroup />
              <span>Manage Lectures</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CARD - Overlapping Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-4 -mt-10"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* LEFT COLUMN: MAIN INPUTS */}
            <div className="lg:col-span-2 p-6 md:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-slate-100">
              {/* Title & Subtitle */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Course Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. The Complete Web Development Bootcamp"
                    className="w-full text-lg font-bold text-slate-800 placeholder:text-slate-300 border-b-2 border-slate-200 py-2 focus:border-blue-600 focus:outline-none transition-all bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Subtitle
                  </label>
                  <input
                    name="subTitle"
                    value={form.subTitle}
                    onChange={handleChange}
                    placeholder="A catchy hook for your students..."
                    className="w-full text-base font-medium text-slate-600 placeholder:text-slate-300 border-b-2 border-slate-200 py-2 focus:border-blue-600 focus:outline-none transition-all bg-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Course Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detail what students will learn..."
                  className="w-full h-32 rounded-xl bg-slate-50 border border-slate-200 p-4 text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                />
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CustomSelect
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={[
                    "Web Development",
                    "AI/ML",
                    "Data Science",
                    "UI/UX Design",
                    "Cyber Security",
                    "Business",
                    "Marketing",

                    "Others",
                    "NONE",
                  ]}
                />
                <CustomSelect
                  label="Level"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  options={[
                    "Beginner",
                    "Intermediate",
                    "Advanced",
                    "All Levels",
                    "NONE",
                  ]}
                />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR CONTROLS */}
            <div className="lg:col-span-1 p-6 md:p-8 bg-slate-50/50 space-y-8">
              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Course Thumbnail
                </label>
                <div
                  onClick={() => thumbRef.current.click()}
                  className="group relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-white cursor-pointer hover:border-blue-500 transition-all shadow-sm"
                >
                  <img
                    src={frontendImage}
                    alt="Thumbnail"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                    <FaCamera className="text-2xl" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Change Image
                    </span>
                  </div>
                </div>
                <input
                  ref={thumbRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleThumbnail}
                />
                <p className="text-[10px] text-slate-400 text-center">
                  Recommended: 1280x720 (16:9)
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Publish Toggle */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${form.isPublished ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}
                  >
                    {form.isPublished ? (
                      <MdOutlinePublishedWithChanges size={20} />
                    ) : (
                      <MdUnpublished size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Publish Course
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {form.isPublished
                        ? "Visible to students"
                        : "Hidden (Draft Mode)"}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={() =>
                      setForm({ ...form, isPublished: !form.isPublished })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <ClipLoader size={18} color="white" />
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>

                <button
                  onClick={removeCourse}
                  className="w-full py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <FaTrashAlt size={14} /> Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* Reusable Select Component for cleaner code */
const CustomSelect = ({ label, options, value, onChange, name }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 font-semibold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none cursor-pointer"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  </div>
);

export default AddCourses;


