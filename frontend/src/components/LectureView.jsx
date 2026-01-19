import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  FaHeadphones,
  FaVideo,
  FaFilePdf,
  FaPlay,
  FaPause,
  FaExclamationTriangle,
  FaSpinner,
  FaBrain,
  FaEye,
  FaClock,
} from "react-icons/fa";
import Webcam from "react-webcam";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

/* -------------------- HELPER: Format Seconds -------------------- */
const formatTime = (seconds) => {
  if (!seconds) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

/* -------------------- HELPER: Blob Converter -------------------- */
const dataURItoBlob = (dataURI) => {
  try {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch (e) {
    return null;
  }
};

function LectureViewForUser({ lecture }) {
  const dispatch = useDispatch();

  /* -------------------- STATE -------------------- */
  const [viewMode, setViewMode] = useState("video");
  const [analytics, setAnalytics] = useState(null); // Stores: { totalViews, totalWatchTimeSec, attentionTimelineAvg }
  const [attentionScore, setAttentionScore] = useState(null);
  const [calibrating, setCalibrating] = useState(true);
  const [autoPaused, setAutoPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [attentionActive, setAttentionActive] = useState(false);

  // Auto-pause counters
  const [lowCount, setLowCount] = useState(0);
  const [highCount, setHighCount] = useState(0);

  const [downloadLoading, setDownloadLoading] = useState({
    video: false,
    audio: false,
    pdf: false,
  });

  /* -------------------- REFS -------------------- */
  const mediaRef = useRef(null);
  const webcamRef = useRef(null);
  const attentionActiveRef = useRef(false);
  const watchedSecondsRef = useRef(new Set());
  const lastSecondRef = useRef(-1);
  const isSendingFrameRef = useRef(false);
  const viewRegisteredRef = useRef(false);

  /* -------------------- 1. FETCH ANALYTICS & REGISTER VIEW -------------------- */
  useEffect(() => {
    if (!lecture?._id) return;

    // Reset local refs
    watchedSecondsRef.current.clear();
    lastSecondRef.current = -1;
    viewRegisteredRef.current = false;
    setAnalytics(null);

    // Fetch Graph Data & Stats
    axios
      .get(`${serverUrl}/api/analytics/lecture/${lecture._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        // Expected res.data: { totalViews, totalWatchTimeSec, attentionTimelineAvg }
        setAnalytics(res.data);
      })
      .catch((err) => console.error("Analytics fetch error:", err));

    // Register a View (Hit the /view route)
    axios
      .post(
        `${serverUrl}/api/analytics/view`,
        { lectureId: lecture._id },
        { withCredentials: true },
      )
      .catch((err) => console.error("View count error", err));
  }, [lecture?._id]);

  /* -------------------- 2. RESET STATE ON CHANGE -------------------- */
  useEffect(() => {
    if (!lecture?._id) return;
    setCalibrating(true);
    setLowCount(0);
    setHighCount(0);
    setAutoPaused(false);
    setAttentionScore(null);
    setViewMode("video");
    setAttentionActive(false);
    setUserPaused(false);
    attentionActiveRef.current = false;
  }, [lecture?._id]);

  /* -------------------- 3. FRAME SENDER (Updated Logic) -------------------- */
  const sendFrame = async () => {
    if (
      viewMode === "audio" ||
      !lecture?._id ||
      !webcamRef.current ||
      !mediaRef.current ||
      mediaRef.current.paused ||
      mediaRef.current.ended ||
      isSendingFrameRef.current ||
      !attentionActiveRef.current
    )
      return;

    isSendingFrameRef.current = true;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        isSendingFrameRef.current = false;
        return;
      }

      const blob = dataURItoBlob(imageSrc);
      if (!blob) {
        isSendingFrameRef.current = false;
        return;
      }

      const form = new FormData();
      // Filename "capture.jpg" is crucial for backend detection
      form.append("frame", blob, "capture.jpg");
      form.append("lectureId", lecture._id);

      const res = await axios.post(`${serverUrl}/api/attention/frame`, form, {
        withCredentials: true,
      });

      const temporal = res.data?.temporal;
      if (!temporal) return;

      if (!temporal.calibrated) {
        setCalibrating(true);
      } else {
        setCalibrating(false);
        setAttentionScore(temporal.attention ?? null);

        if (temporal.state === "NOT_ATTENTIVE") {
          setLowCount((c) => c + 1);
          setHighCount(0);
        } else {
          setHighCount((c) => c + 1);
          setLowCount(0);
        }
      }
    } catch (e) {
      console.error("Frame error", e);
    } finally {
      isSendingFrameRef.current = false;
    }
  };

  /* -------------------- INTERVAL -------------------- */
  useEffect(() => {
    if (!lecture?._id || viewMode !== "video") return;
    const interval = setInterval(sendFrame, 1000);
    return () => clearInterval(interval);
  }, [lecture?._id, viewMode]);

  /* -------------------- WATCH TIME -------------------- */
  const handleTimeUpdate = async () => {
    if (!mediaRef.current) return;
    const current = Math.floor(mediaRef.current.currentTime);

    // Only send update if second has changed
    if (current === lastSecondRef.current) return;
    lastSecondRef.current = current;

    watchedSecondsRef.current.add(current);

    // Send +1 second watch time
    await axios.post(
      `${serverUrl}/api/analytics/watch`,
      { lectureId: lecture._id, delta: 1 },
      { withCredentials: true },
    );
  };

  /* -------------------- AUTO PAUSE -------------------- */
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

  useEffect(() => {
    if (highCount >= 3 && autoPaused && !userPaused && mediaRef.current) {
      mediaRef.current.play();
      setAutoPaused(false);
    }
  }, [highCount, autoPaused, userPaused]);

  /* -------------------- LECTURE END (XP) -------------------- */
  const handleLectureEnd = async () => {
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/user/progress`,
        { lectureId: lecture._id },
        { withCredentials: true },
      );
      if (data?.success) {
        dispatch(setUserData(data.user));
        toast.success("🎯 +50 XP Earned!");
      }
    } catch {}
  };

  /* -------------------- DOWNLOADS -------------------- */
  const handleDownload = async (url, type, filename) => {
    if (!url) return toast.error(`No ${type} available`);
    setDownloadLoading((p) => ({ ...p, [type]: true }));
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloadLoading((p) => ({ ...p, [type]: false }));
    }
  };

  /* -------------------- PREPARE GRAPH DATA -------------------- */
  // Fix for graph not updating: ensure proper parsing and sorting
  const graphData = React.useMemo(() => {
    if (!analytics?.attentionTimelineAvg) return [];

    return Object.entries(analytics.attentionTimelineAvg)
      .map(([timeStr, value]) => ({
        time: parseInt(timeStr, 10), // Ensure X-axis is a number
        // handle cases where value is object {avgScore: 50} or just number 50
        attention: Math.round(value?.avgScore ?? value ?? 0),
      }))
      .sort((a, b) => a.time - b.time); // Critical: Sort by time for line chart
  }, [analytics]);

  /* -------------------- UI COMPONENTS -------------------- */
  const StatusBadge = () => {
    if (viewMode !== "video" || !attentionActive) return null;
    if (autoPaused)
      return (
        <span className="text-red-600 font-bold animate-pulse text-sm">
          ⚠️ FOCUS LOST
        </span>
      );
    if (calibrating)
      return (
        <span className="text-yellow-600 font-bold text-sm">
          ⏳ CALIBRATING...
        </span>
      );
    return (
      <span className="text-green-600 font-bold text-sm">
        🧠 FOCUS: {Math.round(attentionScore || 0)}%
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header: Title + Stats */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
              {lecture?.lectureTitle || "Untitled Lecture"}
            </h2>
            {/* STATS DISPLAY */}
            {analytics && (
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <FaEye className="text-indigo-400" />
                  {analytics.totalViews || 0} Views
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-indigo-400" />
                  {formatTime(analytics.totalWatchTimeSec || 0)} Total Watch
                  Time
                </span>
              </div>
            )}
          </div>
          <StatusBadge />
        </div>

        {/* Video Player Container */}
        <div className="relative w-full aspect-video bg-black group">
          {viewMode === "video" && lecture?.videoUrl ? (
            <>
              <video
                ref={mediaRef}
                src={lecture.videoUrl}
                controls
                className="w-full h-full"
                onPlay={() => {
                  setUserPaused(false);
                  setAttentionActive(true);
                  attentionActiveRef.current = true;
                }}
                onPause={() => {
                  setUserPaused(true);
                  setAttentionActive(false);
                  attentionActiveRef.current = false;
                }}
                onEnded={handleLectureEnd}
                onTimeUpdate={handleTimeUpdate}
              />

              {/* WEBCAM OVERLAY (Slightly Visible) */}
              {attentionActive && (
                <div
                  className="absolute bottom-4 right-4 z-20 transition-opacity duration-300"
                  style={{ width: "160px", opacity: 0.7 }}>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    height="auto"
                    className="rounded-lg border-2 border-white/50 shadow-lg"
                  />
                  <div className="text-[10px] text-white/80 text-center mt-1">
                    AI Monitor Active
                  </div>
                </div>
              )}
            </>
          ) : viewMode === "audio" && lecture?.audioUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
              <FaHeadphones size={40} className="mb-4 text-indigo-400" />
              <h3>Audio Mode</h3>
              <audio
                ref={mediaRef}
                src={lecture.audioUrl}
                controls
                className="w-3/4 mt-4"
                onEnded={handleLectureEnd}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Media not available
            </div>
          )}

          {/* Auto Pause Overlay */}
          {autoPaused && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30">
              <FaBrain size={64} className="text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Focus Lost</h3>
              <p>Look back at the screen to resume.</p>
            </div>
          )}
        </div>

        {/* Controls & Downloads */}
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("video")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "video" ? "bg-white shadow text-indigo-600" : "text-gray-500"}`}>
              Video
            </button>
            <button
              onClick={() => setViewMode("audio")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "audio" ? "bg-white shadow text-indigo-600" : "text-gray-500"}`}>
              Audio Only
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleDownload(lecture?.videoUrl, "video", "vid.mp4")
              }
              disabled={downloadLoading.video}
              className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded border">
              {downloadLoading.video ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaVideo />
              )}
            </button>
            <button
              onClick={() =>
                handleDownload(lecture?.audioUrl, "audio", "aud.mp3")
              }
              disabled={downloadLoading.audio}
              className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded border">
              {downloadLoading.audio ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaHeadphones />
              )}
            </button>
            <button
              onClick={() =>
                handleDownload(lecture?.notesUrl, "pdf", "notes.pdf")
              }
              disabled={downloadLoading.pdf}
              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded border">
              {downloadLoading.pdf ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaFilePdf />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS CHART */}
      {analytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Class Attention Timeline
          </h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="time"
                  tickFormatter={(t) => {
                    const m = Math.floor(t / 60);
                    const s = t % 60;
                    return `${m}:${s < 10 ? "0" + s : s}`;
                  }}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="attention"
                  stroke="#4F46E5"
                  fill="url(#colorAtt)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default LectureViewForUser;
