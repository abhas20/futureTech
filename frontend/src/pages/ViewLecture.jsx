import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPlayCircle,
  FaTrophy,
  FaHeadphones,
  FaVideo,
  FaDownload,
  FaFilePdf,
  FaArrowLeft,
  FaEye,
  FaClock,
  FaChartLine,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import Webcam from "react-webcam";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get course data from Redux
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  // State
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lectures, setLectures] = useState([]);

  const [viewMode, setViewMode] = useState("video");
  const [analytics, setAnalytics] = useState(null);
  const [attentionScore, setAttentionScore] = useState(null);
  const [calibrating, setCalibrating] = useState(true);
  const [autoPaused, setAutoPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // Attention Logic State
  const [lowCount, setLowCount] = useState(0);
  const [highCount, setHighCount] = useState(0);
  const attentionActiveRef = useRef(false);
  const [attentionActive, setAttentionActive] = useState(false);

  // Refs
  const mediaRef = useRef(null);
  const webcamRef = useRef(null);
  const watchedSecondsRef = useRef(new Set());
  const lastSecondRef = useRef(-1);
  const viewSentRef = useRef(false);
  const isSendingFrameRef = useRef(false);

  const [downloadLoading, setDownloadLoading] = useState({
    video: false,
    audio: false,
    pdf: false,
  });

  // Fetch Data
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const courseFromRedux = courseData?.find(
          (course) => course._id === courseId,
        );

        if (courseFromRedux && typeof courseFromRedux.creator === "object") {
          setSelectedCourse(courseFromRedux);
          setLectures(courseFromRedux.lectures || []);
          setSelectedLecture(courseFromRedux.lectures?.[0] || null);
          setLoading(false);
        } else {
          const response = await axios.get(
            `${serverUrl}/api/course/getcourse/${courseId}`,
            { withCredentials: true },
          );
          setSelectedCourse(response.data);
          setLectures(response.data.lectures || []);
          setSelectedLecture(response.data.lectures?.[0] || null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch course data:", error);
        toast.error("Failed to load course");
        setLoading(false);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId, courseData]);

  // Analytics Fetch
  useEffect(() => {
    if (!selectedLecture?._id) return;
    watchedSecondsRef.current.clear();
    lastSecondRef.current = -1;
    viewSentRef.current = false;

    axios
      .get(`${serverUrl}/api/analytics/lecture/${selectedLecture._id}`, {
        withCredentials: true,
      })
      .then((res) => setAnalytics(res.data))
      .catch(() => setAnalytics(null));
  }, [selectedLecture]);

  // Frame Sending Logic
  const sendFrame = async () => {
    if (viewMode === "audio") return;
    if (!webcamRef.current || !mediaRef.current) return;
    if (!selectedLecture?._id) return;
    if (mediaRef.current.paused || mediaRef.current.ended) return;
    if (mediaRef.current.readyState < 2) return;
    if (isSendingFrameRef.current) return;

    isSendingFrameRef.current = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc || imageSrc.length < 1000) {
        clearTimeout(timeoutId);
        return;
      }

      const blob = await fetch(imageSrc).then((res) => res.blob());
      const form = new FormData();
      form.append("frame", blob, `frame-${Date.now()}.jpg`);
      form.append("lectureId", selectedLecture._id);

      const res = await axios.post(`${serverUrl}/api/attention/frame`, form, {
        withCredentials: true,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const temporal = res.data.temporal;

      if (!temporal) return;

      if (!temporal.calibrated) {
        setCalibrating(true);
        return;
      }

      setCalibrating(false);
      setAttentionScore(temporal.attention ?? null);

      if (temporal.attention !== null && temporal.attention !== undefined) {
        await axios.post(
          `${serverUrl}/api/analytics/attention`,
          {
            lectureId: selectedLecture._id,
            t: Math.floor(mediaRef.current.currentTime),
            score: temporal.attention,
          },
          { withCredentials: true },
        );

        if (temporal.state === "NOT_ATTENTIVE") {
          setLowCount((c) => c + 1);
          setHighCount(0);
        } else {
          setHighCount((c) => c + 1);
          setLowCount(0);
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Frame error:", err);
    } finally {
      isSendingFrameRef.current = false;
    }
  };

  // Time Update Handler
  const handleTimeUpdate = async () => {
    if (viewMode === "audio") return;
    if (!mediaRef.current) return;

    const currentSecond = Math.floor(mediaRef.current.currentTime);
    const duration = Math.floor(mediaRef.current.duration || 0);

    if (currentSecond === lastSecondRef.current) return;

    if (currentSecond === lastSecondRef.current + 1) {
      watchedSecondsRef.current.add(currentSecond);
      await axios.post(
        `${serverUrl}/api/analytics/watch`,
        { lectureId: selectedLecture._id, delta: 1, duration },
        { withCredentials: true },
      );

      if (
        !viewSentRef.current &&
        watchedSecondsRef.current.size >= duration * 0.5
      ) {
        viewSentRef.current = true;
        await axios.post(
          `${serverUrl}/api/analytics/view`,
          { lectureId: selectedLecture._id },
          { withCredentials: true },
        );
      }
    }
    lastSecondRef.current = currentSecond;
  };

  // XP Handler
  const handleLectureEnd = async () => {
    if (!selectedLecture?._id) return;
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/user/progress`,
        { lectureId: selectedLecture._id },
        { withCredentials: true },
      );
      if (data.success) {
        dispatch(setUserData(data.user));
        toast.success("🎯 +50 XP Earned!");
      }
    } catch (error) {
      console.error("XP Error", error);
    }
  };

  // Auto Pause Effect
  useEffect(() => {
    if (
      viewMode === "video" &&
      lowCount >= 5 &&
      mediaRef.current &&
      !mediaRef.current.paused
    ) {
      mediaRef.current.pause();
      setAutoPaused(true);
    }
  }, [lowCount, viewMode]);

  // Auto Resume Effect
  useEffect(() => {
    if (highCount >= 3 && autoPaused && !userPaused && mediaRef.current) {
      mediaRef.current.play();
      setAutoPaused(false);
    }
  }, [highCount, autoPaused, userPaused]);

  // Reset State on Lecture Change
  useEffect(() => {
    setCalibrating(true);
    setLowCount(0);
    setHighCount(0);
    setAutoPaused(false);
    setAttentionScore(null);
    setViewMode("video");
    attentionActiveRef.current = false;
    setAttentionActive(false);
  }, [selectedLecture]);

  // Interval for Frames
  useEffect(() => {
    const interval = setInterval(sendFrame, 1000);
    return () => {
      clearInterval(interval);
      isSendingFrameRef.current = false;
    };
  }, [selectedLecture, viewMode]);

  // Download Handler
  const handleDownload = async (url, type, filename) => {
    if (!url) {
      toast.error(`No ${type} available`);
      return;
    }
    setDownloadLoading((prev) => ({ ...prev, [type]: true }));
    try {
      toast.info(`Preparing ${type}...`);
      let downloadUrl = url;
      if (url.includes("cloudinary.com")) {
        const separator = url.includes("?") ? "&" : "?";
        downloadUrl = `${url}${separator}fl_attachment`;
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || `${selectedLecture?.lectureTitle}_${type}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!");
    } catch (error) {
      toast.error("Download failed");
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-medium text-gray-600">
            Loading your classroom...
          </p>
        </div>
      </div>
    );
  }

  // Graph Data Helper
  const getGraphData = () => {
    if (!analytics?.attentionTimelineAvg) return [];
    const avgMap = analytics.attentionTimelineAvg || {};
    const duration = mediaRef.current
      ? Math.floor(mediaRef.current.duration || 0)
      : Object.keys(avgMap).length;
    return Array.from({ length: duration }, (_, t) => ({
      time: t,
      attention: Math.round(avgMap[t]?.avgScore || 0),
    }));
  };
  const graphData = getGraphData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">
            {selectedCourse?.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
            <FaTrophy className="text-yellow-500" />
            <span>{userData?.xp || 0} XP</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
            {userData?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-6 gap-6">
        {/* LEFT COLUMN - Main Content */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Video/Audio Player Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Player Toolbar */}
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <div>
                <h2 className="font-bold text-lg text-gray-900">
                  {selectedLecture?.lectureTitle}
                </h2>
                <p className="text-xs text-gray-500">
                  Lecture {lectures.indexOf(selectedLecture) + 1} of{" "}
                  {lectures.length}
                </p>
              </div>

              {/* Modern View Toggle */}
              <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                <button
                  onClick={() => setViewMode("video")}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "video"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}>
                  <FaVideo className="text-xs" /> Video
                </button>
                {selectedLecture?.audioUrl && (
                  <button
                    onClick={() => setViewMode("audio")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === "audio"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    <FaHeadphones className="text-xs" /> Audio
                  </button>
                )}
              </div>
            </div>

            {/* Media Container */}
            <div className="relative aspect-video bg-black group">
              {viewMode === "video" && selectedLecture?.videoUrl ? (
                <video
                  ref={mediaRef}
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full"
                  onPlay={() => {
                    setUserPaused(false);
                    setAttentionActive(true);
                  }}
                  onPause={() => {
                    setUserPaused(true);
                    setAttentionActive(false);
                  }}
                  onEnded={handleLectureEnd}
                  onTimeUpdate={handleTimeUpdate}
                  crossOrigin="anonymous"
                />
              ) : viewMode === "audio" && selectedLecture?.audioUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-6 animate-pulse">
                    <FaHeadphones className="text-4xl text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium">Audio Mode</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Attention tracking paused
                  </p>
                  <audio
                    ref={mediaRef}
                    src={selectedLecture.audioUrl}
                    controls
                    className="w-full max-w-md"
                    onPlay={() => {
                      setUserPaused(false);
                      setAttentionActive(false);
                    }}
                    onPause={() => setUserPaused(true)}
                    onEnded={handleLectureEnd}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FaInfoCircle className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>Media not available</p>
                  </div>
                </div>
              )}

              {/* Attention Overlays */}
              <div className="absolute top-4 right-4 space-y-2 pointer-events-none">
                {viewMode === "video" && calibrating && (
                  <div className="bg-yellow-500/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm animate-pulse shadow-lg flex items-center gap-2">
                    👀 Calibrating...
                  </div>
                )}
                {autoPaused && (
                  <div className="bg-red-600/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg flex items-center gap-2">
                    ⏸️ Auto-paused (Low Attention)
                  </div>
                )}
                {attentionScore !== null &&
                  !calibrating &&
                  viewMode === "video" && (
                    <div
                      className={`text-xs px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg font-bold flex items-center gap-2 ${
                        attentionScore > 70
                          ? "bg-green-500/90 text-white"
                          : "bg-orange-500/90 text-white"
                      }`}>
                      🎯 Focus: {attentionScore}%
                    </div>
                  )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-gray-50 border-t flex flex-wrap gap-3">
              {selectedLecture?.videoUrl && (
                <button
                  onClick={() =>
                    handleDownload(selectedLecture.videoUrl, "video")
                  }
                  disabled={downloadLoading.video}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition">
                  {downloadLoading.video ? (
                    <div className="animate-spin w-3 h-3 border-2 border-gray-600 rounded-full border-t-transparent" />
                  ) : (
                    <FaVideo />
                  )}
                  Download Video
                </button>
              )}
              {selectedLecture?.audioUrl && (
                <button
                  onClick={() =>
                    handleDownload(selectedLecture.audioUrl, "audio")
                  }
                  disabled={downloadLoading.audio}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition">
                  {downloadLoading.audio ? (
                    <div className="animate-spin w-3 h-3 border-2 border-gray-600 rounded-full border-t-transparent" />
                  ) : (
                    <FaHeadphones />
                  )}
                  Download Audio
                </button>
              )}
              {selectedLecture?.notesUrl && (
                <button
                  onClick={() =>
                    handleDownload(selectedLecture.notesUrl, "pdf")
                  }
                  disabled={downloadLoading.pdf}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition">
                  {downloadLoading.pdf ? (
                    <div className="animate-spin w-3 h-3 border-2 border-gray-600 rounded-full border-t-transparent" />
                  ) : (
                    <FaFilePdf />
                  )}
                  Download Notes
                </button>
              )}
            </div>
          </div>

          {/* Analytics Dashboard */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Stat Cards */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center gap-3 mb-2 opacity-80">
                  <FaEye />{" "}
                  <span className="text-sm font-medium">Total Views</span>
                </div>
                <p className="text-3xl font-bold">
                  {analytics.totalViews || 0}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center gap-3 mb-2 opacity-80">
                  <FaClock />{" "}
                  <span className="text-sm font-medium">Watch Time (Hrs)</span>
                </div>
                <p className="text-3xl font-bold">
                  {((analytics.totalWatchTimeSec || 0) / 3600).toFixed(1)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center gap-3 mb-2 opacity-80">
                  <FaChartLine />{" "}
                  <span className="text-sm font-medium">Avg. Focus</span>
                </div>
                <p className="text-3xl font-bold">
                  {analytics.avgAttentionScore || 0}%
                </p>
              </div>

              {/* Graph */}
              {analytics.attentionTimelineAvg && graphData.length > 0 && (
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl border shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-6">
                    Attention Timeline
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                        <defs>
                          <linearGradient
                            id="colorAttention"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1">
                            <stop
                              offset="5%"
                              stopColor="#4F46E5"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#4F46E5"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E5E7EB"
                        />
                        <XAxis dataKey="time" hide />
                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                          }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="attention"
                          stroke="#4F46E5"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorAttention)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="lg:w-[400px] flex flex-col gap-6">
          {/* Instructor Info */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100">
              {selectedCourse?.creator?.photoUrl ? (
                <img
                  src={selectedCourse.creator.photoUrl}
                  alt="Instructor"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedCourse?.creator?.name?.charAt(0) || "I"}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Instructor
              </p>
              <p className="font-bold text-gray-900">
                {selectedCourse?.creator?.name || "Unknown"}
              </p>
            </div>
          </div>

          {/* Lecture List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col max-h-[calc(100vh-200px)] sticky top-24">
            <div className="p-4 border-b bg-gray-50 rounded-t-2xl">
              <h3 className="font-bold text-gray-800">Course Content</h3>
              <p className="text-xs text-gray-500 mt-1">
                {lectures.length} Lectures
              </p>
            </div>

            <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {lectures.map((lecture, index) => {
                const isActive = selectedLecture?._id === lecture._id;
                return (
                  <button
                    key={lecture._id}
                    onClick={() => setSelectedLecture(lecture)}
                    className={`w-full text-left p-3 rounded-xl transition-all group flex items-start gap-3 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}>
                    <span
                      className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium line-clamp-2 ${isActive ? "text-white" : "text-gray-900"}`}>
                        {lecture.lectureTitle}
                      </p>
                      <p
                        className={`text-xs mt-1 ${isActive ? "text-indigo-200" : "text-gray-400"}`}>
                        {lecture.videoUrl ? "Video & Audio" : "Audio Only"}
                      </p>
                    </div>
                    {isActive && (
                      <FaPlayCircle className="mt-1 text-indigo-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Webcam for Attention Tracking */}
      {viewMode === "video" && attentionActive && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="fixed bottom-6 right-6 w-48 rounded-xl shadow-2xl opacity-80 pointer-events-none border-2 border-white z-50 hidden md:block"
        />
      )}
    </div>
  );
}

export default ViewLecture;
