// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   FaArrowLeft,
//   FaPlus,
//   FaPen,
//   FaTrash,
//   FaFilePdf,
//   FaVideo,
// } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { serverUrl } from "../../App";
// import { setLectureData } from "../../redux/lectureSlice";
// import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";
// import { CollapsibleVideo } from "../../components/PreviousVideo";

// function EditLecture() {
//   const navigate = useNavigate();
//   const { courseId, lectureId } = useParams();
//   const dispatch = useDispatch();
//   const { lectureData } = useSelector((state) => state.lecture);

//   const selectedLecture = lectureData.find((l) => l._id === lectureId);

//   const [videoFile, setVideoFile] = useState(null);
//   const [notesFile, setNotesFile] = useState(null);
//   const [lectureTitle, setLectureTitle] = useState(
//     selectedLecture?.lectureTitle || "",
//   );
//   const [isPreviewFree, setIsPreviewFree] = useState(
//     selectedLecture?.isPreviewFree || false,
//   );
//   const [loading, setLoading] = useState(false);
//   const [loading1, setLoading1] = useState(false);
//   const [quiz, setQuiz] = useState(null);

//   useEffect(() => {
//     if (selectedLecture) {
//       setLectureTitle(selectedLecture.lectureTitle);
//       setIsPreviewFree(selectedLecture.isPreviewFree);
//     }
//   }, [selectedLecture]);

//   useEffect(() => {
//     axios
//       .get(serverUrl + `/api/quiz/${lectureId}`, { withCredentials: true })
//       .then((r) => setQuiz(r.data))
//       .catch(() => setQuiz(null));
//   }, [lectureId]);

//   const editLecture = async () => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("lectureTitle", lectureTitle);
//       formData.append("isPreviewFree", isPreviewFree.toString());
//       formData.append("courseId", courseId);
//       if (videoFile) formData.append("videoUrl", videoFile);
//       if (notesFile) formData.append("notesUrl", notesFile);

//       const result = await axios.post(
//         serverUrl + `/api/course/editlecture/${lectureId}`,
//         formData,
//         { withCredentials: true },
//       );

//       const updatedLectures = lectureData.map((lecture) =>
//         lecture._id === lectureId ? result.data.lecture : lecture,
//       );
//       dispatch(setLectureData(updatedLectures));

//       toast.success("Lecture Updated Successfully");
//       navigate(`/createlecture/${courseId}`);
//     } catch {
//       toast.error("Update Failed");
//     }
//     setLoading(false);
//   };

//   const removeLecture = async () => {
//     setLoading1(true);
//     try {
//       await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, {
//         withCredentials: true,
//       });
//       toast.success("Lecture Removed");
//       navigate(`/createlecture/${courseId}`);
//     } catch {
//       toast.error("Delete Failed");
//     }
//     setLoading1(false);
//   };

//   if (!selectedLecture) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-blue-50">
//         <ClipLoader size={50} color="#000" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 p-4 md:p-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-10 border">
//         {/* HEADER */}
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(`/createlecture/${courseId}`)}
//             className="p-3 rounded-full hover:bg-blue-100 transition">
//             <FaArrowLeft />
//           </button>

//           <div>
//             <h2 className="text-3xl font-extrabold text-black">Edit Lecture</h2>
//             <p className="text-gray-500 text-sm">
//               Update content, video & notes
//             </p>
//           </div>
//         </div>

//         {/* QUIZ MODULE */}
//         <div className="rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <h3 className="text-lg font-bold text-black">
//                 Quiz {quiz?.quizTitle || ""}
//               </h3>
//               <h3 className="text-sm text-gray-700">Duration : {quiz?.duration} minutes</h3>
//               <p className="text-sm text-gray-600">
//                 Attach or manage lecture quiz
//               </p>
//             </div>

//             {!quiz ? (
//               <button
//                 onClick={() =>
//                   navigate(`/admin/edit-quiz/${lectureId}/${courseId}`)
//                 }
//                 className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
//                 <FaPlus /> Add Quiz
//               </button>
//             ) : (
//               <div className="flex gap-2">
//                 <button
//                   onClick={() =>
//                     navigate(
//                       `/admin/edit-quiz/${lectureId}/${courseId}/${quiz._id}`,
//                     )
//                   }
//                   className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
//                   <FaPen /> Edit
//                 </button>
//                 <button
//                   onClick={async () => {
//                     if (!window.confirm("Delete this quiz?")) return;
//                     await axios.delete(serverUrl + `/api/quiz/${quiz._id}`, {
//                       withCredentials: true,
//                     });
//                     setQuiz(null);
//                   }}
//                   className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700">
//                   <FaTrash />
//                 </button>
//               </div>
//             )}
//           </div>

