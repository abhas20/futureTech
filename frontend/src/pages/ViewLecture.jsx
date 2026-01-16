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
  FaClock
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
  CartesianGrid
} from "recharts";

function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get course data from Redux
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  // State for the selected course and lecture
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
  const [lowCount, setLowCount] = useState(0);
  const [highCount, setHighCount] = useState(0);

  const mediaRef = useRef(null);
  const webcamRef = useRef(null);
  const watchedSecondsRef = useRef(new Set());
  const lastSecondRef = useRef(-1);
  const viewSentRef = useRef(false);

  // Fetch course data on component mount
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Try to get course from Redux first
        const courseFromRedux = courseData?.find((course) => course._id === courseId);
        
        if (courseFromRedux) {
          setSelectedCourse(courseFromRedux);
          setLectures(courseFromRedux.lectures || []);
          setSelectedLecture(courseFromRedux.lectures?.[0] || null);
        } else {
          // If not in Redux, fetch from API
          const response = await axios.get(
            `${serverUrl}/api/course/getcourse/${courseId}`,
            { withCredentials: true }
          );
          setSelectedCourse(response.data);
          setLectures(response.data.lectures || []);
          setSelectedLecture(response.data.lectures?.[0] || null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
        toast.error("Failed to load course");
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, courseData]);

  // Fetch analytics when lecture changes
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

  // Send frame for attention tracking
  const sendFrame = async () => {
    if (viewMode === "audio") return;
    if (!webcamRef.current || !mediaRef.current) return;
    if (!selectedLecture?._id) return;
    if (mediaRef.current.paused || mediaRef.current.ended) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc || imageSrc.length < 1000) return;

    const blob = await fetch(imageSrc).then((res) => res.blob());
    if (!blob || blob.size === 0) return;

    const form = new FormData();
    form.append("frame", blob);
    form.append("lectureId", selectedLecture._id);

    try {
      const res = await axios.post(`${serverUrl}/api/attention/frame`, form, {
        withCredentials: true,
      });
      const temporal = res.data.temporal;

      if (!temporal) return;
      if (!temporal.calibrated) {
        setCalibrating(true);
        return;
      }
      
      setCalibrating(false);
      setAttentionScore(temporal.attention ?? null);
      
      // Send attention analytics
      await axios.post(
        `${serverUrl}/api/analytics/attention`,
        {
          lectureId: selectedLecture._id,
          t: Math.floor(mediaRef.current.currentTime),
          score: temporal.attention,
        },
        { withCredentials: true }
      );
      
      if (temporal.state === "NOT_ATTENTIVE") {
        setLowCount((c) => c + 1);
        setHighCount(0);
      } else {
        setHighCount((c) => c + 1);
        setLowCount(0);
      }
    } catch (err) {
      console.error("Frame error:", err);
    }
  };

  // Handle time updates for watch analytics
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
        {
          lectureId: selectedLecture._id,
          delta: 1,
          duration,
        },
        { withCredentials: true }
      );

      if (
        !viewSentRef.current &&
        watchedSecondsRef.current.size >= duration * 0.5
      ) {
        viewSentRef.current = true;
        await axios.post(
          `${serverUrl}/api/analytics/view`,
          { lectureId: selectedLecture._id },
          { withCredentials: true }
        );
      }
    }
    lastSecondRef.current = currentSecond;
  };

  // Handle lecture end for XP
  const handleLectureEnd = async () => {
    if (!selectedLecture?._id) return;
    
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/user/progress`,
        { lectureId: selectedLecture._id },
        { withCredentials: true }
      );
      if (data.success) {
        dispatch(setUserData(data.user));
        toast.success("🎯 +50 XP Earned!");
      }
    } catch (error) {
      console.error("XP Error", error);
    }
  };

  // Auto pause/resume based on attention
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

  // Reset attention tracking when lecture changes
  useEffect(() => {
    setCalibrating(true);
    setLowCount(0);
    setHighCount(0);
    setAutoPaused(false);
    setAttentionScore(null);
    setViewMode("video");
  }, [selectedLecture]);

  // Send frame every second
  useEffect(() => {
    const interval = setInterval(sendFrame, 1000);
    return () => clearInterval(interval);
  }, [selectedLecture, viewMode]);

  // FIXED: Download handler with PDF extension fix
  const handleDownload = (url, type, filename) => {
    if (!url) {
      toast.error(`No ${type} available for download`);
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    
    // Ensure PDF files have .pdf extension
    if (type === 'pdf' && !filename.toLowerCase().endsWith('.pdf')) {
      filename = `${filename}.pdf`;
    }
    
    link.download = filename || `${selectedLecture?.lectureTitle?.replace(/\s+/g, '_')}_${type}`;
    link.target = '_blank';
    
    // For Cloudinary PDFs, add force download parameter
    if (type === 'pdf' && url.includes('cloudinary.com')) {
      const separator = url.includes('?') ? '&' : '?';
      link.href = `${url}${separator}fl_attachment`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lecture...</p>
        </div>
      </div>
    );
  }

  // Show error if no course found
  if (!selectedCourse || !selectedLecture) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaVideo className="text-3xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lecture Not Found</h2>
          <p className="text-gray-600 mb-6">
            The requested lecture could not be found or you don't have access to it.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Prepare graph data
  const getGraphData = () => {
    if (!analytics?.attentionTimelineAvg) return [];
    
    const avgMap = analytics.attentionTimelineAvg || {};
    const duration = mediaRef.current ? 
      Math.floor(mediaRef.current.duration || 0) : 
      Object.keys(avgMap).length;
    
    return Array.from({ length: duration }, (_, t) => ({
      time: t,
      attention: Math.round(avgMap[t]?.avgScore || 0),
    }));
  };

  const graphData = getGraphData();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex flex-col lg:flex-row gap-6">
      {/* LEFT COLUMN - Player */}
      <div className="lg:w-2/3 flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h1>
                <p className="text-gray-600">{selectedLecture.lectureTitle}</p>
              </div>
            </div>
            {/* FIXED: Changed to royal blue background with white text */}
            <div className="flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-full shadow-md">
              <FaTrophy className="text-yellow-300" />
              <span className="font-bold">{userData?.xp || 0} XP</span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setViewMode("video")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                viewMode === "video"
                  ? "bg-white text-black shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaVideo /> Video
            </button>
            {selectedLecture.audioUrl && (
              <button
                onClick={() => setViewMode("audio")}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                  viewMode === "audio"
                    ? "bg-white text-black shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FaHeadphones /> Audio
              </button>
            )}
          </div>

          {/* Player */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
            {viewMode === "video" && selectedLecture.videoUrl ? (
              <video
                ref={mediaRef}
                src={selectedLecture.videoUrl}
                controls
                className="w-full h-full"
                onPlay={() => setUserPaused(false)}
                onPause={() => setUserPaused(true)}
                onEnded={handleLectureEnd}
                onTimeUpdate={handleTimeUpdate}
                crossOrigin="anonymous"
              />
            ) : viewMode === "audio" && selectedLecture.audioUrl ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="text-center text-white p-8">
                  <FaHeadphones className="text-8xl mx-auto mb-6 opacity-20" />
                  <h3 className="text-2xl font-bold mb-2">Audio Mode</h3>
                  <p className="text-gray-300 mb-6">Listening to {selectedLecture.lectureTitle}</p>
                  <audio
                    ref={mediaRef}
                    src={selectedLecture.audioUrl}
                    controls
                    className="w-full max-w-md"
                    onPlay={() => setUserPaused(false)}
                    onPause={() => setUserPaused(true)}
                    onEnded={handleLectureEnd}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <FaVideo className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-xl mb-2">Video not available</p>
                  <p className="text-gray-400">This lecture doesn't have a video uploaded yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Attention Status */}
          <div className="mb-6 space-y-2">
            {viewMode === "video" && calibrating && (
              <div className="text-yellow-600 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-center gap-2">
                <span>👀</span> Calibrating attention... please sit naturally.
              </div>
            )}

            {autoPaused && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                <span>⏸️</span> Video paused due to low attention. Focus to resume!
              </div>
            )}

            {attentionScore !== null &&
              !calibrating &&
              viewMode === "video" && (
                <div className="text-blue-700 text-sm font-semibold flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span>🎯</span> Current Attention Score: {attentionScore}%
                </div>
              )}
          </div>

          {/* Downloads Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-3">Download Materials</h3>
            <div className="flex flex-wrap gap-3">
              {selectedLecture.videoUrl && (
                <button
                  onClick={() => handleDownload(
                    selectedLecture.videoUrl, 
                    "video",
                    `${selectedLecture.lectureTitle}_video.mp4`
                  )}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaVideo /> Video <FaDownload className="ml-2" />
                </button>
              )}
              {selectedLecture.audioUrl && (
                <button
                  onClick={() => handleDownload(
                    selectedLecture.audioUrl, 
                    "audio",
                    `${selectedLecture.lectureTitle}_audio.mp3`
                  )}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <FaHeadphones /> Audio <FaDownload className="ml-2" />
                </button>
              )}
              {selectedLecture.notesUrl && (
                <button
                  onClick={() => handleDownload(
                    selectedLecture.notesUrl, 
                    "pdf",
                    `${selectedLecture.lectureTitle}_notes.pdf`
                  )}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <FaFilePdf /> Notes <FaDownload className="ml-2" />
                </button>
              )}
            </div>
          </div>

          {/* Analytics Section */}
          {analytics && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xl font-bold text-gray-800 mb-6">📊 Lecture Analytics</h3>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaEye className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Views</p>
                      <p className="text-2xl font-bold">{analytics.totalViews || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaClock className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Watch Time</p>
                      <p className="text-2xl font-bold">
                        {((analytics.totalWatchTimeSec || 0) / 3600).toFixed(1)}h
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="text-purple-600 font-bold">%</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg. Attention</p>
                      <p className="text-2xl font-bold">
                        {analytics.avgAttentionScore || 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graph Section */}
              {analytics.attentionTimelineAvg && graphData.length > 0 && (
                <div className="mt-8">
                  <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-gray-800 text-lg">
                        📈 Average Attention Timeline
                      </h4>
                      <div className="text-sm text-gray-500">
                        Duration: {graphData.length} seconds
                      </div>
                    </div>
                    
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={graphData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="time" 
                            label={{ 
                              value: "Time (seconds)", 
                              position: "insideBottom", 
                              offset: -5 
                            }}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            label={{ 
                              value: "Attention %", 
                              angle: -90, 
                              position: "insideLeft" 
                            }}
                            domain={[0, 100]}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Attention']}
                            labelFormatter={(label) => `Time: ${label}s`}
                          />
                          <Line
                            type="monotone"
                            dataKey="attention"
                            stroke="#4169E1"  // Royal blue for the line
                            strokeWidth={3}
                            dot={{ r: 1 }}
                            activeDot={{ r: 6 }}
                            name="Attention Level"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <p>This graph shows the average attention level of viewers throughout the lecture.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN - Course Content */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
          <h2 className="text-xl font-bold mb-6">Course Content</h2>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {lectures.map((lecture, index) => (
              <button
                key={lecture._id}
                onClick={() => setSelectedLecture(lecture)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedLecture?._id === lecture._id
                    ? "bg-black text-white shadow-lg"
                    : "hover:bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedLecture?._id === lecture._id
                        ? "bg-gray-700"
                        : "bg-gray-100"
                    }`}>
                      <span className={`text-sm font-medium ${
                        selectedLecture?._id === lecture._id
                          ? "text-white"
                          : "text-gray-600"
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{lecture.lectureTitle}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {lecture.videoUrl ? "Video available" : "No video"}
                      </p>
                    </div>
                  </div>
                  {selectedLecture?._id === lecture._id && (
                    <FaPlayCircle className="text-green-400" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Instructor Info */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-bold text-gray-700 mb-4">Instructor</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                {selectedCourse.creator?.photoUrl ? (
                  <img
                    src={selectedCourse.creator.photoUrl}
                    alt="Instructor"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#4169E1] flex items-center justify-center text-white font-bold">
                    {selectedCourse.creator?.name?.charAt(0) || "I"}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold">{selectedCourse.creator?.name || "Instructor"}</p>
                <p className="text-sm text-gray-600">Top Rated Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Webcam */}
      {viewMode === "video" && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="fixed bottom-4 right-4 w-32 h-24 rounded-lg opacity-50"
        />
      )}
    </div>
  );
}

export default ViewLecture;