import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeftLong,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa6";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const rankColors = {
    Novice: "bg-slate-100 text-slate-700",
    Apprentice: "bg-emerald-100 text-emerald-800",
    Expert: "bg-blue-100 text-blue-800",
    Master: "bg-indigo-100 text-indigo-800",
    Terminator: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
    MAXED: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black",
    Unranked: "bg-slate-200 text-slate-700",
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
      <a
        key={platform}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl text-slate-500 hover:text-blue-600 transition-colors">
        {icons[platform]}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 py-12 flex items-center justify-center">
      <div className="relative max-w-3xl w-full rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-blue-100 overflow-hidden">
        {/* Header Gradient */}
        <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-800 relative">
          <FaArrowLeftLong
            className="absolute top-6 left-6 w-6 h-6 text-white/80 hover:text-white cursor-pointer transition"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-10 mt-16">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black text-white bg-gradient-to-br from-blue-600 to-indigo-800 border-4 border-white shadow-xl">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}

            <h2 className="text-3xl font-extrabold text-slate-900 mt-4">
              {userData?.name}
            </h2>

            <div className="flex gap-3 mt-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full bg-blue-100 text-blue-700">
                {userData?.role}
              </span>
              <span
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${
                  rankColors[userData?.rank || "Unranked"]
                }`}>
                {userData?.rank || "Unranked"}
              </span>
            </div>

            {/* Socials */}
            <div className="flex gap-6 mt-5">
              {userData?.socialLinks &&
                Object.entries(userData.socialLinks).map(([platform, url]) =>
                  renderSocialIcon(platform, url),
                )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Email
                </h4>
                <p className="text-slate-700 font-medium">{userData?.email}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Bio
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {userData?.description || "No bio added yet."}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-8">
              {/* Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {userData?.skills?.length > 0 ? (
                    userData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">None listed</p>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {userData?.interests?.length > 0 ? (
                    userData.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">None listed</p>
                  )}
                </div>
              </div>

              {/* Preferred Fields */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Preferred Fields
                </h4>
                <div className="flex flex-wrap gap-2">
                  {userData?.preferredFields?.length > 0 ? (
                    userData.preferredFields.map((field, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                        {field}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">None listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-10">
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">
                  {userData?.enrolledCourses?.length || 0}
                </p>
                <p className="text-xs uppercase font-bold text-slate-400">
                  Courses
                </p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-black text-blue-600">
                  {userData?.xp || 0}
                </p>
                <p className="text-xs uppercase font-bold text-slate-400">XP</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/editprofile")}
              className="px-10 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