//           {quiz && (
//             <p className="mt-4 text-sm font-medium text-gray-700">
//               {quiz.questions.length} questions included
//             </p>
//           )}
//         </div>

//         {/* TITLE */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Lecture Title
//           </label>
//           <input
//             value={lectureTitle}
//             onChange={(e) => setLectureTitle(e.target.value)}
//             className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-600"
//           />
//         </div>

//         {selectedLecture.videoUrl && (
//           <CollapsibleVideo videoUrl={selectedLecture.videoUrl} />
//         )}

//         {/* VIDEO UPLOAD */}
//         <UploadBox
//           icon={<FaVideo />}
//           title="Update Lecture Video"
//           buttonText="Choose Video"
//           color="blue"
//           file={videoFile}
//           setFile={setVideoFile}
//           accept="video/*"
//           current={!!selectedLecture.videoUrl}
//         />

//         {/* PDF UPLOAD */}
//         <UploadBox
//           icon={<FaFilePdf />}
//           title="Update Lecture Notes (PDF)"
//           buttonText="Choose PDF"
//           color="red"
//           file={notesFile}
//           setFile={setNotesFile}
//           accept="application/pdf"
//           current={!!selectedLecture.notesUrl}
//         />

//         {/* FREE PREVIEW */}
//         <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-4">
//           <input
//             type="checkbox"
//             checked={isPreviewFree}
//             onChange={(e) => setIsPreviewFree(e.target.checked)}
//             className="w-5 h-5"
//           />
//           <div>
//             <p className="font-semibold text-black">Free Preview Lecture</p>
//             <p className="text-sm text-gray-600">
//               Allow users to watch without enrolling
//             </p>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
//           <button
//             onClick={removeLecture}
//             disabled={loading1}
//             className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700">
//             {loading1 ? (
//               <ClipLoader size={20} color="white" />
//             ) : (
//               "Remove Lecture"
//             )}
//           </button>

//           <button
//             onClick={editLecture}
//             disabled={loading}
//             className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-blue-700">
//             {loading ? (
//               <ClipLoader size={20} color="white" />
//             ) : (
//               "Update Lecture"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditLecture;

// /* --- Helper Upload Component --- */
// function UploadBox({
//   icon,
//   title,
//   buttonText,
//   color,
//   file,
//   setFile,
//   accept,
//   current,
// }) {
//   return (
//     <div className="border-2 border-dashed rounded-2xl p-6 text-center hover:border-blue-400 transition">
//       <div
//         className={`mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600 mb-4`}>
//         {icon}
//       </div>
//       <p className="font-semibold">{title}</p>
//       <p className="text-sm text-gray-500 mb-4">
//         {current && !file ? "Current file exists" : "Upload new file"}
//       </p>

//       <label className="inline-block">
//         <input
//           type="file"
//           accept={accept}
//           hidden
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <span
//           className={`px-6 py-2 rounded-xl bg-${color}-600 text-white cursor-pointer`}>
//           {buttonText}
//         </span>
//       </label>

