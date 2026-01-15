import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlayCircle, FaTrophy } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import Webcam from "react-webcam";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";

function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const selectedCourse = courseData?.find(
    (course) => course._id === courseId
  );

  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );

  const courseCreator =
    userData?._id === selectedCourse?.creator ? userData : null;

  /* ================= REFS ================= */

  const videoRef = useRef(null);
  const webcamRef = useRef(null);

  /* ================= ATTENTION STATE ================= */

  const [lowCount, setLowCount] = useState(0);
  const [highCount, setHighCount] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);
  const [calibrating, setCalibrating] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [attentionScore, setAttentionScore] = useState(null);

  /* ================= SEND FRAME ================= */

  const sendFrame = async () => {
    if (!webcamRef.current || !videoRef.current) return;
    if (!selectedLecture?._id) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc || imageSrc.length < 1000) return;

    const blob = await fetch(imageSrc).then((res) => res.blob());
    if (!blob || blob.size === 0) return;

    const form = new FormData();
    form.append("frame", blob);
    form.append("lectureId", selectedLecture._id);

    try {
      const res = await axios.post(
        `${serverUrl}/api/attention/frame`,
        form,
        { withCredentials: true }
      );

      const temporal = res.data.temporal;
      if (!temporal) return;

      if (!temporal.calibrated) {
        setCalibrating(true);
        return;
      }

      setCalibrating(false);
      setAttentionScore(temporal.attention ?? null);

      if (temporal.state === "NOT_ATTENTIVE") {
        setLowCount((c) => c + 1);
        setHighCount(0);
      } else {
        setHighCount((c) => c + 1);
        setLowCount(0);
      }
    } catch (err) {
      console.error("Attention error:", err.response?.data || err.message);
    }
  };

  /* ================= AUTO PAUSE / RESUME ================= */

  useEffect(() => {
    const interval = setInterval(sendFrame, 1000);
    return () => clearInterval(interval);
  }, [selectedLecture]);

  useEffect(() => {
    if (lowCount >= 5 && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setAutoPaused(true);
    }
  }, [lowCount]);

  useEffect(() => {
    if (highCount >= 3 && autoPaused && !userPaused && videoRef.current) {
      videoRef.current.play();
      setAutoPaused(false);
    }
  }, [highCount, autoPaused, userPaused]);

  useEffect(() => {
    setCalibrating(true);
    setLowCount(0);
    setHighCount(0);
    setAutoPaused(false);
    setAttentionScore(null);
  }, [selectedLecture]);

  /* ================= XP HANDLER ================= */

  const handleLectureEnd = async () => {
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

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      {/* LEFT */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-4">
            <FaArrowLeftLong
              className="cursor-pointer"
              onClick={() => navigate("/")}
            />
            {selectedCourse?.title}
          </h1>

          <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl">
            <FaTrophy />
            <span className="font-bold">{userData?.xp || 0} XP</span>
          </div>
        </div>

        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          {selectedLecture?.videoUrl ? (
            <video
              ref={videoRef}
              key={selectedLecture._id}
              src={selectedLecture.videoUrl}
              controls
              onPause={() => setUserPaused(true)}
              onPlay={() => setUserPaused(false)}
              onEnded={handleLectureEnd}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="text-white flex items-center justify-center h-full">
              Select a lecture to start watching
            </div>
          )}
        </div>

        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="w-32 h-24 fixed bottom-4 right-4 z-50 opacity-20 rounded"
        />

        {calibrating && (
          <div className="mt-2 text-yellow-600 text-sm">
            Calibrating attention… please sit naturally 👀
          </div>
        )}

        {autoPaused && (
          <div className="mt-2 text-red-600 text-sm">
            Video paused due to low attention. Please focus to resume ▶
          </div>
        )}

        {attentionScore !== null && !calibrating && (
          <div className="mt-2 text-sm font-semibold text-blue-700">
            🎯 Attention Score: {attentionScore}%
          </div>
        )}

        <h2 className="mt-3 text-lg font-semibold">
          {selectedLecture?.lectureTitle}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border">
        <h2 className="text-xl font-bold mb-4">All Lectures</h2>

        <div className="flex flex-col gap-3">
          {selectedCourse?.lectures?.map((lecture, index) => (
            <button
              key={index}
              onClick={() => setSelectedLecture(lecture)}
              className={`flex justify-between items-center p-3 rounded-lg border ${
                selectedLecture?._id === lecture._id
                  ? "bg-gray-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="text-sm font-medium">
                {lecture.lectureTitle}
              </span>
              <FaPlayCircle />
            </button>
          ))}
        </div>

        {courseCreator && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Instructor</h3>
            <div className="flex gap-3 items-center">
              <img
                src={courseCreator.photoUrl || "/default-avatar.png"}
                alt="Instructor"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{courseCreator.name}</p>
                <p className="text-sm text-gray-600">
                  {courseCreator.description || "No bio available"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLecture;