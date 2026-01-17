import React, { useEffect, useRef, useState } from "react";
import img from "../../assets/empty.jpg";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { setCourseData } from "../../redux/courseSlice";
import SelectField from "../../components/SelectField";
import InputField from "../../components/InputField";

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

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border p-8 space-y-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <FaArrowLeftLong
              className="cursor-pointer text-xl"
              onClick={() => navigate("/courses")}
            />
            <div>
              <h2 className="text-3xl font-extrabold text-black">
                Edit Course
              </h2>
              <p className="text-sm text-gray-500">
                Manage course details & publishing
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/createlecture/${courseId}`)}
            className="bg-black text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
            Manage Lectures
          </button>
        </div>

        {/* STATUS BAR */}
        <div className="flex flex-wrap items-center gap-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              form.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-yellow-700"
            }`}>
            {form.isPublished ? "Published" : "Draft"}
          </span>

          <button
            onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
            className="px-4 py-2 rounded-xl border font-medium hover:bg-gray-50">
            {form.isPublished ? "Unpublish" : "Publish"}
          </button>

          <button
            onClick={removeCourse}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">
            Remove Course
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          <InputField
            label="Course Title"
            value={form.title}
            onChange={handleChange("title")}
            placeholder="e.g. Complete React Mastery"
          />

          <InputField
            label="Subtitle"
            value={form.subTitle}
            onChange={handleChange("subTitle")}
            placeholder="Short engaging subtitle"
          />

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              className="w-full rounded-xl border px-4 py-3 h-28 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectField
              label="Category"
              value={form.category}
              onChange={handleChange("category")}
              options={[
                "Web Development",
                "AI/ML",
                "Data Science",
                "UI UX Designing",
                "Ethical Hacking",
                "Others",
              ]}
            />

            <SelectField
              label="Level"
              value={form.level}
              onChange={handleChange("level")}
              options={["Beginner", "Intermediate", "Advanced"]}
            />

            <InputField
              label="Price (₹)"
              type="number"
              value={form.price}
              onChange={handleChange("price")}
            />
          </div>

          {/* THUMBNAIL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Course Thumbnail
            </label>
            <input
              ref={thumbRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleThumbnail}
            />
            <div
              onClick={() => thumbRef.current.click()}
              className="relative w-[320px] h-[180px] rounded-xl overflow-hidden border cursor-pointer group">
              <img
                src={frontendImage}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <MdEdit className="text-white text-3xl" />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              onClick={() => navigate("/courses")}
              className="flex-1 border py-3 rounded-xl hover:bg-gray-50">
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCourses;
