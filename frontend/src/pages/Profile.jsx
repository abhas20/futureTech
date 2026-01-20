
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaMedal,
  FaUserGraduate,
  FaBolt,
  FaPen,
  FaCrown,
} from "react-icons/fa";
import { motion } from "framer-motion";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const rankColors = {
    Novice: "bg-slate-100 text-slate-600 border-slate-200",
    Apprentice: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Expert: "bg-blue-50 text-blue-700 border-blue-200",
    Master: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Terminator: "bg-slate-900 text-amber-400 border-amber-500/50", // Special Royal Theme
    MAXED:
      "bg-gradient-to-r from-amber-300 to-yellow-500 text-slate-900 border-yellow-400",
    Unranked: "bg-slate-50 text-slate-400 border-slate-100",
  };

  const renderSocialIcon = (platform, url) => {
    if (!url) return null;

    const icons = {
      github: <FaGithub />,
      linkedin: <FaLinkedin />,
      twitter: <FaTwitter />,
      personalWebsite: <FaGlobe />,
    };

    return (
      <motion.a
        key={platform}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.15, y: -2, color: "#2563eb" }}
        className="text-xl text-slate-400 transition-all p-3 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg border border-slate-100"
      >
        {icons[platform]}
      </motion.a>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 md:py-12 flex items-center justify-center font-sans relative overflow-hidden">
      {/* --- Background Decor --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-5xl w-full rounded-[3rem] bg-white/80 backdrop-blur-2xl shadow-[0_30px_60px_-10px_rgba(30,41,59,0.08)] border border-white overflow-hidden"
      >
        {/* --- Header Gradient --- */}
        <div className="h-48 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 relative overflow-hidden">
          {/* Decorative Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

          {/* FIXED: Z-Index 50 ensures button is clickable over patterns */}
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-6 left-6 z-50 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all shadow-xl"
            onClick={() => navigate("/")} // Redirects to Dashboard
          >
            <FaArrowLeft />
          </motion.button>
        </div>

        {/* --- Profile Body --- */}
        <div className="px-8 md:px-12 pb-12">
          {/* Identity Section (Avatar overlaps header) */}
          <div className="relative -mt-24 flex flex-col md:flex-row items-end md:items-center gap-8 mb-12 border-b border-slate-100 pb-8">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-600 rounded-[2.5rem] blur-lg opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
              {userData?.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt="Profile"
                  className="relative w-44 h-44 rounded-[2.5rem] object-cover border-[6px] border-white shadow-2xl"
                />
              ) : (
                <div className="relative w-44 h-44 rounded-[2.5rem] flex items-center justify-center text-6xl font-black text-white bg-gradient-to-br from-blue-600 to-slate-900 border-[6px] border-white shadow-2xl">
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}

              {/* Rank Badge */}
              <div
                className={`absolute -bottom-3 -right-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border-4 border-white ${rankColors[userData?.rank || "Unranked"]}`}
              >
                {userData?.rank || "Rookie"}
              </div>
            </div>

            {/* Name & Title */}
            <div className="flex-1 text-center md:text-left pt-4 md:pt-24 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    {userData?.name}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-sm font-bold text-slate-500">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 uppercase tracking-wider text-[10px]">
                      {userData?.role || "Student"}
                    </span>
                    <span>{userData?.email}</span>
                  </div>
                </div>

                {/* Desktop Edit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/editprofile")}
                  className="hidden md:flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl hover:shadow-2xl transition-all"
                >
                  <FaPen size={12} className="text-amber-400" /> Edit Profile
                </motion.button>
              </div>

              {/* Social Icons Row */}
              <div className="flex justify-center md:justify-start gap-3 mt-6">
                {userData?.socialLinks &&
                  Object.entries(userData.socialLinks).map(([platform, url]) =>
                    renderSocialIcon(platform, url),
                  )}
              </div>
            </div>
          </div>

          {/* --- Grid Layout --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Bio & Stats */}
            <div className="space-y-8 lg:col-span-1">
              {/* Bio Card */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                  <FaUserGraduate className="text-blue-500" /> About Me
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm font-medium">
                  {userData?.description ||
                    "No biography provided yet. Add a bio to let others know who you are!"}
                </p>
              </div>

              {/* Stats Card (Royal Style) */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl -mr-6 -mt-6"></div>

                <div className="flex justify-between items-center relative z-10">
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">
                      {userData?.enrolledCourses?.length || 0}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                      Enrolled
                    </p>
                  </div>
                  <div className="h-10 w-[1px] bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-amber-400 flex items-center gap-1 justify-center">
                      {userData?.xp || 0} <FaBolt size={14} />
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                      Total XP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Tags & Attributes */}
            <div className="lg:col-span-2 space-y-8">
              {/* Skills */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                  <FaCrown className="text-amber-500" /> Professional Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {userData?.skills?.length > 0 ? (
                    userData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-slate-100 text-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic font-medium">
                      No skills listed.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Interests */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userData?.interests?.length > 0 ? (
                      userData.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        None listed.
                      </p>
                    )}
                  </div>
                </div>

                {/* Preferred Fields */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Preferred Fields
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userData?.preferredFields?.length > 0 ? (
                      userData.preferredFields.map((field, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-100"
                        >
                          {field}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        None listed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Edit Button */}
          <div className="md:hidden mt-10">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/editprofile")}
              className="w-full py-4 rounded-2xl font-black text-white bg-slate-900 shadow-xl flex items-center justify-center gap-2"
            >
              <FaPen size={12} className="text-amber-400" /> Edit Profile
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;