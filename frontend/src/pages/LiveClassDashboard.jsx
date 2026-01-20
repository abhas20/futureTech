import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import {
  FaVideo,
  FaPlayCircle,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUserTie,
  FaUpload,
  FaEdit,
  FaFileAlt,
  FaTrash,
  FaDownload,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
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

  // Key to force reset file inputs
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
      // toast.error("Failed to load lectures"); // Optional: prevent spam on load
    }
  };

  // --- MODAL HANDLERS ---
  const handleCloseModals = () => {
    setShowUploadModal(false);
    setShowNotesModal(false);
    setVideoFile(null);
    setNotesFile(null);
    setSelectedLecture(null);
    setInputKey(Date.now()); // Resets the HTML file input
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

  // --- FILE HANDLING ---
  const handleFileSelect = (e, type = "video") => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "video") {
      if (file.size > 500 * 1024 * 1024) {
        // 500MB
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
      // Notes
      if (file.size > 50 * 1024 * 1024) {
        // 50MB
        toast.error("File size too large. Maximum size is 50MB.");
        return;
      }
      // Relaxed check for notes (sometimes OS sends generic types)
      setNotesFile(file);
    }
  };

  // --- API ACTIONS ---
  const handleUploadRecording = async () => {
    if (!videoFile || !selectedLecture) {
      toast.error("Please select a video file");
      return;
    }

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
        toast.success(data.message || "Recording uploaded successfully!");
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
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleUploadNotes = async () => {
    if (!notesFile || !selectedLecture) {
      toast.error("Please select a file");
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
        toast.success("Notes uploaded successfully!");
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
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDownloadNotes = (lecture) => {
    try {
      // This works because the backend sets Content-Disposition: attachment
      const downloadUrl = `${serverUrl}/api/live/download-notes/${lecture.meetingId}`;
      window.location.href = downloadUrl;
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  const handleDeleteNotes = async (meetingId) => {
    if (!window.confirm("Are you sure you want to delete the notes?")) return;

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/live/delete-notes`,
        { meetingId },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success("Notes deleted successfully!");
        setLectures((prev) =>
          prev.map((l) =>
            l.meetingId === meetingId
              ? { ...l, notes: null, hasNotes: false }
              : l,
          ),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // --- HELPERS ---
  const upcomingLectures = lectures
    .filter((l) => l.isActive === true)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // Sort Ascending

  const pastLectures = lectures
    .filter((l) => l.isActive === false)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Sort Descending

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt />;
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return <FaFileAlt className="text-red-500" />;
    if (["doc", "docx"].includes(ext))
      return <FaFileAlt className="text-blue-500" />;
    if (["ppt", "pptx"].includes(ext))
      return <FaFileAlt className="text-orange-500" />;
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      {/* --- UPLOAD RECORDING MODAL --- */}
      {showUploadModal && selectedLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedLecture.isUpdate
                  ? "Update Lecture Recording"
                  : "Upload Lecture Recording"}
              </h3>
              <button
                onClick={handleCloseModals}
                className="text-slate-500 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="font-semibold text-slate-900 line-clamp-1">
                  {selectedLecture.topic}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(selectedLecture.startTime)}
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                {videoFile ? (
                  <div className="space-y-2">
                    <FaUpload className="text-4xl text-green-600 mx-auto" />
                    <p className="font-semibold text-sm truncate">
                      {videoFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(videoFile.size)}
                    </p>
                    <button
                      onClick={() => setVideoFile(null)}
                      className="text-red-600 text-sm hover:underline">
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <FaUpload className="text-4xl text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 mb-2 text-sm">
                      Select recording (MP4, MOV, AVI)
                    </p>
                    <input
                      key={inputKey} // Forces reset
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
                      onChange={(e) => handleFileSelect(e, "video")}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg cursor-pointer hover:bg-slate-800 text-sm">
                      Choose Video
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseModals}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">
                  Cancel
                </button>
                <button
                  onClick={handleUploadRecording}
                  disabled={
                    !videoFile || uploadingId === selectedLecture.meetingId
                  }
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {uploadingId === selectedLecture.meetingId ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    <FaUpload />
                  )}
                  {selectedLecture.isUpdate ? "Update" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- UPLOAD NOTES MODAL --- */}
      {showNotesModal && selectedLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedLecture.notes ? "Update Notes" : "Upload Notes"}
              </h3>
              <button
                onClick={handleCloseModals}
                className="text-slate-500 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Existing Notes Preview */}
              {selectedLecture.notes && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(selectedLecture.notes.name)}
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm truncate max-w-[150px]">
                        {selectedLecture.notes.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(selectedLecture.notes.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                {notesFile ? (
                  <div className="space-y-2">
                    <FaFileAlt className="text-4xl text-green-600 mx-auto" />
                    <p className="font-semibold text-sm truncate">
                      {notesFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(notesFile.size)}
                    </p>
                    <button
                      onClick={() => setNotesFile(null)}
                      className="text-red-600 text-sm hover:underline">
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <FaFileAlt className="text-4xl text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 mb-2 text-sm">
                      Select PDF, DOC, PPT, Images
                    </p>
                    <input
                      key={inputKey} // Forces reset
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(e, "notes")}
                      className="hidden"
                      id="notes-upload"
                    />
                    <label
                      htmlFor="notes-upload"
                      className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg cursor-pointer hover:bg-slate-800 text-sm">
                      Choose File
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseModals}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200">
                  Cancel
                </button>
                <button
                  onClick={handleUploadNotes}
                  disabled={
                    !notesFile || uploadingId === selectedLecture.meetingId
                  }
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {uploadingId === selectedLecture.meetingId ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    <FaUpload />
                  )}
                  {selectedLecture.notes ? "Update" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Live Class Schedule
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Manage and start your scheduled sessions.
            </p>
          </div>
          <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${tab === "upcoming" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
              Live & Upcoming
            </button>
            <button
              onClick={() => setTab("past")}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${tab === "past" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
              Past Recordings
            </button>
          </div>
        </div>

        {/* LECTURE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(tab === "upcoming" ? upcomingLectures : pastLectures).map(
            (lecture) => {
              const isMyLecture = lecture.isInstructor;
              const hasRecording = lecture.recordingUrl;
              const hasNotes = lecture.notes && lecture.notes.url;

              return (
                <motion.div
                  key={lecture._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group bg-white rounded-3xl overflow-hidden transition-all duration-300 h-full flex flex-col ${isMyLecture ? "border-2 border-blue-500 shadow-xl shadow-blue-100" : "border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1"}`}>
                  {/* Thumbnail */}
                  <div className="h-48 bg-slate-900 relative overflow-hidden">
                    <img
                      src={
                        lecture.courseId?.thumbnail ||
                        "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=200&fit=crop"
                      }
                      alt=""
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <FaUserTie className="text-blue-600" />
                      {lecture.instructorId?.name || "Instructor"}
                    </div>
                    {isMyLecture && (
                      <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-lg">
                        MY CLASS
                      </div>
                    )}
                    {tab === "upcoming" && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <button
                          onClick={() => navigate(`/live/${lecture.meetingId}`)}
                          className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl transform scale-95 group-hover:scale-100 transition-all ${isMyLecture ? "bg-red-600 text-white" : "bg-white text-slate-900"}`}>
                          <FaVideo />{" "}
                          {isMyLecture ? "Start Live Class" : "Join Class"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                        {lecture.courseId?.title || "Course"}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 mt-2">
                        {lecture.topic}
                      </h3>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <FaCalendarAlt className="text-blue-400" />{" "}
                        {formatDate(lecture.startTime)}
                      </div>
                    </div>

                    {/* Notes Card */}
                    <div className="mt-4">
                      {hasNotes ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getFileIcon(lecture.notes.name)}
                              <span className="font-semibold text-green-800 text-sm">
                                Notes Available
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* FIX IS HERE: Arrow Function */}
                              <button
                                onClick={() => handleDownloadNotes(lecture)}
                                className="text-green-700 hover:text-green-900 p-1">
                                <FaDownload />
                              </button>
                              {isMyLecture && (
                                <button
                                  onClick={() =>
                                    handleDeleteNotes(lecture.meetingId)
                                  }
                                  className="text-red-600 hover:text-red-800 p-1">
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        isMyLecture &&
                        tab === "past" && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 text-center">
                            <p className="text-slate-400 text-xs">
                              No notes uploaded
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {/* Footer Actions */}
                    {tab === "past" && (
                      <div className="space-y-3 mt-auto">
                        {/* Recording Buttons */}
                        <div className="flex gap-2">
                          {hasRecording ? (
                            <>
                              <button
                                onClick={() =>
                                  window.open(lecture.recordingUrl, "_blank")
                                }
                                className="flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 text-sm">
                                <FaPlayCircle /> Watch
                              </button>
                              {isMyLecture && (
                                <button
                                  onClick={() =>
                                    handleShowUploadModal(lecture, true)
                                  }
                                  className="px-3 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200">
                                  <FaEdit />
                                </button>
                              )}
                            </>
                          ) : isMyLecture ? (
                            <button
                              onClick={() =>
                                handleShowUploadModal(lecture, false)
                              }
                              className="w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm">
                              <FaUpload /> Upload Video
                            </button>
                          ) : (
                            <div className="w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 bg-slate-100 text-slate-400 text-sm">
                              <FaClock /> No Recording
                            </div>
                          )}
                        </div>

                        {/* Instructor Note Actions */}
                        {isMyLecture && (
                          <button
                            onClick={() => handleShowNotesModal(lecture)}
                            className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 text-sm ${hasNotes ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                            {hasNotes ? (
                              <>
                                <FaEdit /> Update Notes
                              </>
                            ) : (
                              <>
                                <FaFileAlt /> Upload Notes
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
