import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import {
  FaVideo,
  FaPlayCircle,
  FaCalendarAlt,
  FaUserTie,
  FaUpload,
  FaEdit,
  FaFileAlt,
  FaTrash,
  FaDownload,
  FaClock,
  FaArrowLeft,
  FaChalkboardTeacher,
  FaBroadcastTower,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function LiveClassDashboard() {
  const [lectures, setLectures] = useState([]);
  const [tab, setTab] = useState("upcoming");

  // Modal & File States
  const [uploadingId, setUploadingId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());

  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/live/all`, {
        withCredentials: true,
      });
      if (data.success) {
        setLectures(data.lectures);
      }
    } catch (error) {
      console.error("Error fetching lectures", error);
    }
  };

  // --- HANDLERS ---
  const handleCloseModals = () => {
    setShowUploadModal(false);
    setShowNotesModal(false);
    setVideoFile(null);
    setNotesFile(null);
    setSelectedLecture(null);
    setInputKey(Date.now());
  };

  const handleShowUploadModal = (lecture, isUpdate = false) => {
    if (!lecture.isInstructor) {
      toast.error("Only instructor can upload recordings");
      return;
    }
    setSelectedLecture({ ...lecture, isUpdate });
    setShowUploadModal(true);
  };

  const handleShowNotesModal = (lecture) => {
    if (!lecture.isInstructor) {
      toast.error("Only instructor can manage notes");
      return;
    }
    setSelectedLecture(lecture);
    setShowNotesModal(true);
  };

  const handleFileSelect = (e, type = "video") => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "video") {
      if (file.size > 500 * 1024 * 1024) {
        toast.error("File size too large. Maximum size is 500MB.");
        return;
      }
      const validTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload MP4, MOV, AVI, or WMV.");
        return;
      }
      setVideoFile(file);
    } else {
      // NOTES - Only allow PDF files
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size too large. Maximum size is 50MB.");
        return;
      }
      
      // Strict PDF validation
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
        toast.error("Only PDF files are allowed for notes.");
        e.target.value = ""; // Clear the input
        return;
      }
      
      setNotesFile(file);
    }
  };

  const handleUploadRecording = async () => {
    if (!videoFile || !selectedLecture)
      return toast.error("Please select a video file");
    setUploadingId(selectedLecture.meetingId);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("meetingId", selectedLecture.meetingId);

    try {
      const endpoint = selectedLecture.isUpdate
        ? `${serverUrl}/api/live/update-recording`
        : `${serverUrl}/api/live/upload-recording`;

      const { data } = await axios.post(endpoint, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message || "Recording uploaded!");
        setLectures((prev) =>
          prev.map((l) =>
            l.meetingId === selectedLecture.meetingId
              ? { ...l, recordingUrl: data.url, hasRecording: true }
              : l,
          ),
        );
        handleCloseModals();
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleUploadNotes = async () => {
    if (!notesFile || !selectedLecture)
      return toast.error("Please select a PDF file");
    
    // Double-check it's a PDF
    if (notesFile.type !== "application/pdf" && !notesFile.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Only PDF files are allowed for notes.");
      return;
    }
    
    setUploadingId(selectedLecture.meetingId);

    const formData = new FormData();
    formData.append("notes", notesFile);
    formData.append("meetingId", selectedLecture.meetingId);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/live/upload-notes`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (data.success) {
        toast.success("Notes uploaded!");
        setLectures((prev) =>
          prev.map((l) =>
            l.meetingId === selectedLecture.meetingId
              ? { ...l, notes: data.notes, hasNotes: true }
              : l,
          ),
        );
        handleCloseModals();
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDownloadNotes = (lecture) => {
    try {
      // This will trigger the backend download function
      const downloadUrl = `${serverUrl}/api/live/download-notes/${lecture.meetingId}`;
      window.open(downloadUrl, '_blank');
    } catch {
      toast.error("Download failed.");
    }
  };

  const handleDeleteNotes = async (meetingId) => {
    if (!window.confirm("Delete notes?")) return;
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/live/delete-notes`,
        { meetingId },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success("Notes deleted!");
        setLectures((prev) =>
          prev.map((l) =>
            l.meetingId === meetingId
              ? { ...l, notes: null, hasNotes: false }
              : l,
          ),
        );
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  // --- HELPERS ---
  const upcomingLectures = lectures
    .filter((l) => l.isActive === true)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const pastLectures = lectures
    .filter((l) => l.isActive === false)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className="text-red-500" />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return <FaFileAlt className="text-red-500" />;
    return <FaFileAlt className="text-slate-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-800">
      {/* --- HEADER --- */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                <span className="p-2 bg-blue-100 rounded-xl text-blue-600">
                  <FaBroadcastTower />
                </span>
                Live Classroom
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 ml-1">
                Your Interactive Learning Hub
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${tab === "upcoming" ? "bg-white text-blue-700 shadow-lg shadow-blue-100/50 scale-105" : "text-slate-500 hover:text-slate-700"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${tab === "upcoming" ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}
              ></span>{" "}
              Upcoming
            </button>
            <button
              onClick={() => setTab("past")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${tab === "past" ? "bg-white text-blue-700 shadow-lg shadow-blue-100/50 scale-105" : "text-slate-500 hover:text-slate-700"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${tab === "past" ? "bg-red-500" : "bg-slate-300"}`}
              ></span>{" "}
              Recordings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        {/* --- GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {(tab === "upcoming" ? upcomingLectures : pastLectures).map(
              (lecture) => {
                const isMyLecture = lecture.isInstructor;
                const hasRecording = lecture.recordingUrl;
                const hasNotes = lecture.notes && lecture.notes.url;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    key={lecture._id}
                    className={`group bg-white rounded-[2rem] overflow-hidden transition-all duration-300 h-full flex flex-col border-2 ${isMyLecture ? "border-blue-100 shadow-xl shadow-blue-100/50" : "border-white shadow-lg shadow-slate-200/50"}`}
                  >
                    {/* Thumbnail */}
                    <div className="h-48 bg-slate-900 relative overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 w-full h-1 z-20 ${tab === "upcoming" ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <img
                        src={
                          lecture.courseId?.thumbnail ||
                          "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=200&fit=crop"
                        }
                        alt=""
                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute top-4 left-4 flex gap-2 z-10">
                        {isMyLecture && (
                          <span className="bg-amber-400 text-black text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-lg flex items-center gap-1">
                            <FaChalkboardTeacher /> Instructor
                          </span>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md text-slate-800 z-10 border border-white/20">
                        <FaUserTie className="text-blue-600" />
                        {lecture.instructorId?.name || "Tutor"}
                      </div>

                      {/* Join Overlay */}
                      {tab === "upcoming" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                          <button
                            onClick={() =>
                              navigate(`/live/${lecture.meetingId}`)
                            }
                            className="px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl transform scale-95 group-hover:scale-100 transition-all bg-white text-blue-700 hover:bg-blue-50"
                          >
                            <FaVideo
                              className={
                                isMyLecture ? "text-red-500" : "text-green-500"
                              }
                            />
                            {isMyLecture ? "Start Class" : "Join Now"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-1 relative">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                            {lecture.courseId?.title || "Course"}
                          </span>
                          {hasRecording && (
                            <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                              <FaPlayCircle /> Recorded
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                          {lecture.topic}
                        </h3>

                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
                          <FaCalendarAlt className="text-blue-500" />
                          {formatDate(lecture.startTime)}
                        </div>
                      </div>

                      {/* Notes Section */}
                      <div className="mt-6 pt-5 border-t border-slate-100 border-dashed">
                        {hasNotes ? (
                          <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-3 flex items-center justify-between hover:bg-emerald-100 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                                <FaFileAlt className="text-red-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-emerald-900 text-xs truncate">
                                  PDF Notes
                                </p>
                                <p className="text-[10px] text-emerald-700 font-medium">
                                  Ready to download
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDownloadNotes(lecture)}
                                className="p-2 bg-white rounded-lg text-emerald-600 hover:text-emerald-800 shadow-sm hover:shadow-md transition-all"
                              >
                                <FaDownload size={12} />
                              </button>
                              {isMyLecture && (
                                <button
                                  onClick={() =>
                                    handleDeleteNotes(lecture.meetingId)
                                  }
                                  className="p-2 bg-white rounded-lg text-red-500 hover:text-red-700 shadow-sm hover:shadow-md transition-all"
                                >
                                  <FaTrash size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          isMyLecture &&
                          tab === "past" && (
                            <div className="text-center py-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                              <p className="text-xs font-bold text-slate-400">
                                No PDF notes available
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {/* Instructor / Past Actions */}
                      {tab === "past" && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {hasRecording ? (
                            <button
                              onClick={() =>
                                window.open(lecture.recordingUrl, "_blank")
                              }
                              className="col-span-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm"
                            >
                              <FaPlayCircle /> Watch Replay
                            </button>
                          ) : isMyLecture ? (
                            <button
                              onClick={() =>
                                handleShowUploadModal(lecture, false)
                              }
                              className="col-span-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all text-sm border border-blue-100"
                            >
                              <FaUpload /> Upload Video
                            </button>
                          ) : (
                            <div className="col-span-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-100 text-slate-400 text-sm cursor-not-allowed">
                              <FaClock /> Processing...
                            </div>
                          )}

                          {isMyLecture && (
                            <>
                              {hasRecording && (
                                <button
                                  onClick={() =>
                                    handleShowUploadModal(lecture, true)
                                  }
                                  className="py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
                                >
                                  Edit Video
                                </button>
                              )}
                              <button
                                onClick={() => handleShowNotesModal(lecture)}
                                className={`py-2.5 rounded-xl font-bold text-xs transition-colors ${hasNotes ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "col-span-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
                              >
                                {hasNotes ? "Edit PDF Notes" : "+ Add PDF Notes"}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              },
            )}
          </AnimatePresence>

          {/* Empty State */}
          {lectures.length === 0 && (
            <div className="col-span-full py-24 text-center opacity-60">
              <div className="w-24 h-24 bg-slate-200/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaVideo className="text-4xl text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-700">
                No Classes Scheduled
              </h3>
              <p className="text-slate-500 font-medium mt-1">
                Looks like you're all caught up!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showUploadModal && selectedLecture && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-white/50"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-800">
                    {selectedLecture.isUpdate ? "Update Video" : "Upload Video"}
                  </h3>
                  <button
                    onClick={handleCloseModals}
                    className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="border-3 border-dashed border-blue-100 bg-blue-50/30 rounded-3xl p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer relative group">
                  <input
                    key={inputKey}
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e, "video")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  {videoFile ? (
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-green-600 shadow-sm">
                        <FaVideo size={24} />
                      </div>
                      <p className="font-bold text-slate-800 text-sm truncate px-4">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {formatFileSize(videoFile.size)}
                      </p>
                    </div>
                  ) : (
                    <div className="relative z-10 group-hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600 shadow-sm">
                        <FaUpload size={24} />
                      </div>
                      <p className="font-bold text-slate-800 text-sm">
                        Click to Browse Video
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        MP4, MOV (Max 500MB)
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUploadRecording}
                  disabled={!videoFile || uploadingId}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {uploadingId ? "Uploading..." : "Start Upload"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showNotesModal && selectedLecture && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-white/50"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-800">
                    {selectedLecture.notes ? "Update PDF Notes" : "Upload PDF Notes"}
                  </h3>
                  <button
                    onClick={handleCloseModals}
                    className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="border-3 border-dashed border-green-100 bg-green-50/30 rounded-3xl p-8 text-center hover:bg-green-50 transition-colors cursor-pointer relative group">
                  <input
                    key={inputKey}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => handleFileSelect(e, "notes")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  {notesFile ? (
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-green-600 shadow-sm">
                        <FaFileAlt size={24} />
                      </div>
                      <p className="font-bold text-slate-800 text-sm truncate px-4">
                        {notesFile.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {formatFileSize(notesFile.size)}
                      </p>
                    </div>
                  ) : (
                    <div className="relative z-10 group-hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-green-600 shadow-sm">
                        <FaUpload size={24} />
                      </div>
                      <p className="font-bold text-slate-800 text-sm">
                        Click to Browse PDF
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF files only (Max 50MB)
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUploadNotes}
                  disabled={!notesFile || uploadingId}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {uploadingId ? "Uploading..." : "Upload PDF Notes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}