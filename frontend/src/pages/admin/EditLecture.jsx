import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus, FaPen, FaTrash, FaFilePdf, FaVideo } from "react-icons/fa"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function EditLecture() {
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const selectedLecture = lectureData.find((l) => l._id === lectureId);

  // --- STATE ---
  const [videoFile, setVideoFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);
  const [lectureTitle, setLectureTitle] = useState(
    selectedLecture?.lectureTitle || ""
  );
  const [isPreviewFree, setIsPreviewFree] = useState(
    selectedLecture?.isPreviewFree || false
  );
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    if (selectedLecture) {
      setLectureTitle(selectedLecture.lectureTitle);
      setIsPreviewFree(selectedLecture.isPreviewFree);
    }
  }, [selectedLecture]);

  useEffect(() => {
    axios
      .get(serverUrl + `/api/quiz/${lectureId}`, { withCredentials: true })
      .then((r) => setQuiz(r.data))
      .catch(() => setQuiz(null));
  }, [lectureId]);

  // --- UPDATE LECTURE FUNCTION (FIXED) ---
  const editLecture = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("lectureTitle", lectureTitle);
    formData.append("isPreviewFree", isPreviewFree.toString()); // Convert boolean to string

    // Append video file if selected
    if (videoFile) {
        formData.append("videoUrl", videoFile);
        console.log("🎬 Adding video:", videoFile.name);
    }

    // Append notes file if selected
    if (notesFile) {
        formData.append("notesUrl", notesFile);
        console.log("📄 Adding PDF:", notesFile.name);
    }

    console.log("📤 Sending form data...");
    console.log("📝 Data:", { lectureTitle, isPreviewFree });
    console.log("📁 Files:", { videoFile: videoFile?.name, notesFile: notesFile?.name });

    const result = await axios.post(
        serverUrl + `/api/course/editlecture/${lectureId}`,
        formData,
        { 
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    console.log("✅ Server response:", result.data);

    // Update Redux state
    const updatedLectures = lectureData.map((lecture) => 
        lecture._id === lectureId ? result.data.lecture : lecture
    );
    dispatch(setLectureData(updatedLectures));

    toast.success("✅ Lecture Updated Successfully!");
    navigate(`/createlecture/${courseId}`);
  } catch (e) {
      console.error("🔥 Update failed:", e.response?.data || e);
      toast.error("❌ Update Failed: " + (e.response?.data?.message || e.message));
  }
  setLoading(false);
};
  const removeLecture = async () => {
    setLoading1(true);
    try {
      await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, {
        withCredentials: true,
      });
      toast.success("Lecture Removed");
      navigate(`/createlecture/${courseId}`);
    } catch {
      toast.error("Delete Failed");
    }
    setLoading1(false);
  };

  if (!selectedLecture) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ClipLoader size={50} color="#000" />
          <p className="mt-4 text-gray-600">Loading lecture data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/createlecture/${courseId}`)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Update Lecture</h2>
              <p className="text-gray-500 text-sm">Course: {selectedLecture.lectureTitle}</p>
            </div>
          </div>
        </div>

        {/* QUIZ SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-gray-800">Lecture Quiz</h3>
              <p className="text-sm text-gray-600">Manage quiz for this lecture</p>
            </div>

            {!quiz ? (
              <button
                onClick={() => navigate(`/admin/add-quiz/${lectureId}/${courseId}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <FaPlus /> Add Quiz
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/edit-quiz/${quiz._id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                  <FaPen /> Edit Quiz
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
                    try {
                      await axios.delete(serverUrl + `/api/quiz/${quiz._id}`, {
                        withCredentials: true,
                      });
                      toast.success("Quiz Deleted");
                      setQuiz(null);
                    } catch (error) {
                      toast.error("Failed to delete quiz");
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>

          {quiz && (
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <p className="font-medium text-gray-800">{quiz.questions.length} Questions</p>
              <p className="text-sm text-gray-600 mt-1">Quiz ID: {quiz._id}</p>
            </div>
          )}
        </div>

        {/* LECTURE DETAILS */}
        <div className="space-y-6">
          {/* TITLE INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Title *
            </label>
            <input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter lecture title"
              required
            />
          </div>

          {/* VIDEO UPLOAD */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition">
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <FaVideo className="text-2xl text-indigo-600" />
                </div>
                <p className="font-semibold text-gray-800 mb-2">
                  {videoFile ? "New Video Selected" : "Update Lecture Video"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedLecture.videoUrl && !videoFile 
                    ? "Current video is available. Upload a new one to replace it."
                    : "MP4, MOV, WebM up to 500MB"}
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                  <div className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition">
                    Choose Video File
                  </div>
                </div>
                {videoFile && (
                  <p className="mt-3 text-sm text-green-600">
                    Selected: {videoFile.name}
                  </p>
                )}
                {selectedLecture.videoUrl && !videoFile && (
                  <p className="mt-3 text-sm text-blue-600">
                    Current video is available
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* PDF NOTES UPLOAD */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition">
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FaFilePdf className="text-2xl text-red-600" />
                </div>
                <p className="font-semibold text-gray-800 mb-2">
                  {notesFile ? "New Notes Selected" : "Update Lecture Notes"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedLecture.notesUrl && !notesFile
                    ? "Current PDF is available. Upload a new one to replace it."
                    : "PDF files up to 100MB"}
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setNotesFile(e.target.files[0])}
                  />
                  <div className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                    Choose PDF File
                  </div>
                </div>
                {notesFile && (
                  <p className="mt-3 text-sm text-green-600">
                    Selected: {notesFile.name}
                  </p>
                )}
                {selectedLecture.notesUrl && !notesFile && (
                  <p className="mt-3 text-sm text-blue-600">
                    Current notes are available
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* FREE PREVIEW */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="preview-free"
              checked={isPreviewFree}
              onChange={(e) => setIsPreviewFree(e.target.checked)}
              className="h-5 w-5 text-black focus:ring-black rounded"
            />
            <label htmlFor="preview-free" className="cursor-pointer">
              <p className="font-medium text-gray-800">Make this lecture FREE preview</p>
              <p className="text-sm text-gray-600">Users can watch without enrollment</p>
            </label>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            onClick={removeLecture}
            disabled={loading1}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading1 ? <ClipLoader size={20} color="white" /> : <><FaTrash /> Remove Lecture</>}
          </button>
          <button
            onClick={editLecture}
            disabled={loading || !lectureTitle.trim()}
            className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Update Lecture"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;