//       {file && <p className="mt-3 text-sm text-green-600">{file.name}</p>}
//     </div>
//   );
// }

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaPen,
  FaTrash,
  FaFilePdf,
  FaVideo,
  FaCheckCircle,
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <ClipLoader size={50} color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
        {/* TOP NAVBAR GRADIENT */}
        <div className="bg-gradient-to-r from-blue-700 to-sky-500 p-8 text-white">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(`/createlecture/${courseId}`)}
              className="p-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-300 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Edit Lecture
              </h2>
              <p className="text-blue-100 text-sm opacity-90">
                Modify your content, video, and quiz settings
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* QUIZ MODULE - Premium Look */}
          <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-6 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  Learning Check
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  {quiz ? quiz.quizTitle : "No Quiz Attached"}
                </h3>
                {quiz && (
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {quiz.duration} minutes • {quiz.questions.length} Questions
                  </p>
                )}
              </div>

              {!quiz ? (
                <button
                  onClick={() =>
                    navigate(`/admin/edit-quiz/${lectureId}/${courseId}`)
                  }
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-95"
                >
                  <FaPlus size={14} /> Add Quiz
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/edit-quiz/${lectureId}/${courseId}/${quiz._id}`,
                      )
                    }
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <FaPen className="text-blue-500" size={12} /> Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this quiz?")) return;
                      await axios.delete(serverUrl + `/api/quiz/${quiz._id}`, {
                        withCredentials: true,
                      });
                      setQuiz(null);
                    }}
                    className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* LECTURE TITLE */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Lecture Title
            </label>
            <input
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter a catchy title..."
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-slate-800 text-lg"
            />
          </div>

          {selectedLecture.videoUrl && (
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <CollapsibleVideo videoUrl={selectedLecture.videoUrl} />
            </div>
          )}

          {/* UPLOAD BOXES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UploadBox
              icon={<FaVideo />}
              title="Lecture Video"
              buttonText="Update Video"
              themeColor="blue"
              file={videoFile}
              setFile={setVideoFile}
              accept="video/*"
              current={!!selectedLecture.videoUrl}
            />

            <UploadBox
              icon={<FaFilePdf />}
              title="Lecture Notes"
              buttonText="Update PDF"
              themeColor="amber"
              file={notesFile}
              setFile={setNotesFile}
              accept="application/pdf"
              current={!!selectedLecture.notesUrl}
            />
          </div>

          {/* FREE PREVIEW TOGGLE */}
          <div
            onClick={() => setIsPreviewFree(!isPreviewFree)}
            className={`flex items-center justify-between p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${isPreviewFree ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 bg-slate-50/30"}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${isPreviewFree ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"}`}
              >
                <FaCheckCircle />
              </div>
              <div>
                <p className="font-bold text-slate-800">Free Preview</p>
                <p className="text-xs text-slate-500">
                  Allow students to view this without purchase
                </p>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full relative transition-colors ${isPreviewFree ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <div
                className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${isPreviewFree ? "left-7" : "left-1"}`}
              ></div>
            </div>
          </div>

          {/* FINAL ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
            <button
              onClick={removeLecture}
              disabled={loading1}
              className="flex-1 border-2 border-red-100 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 flex items-center justify-center"
            >
              {loading1 ? (
                <ClipLoader size={20} color="#ef4444" />
              ) : (
                "Delete Lecture"
              )}
            </button>

            <button
              onClick={editLecture}
              disabled={loading}
              className="flex-[2] bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 active:scale-95 flex items-center justify-center"
            >
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

export default EditLecture;

/* --- Enhanced Upload Component --- */
function UploadBox({
  icon,
  title,
  buttonText,
  themeColor,
  file,
  setFile,
  accept,
  current,
}) {
  // Map colors for dynamic Tailwind classes
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "hover:border-blue-400",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "hover:border-amber-400",
      btn: "bg-amber-600 hover:bg-amber-700",
    },
  };

  const style = colorMap[themeColor];

  return (
    <div
      className={`group border-2 border-dashed border-slate-200 rounded-[2rem] p-6 text-center transition-all duration-300 ${style.border} hover:bg-white hover:shadow-md`}
    >
      <div
        className={`mx-auto w-16 h-16 flex items-center justify-center rounded-2xl ${style.bg} ${style.text} mb-4 group-hover:scale-110 transition-transform`}
      >
        {React.cloneElement(icon, { size: 24 })}
      </div>

      <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-400 mb-5 font-medium italic">
        {current && !file ? "Existing file detected" : "No file selected"}
      </p>

      <label className="block">
        <input
          type="file"
          accept={accept}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <span
          className={`block w-full py-3 rounded-xl ${style.btn} text-white text-sm font-bold cursor-pointer transition-all active:scale-95 shadow-sm`}
        >
          {buttonText}
        </span>
      </label>

      {file && (
        <div className="mt-4 flex items-center justify-center gap-2 bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-100">
          <FaCheckCircle className="text-emerald-500" size={12} />
          <p className="text-[10px] font-bold text-emerald-700 truncate max-w-[150px] uppercase tracking-tighter">
            {file.name}
          </p>
        </div>
      )}
    </div>
  );
}
