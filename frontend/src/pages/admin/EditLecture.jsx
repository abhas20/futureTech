import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaPen,
  FaTrash,
  FaFilePdf,
  FaVideo,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { CollapsibleVideo } from "../../components/PreviousVideo";

function EditLecture() {
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();
  const dispatch = useDispatch();
  const { lectureData } = useSelector((state) => state.lecture);

  const selectedLecture = lectureData.find((l) => l._id === lectureId);

  const [videoFile, setVideoFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);
  const [lectureTitle, setLectureTitle] = useState(
    selectedLecture?.lectureTitle || "",
  );
  const [isPreviewFree, setIsPreviewFree] = useState(
    selectedLecture?.isPreviewFree || false,
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

  const editLecture = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("lectureTitle", lectureTitle);
      formData.append("isPreviewFree", isPreviewFree.toString());
      formData.append("courseId", courseId);
      if (videoFile) formData.append("videoUrl", videoFile);
      if (notesFile) formData.append("notesUrl", notesFile);

      const result = await axios.post(
        serverUrl + `/api/course/editlecture/${lectureId}`,
        formData,
        { withCredentials: true },
      );

      const updatedLectures = lectureData.map((lecture) =>
        lecture._id === lectureId ? result.data.lecture : lecture,
      );
      dispatch(setLectureData(updatedLectures));

      toast.success("Lecture Updated Successfully");
      navigate(`/createlecture/${courseId}`);
    } catch {
      toast.error("Update Failed");
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
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <ClipLoader size={50} color="#000" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-10 border">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/createlecture/${courseId}`)}
            className="p-3 rounded-full hover:bg-blue-100 transition">
            <FaArrowLeft />
          </button>

          <div>
            <h2 className="text-3xl font-extrabold text-black">Edit Lecture</h2>
            <p className="text-gray-500 text-sm">
              Update content, video & notes
            </p>
          </div>
        </div>

        {/* QUIZ MODULE */}
        <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-black">
                Quiz {quiz?.quizTitle || ""}
              </h3>
              <h3 className="text-sm text-gray-700">Duration : {quiz?.duration} minutes</h3>
              <p className="text-sm text-gray-600">
                Attach or manage lecture quiz
              </p>
            </div>

            {!quiz ? (
              <button
                onClick={() =>
                  navigate(`/admin/edit-quiz/${lectureId}/${courseId}`)
                }
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
                <FaPlus /> Add Quiz
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(
                      `/admin/edit-quiz/${lectureId}/${courseId}/${quiz._id}`,
                    )
                  }
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                  <FaPen /> Edit
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm("Delete this quiz?")) return;
                    await axios.delete(serverUrl + `/api/quiz/${quiz._id}`, {
                      withCredentials: true,
                    });
                    setQuiz(null);
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700">
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          {quiz && (
            <p className="mt-4 text-sm font-medium text-gray-700">
              {quiz.questions.length} questions included
            </p>
          )}
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lecture Title
          </label>
          <input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {selectedLecture.videoUrl && (
          <CollapsibleVideo videoUrl={selectedLecture.videoUrl} />
        )}

        {/* VIDEO UPLOAD */}
        <UploadBox
          icon={<FaVideo />}
          title="Update Lecture Video"
          buttonText="Choose Video"
          color="blue"
          file={videoFile}
          setFile={setVideoFile}
          accept="video/*"
          current={!!selectedLecture.videoUrl}
        />

        {/* PDF UPLOAD */}
        <UploadBox
          icon={<FaFilePdf />}
          title="Update Lecture Notes (PDF)"
          buttonText="Choose PDF"
          color="red"
          file={notesFile}
          setFile={setNotesFile}
          accept="application/pdf"
          current={!!selectedLecture.notesUrl}
        />

        {/* FREE PREVIEW */}
        <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-4">
          <input
            type="checkbox"
            checked={isPreviewFree}
            onChange={(e) => setIsPreviewFree(e.target.checked)}
            className="w-5 h-5"
          />
          <div>
            <p className="font-semibold text-black">Free Preview Lecture</p>
            <p className="text-sm text-gray-600">
              Allow users to watch without enrolling
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            onClick={removeLecture}
            disabled={loading1}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700">
            {loading1 ? (
              <ClipLoader size={20} color="white" />
            ) : (
              "Remove Lecture"
            )}
          </button>

          <button
            onClick={editLecture}
            disabled={loading}
            className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
            {loading ? (
              <ClipLoader size={20} color="white" />
            ) : (
              "Update Lecture"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;

/* --- Helper Upload Component --- */
function UploadBox({
  icon,
  title,
  buttonText,
  color,
  file,
  setFile,
  accept,
  current,
}) {
  return (
    <div className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-blue-400 transition">
      <div
        className={`mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600 mb-4`}>
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-500 mb-4">
        {current && !file ? "Current file exists" : "Upload new file"}
      </p>

      <label className="inline-block">
        <input
          type="file"
          accept={accept}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <span
          className={`px-6 py-2 rounded-xl bg-${color}-600 text-white cursor-pointer`}>
          {buttonText}
        </span>
      </label>

      {file && <p className="mt-3 text-sm text-green-600">{file.name}</p>}
    </div>
  );
}
