import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { FaCrown, FaMedal, FaTrophy, FaFire } from "react-icons/fa";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/user/leaderboard`);
        setUsers(data || []);
      } catch (error) {
        console.error("Leaderboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userData?.xp]);

  const sortedUsers = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  const getRankIcon = (index) => {
    if (index === 0)
      return <FaCrown className="text-yellow-400 text-3xl drop-shadow-md" />;
    if (index === 1) return <FaMedal className="text-slate-400 text-2xl" />;
    if (index === 2) return <FaMedal className="text-amber-600 text-2xl" />;
    return <span className="font-bold text-slate-400">#{index + 1}</span>;
  };

  const getBadgeStyle = (rank) => {
    switch (rank) {
      case "Terminator":
        return "bg-gradient-to-r from-red-600 to-orange-600 text-white";
      case "Master":
        return "bg-gradient-to-r from-purple-600 to-indigo-600 text-white";
      case "Expert":
        return "bg-gradient-to-r from-blue-600 to-cyan-600 text-white";
      case "Apprentice":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
      default:
        return "bg-gradient-to-r from-slate-400 to-slate-600 text-white";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-blue-50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-8 text-white relative">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <FaTrophy className="text-4xl text-yellow-400 animate-pulse" />
              <h2 className="text-3xl font-extrabold">Global Leaderboard</h2>
            </div>
            <p className="text-blue-100">
              Are you ready to become the next TLE Terminator?
            </p>
          </div>
          <FaFire className="absolute right-8 top-8 text-8xl text-white/10 rotate-12" />
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 italic">Fetching Rankings...</p>
            </div>
          ) : (
            sortedUsers.map((user, index) => (
              <div
                key={user._id}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.02]
                ${
                  user._id === userData?._id
                    ? "bg-blue-50 border border-blue-400 shadow-md"
                    : "bg-slate-50 border border-slate-100"
                }`}>
                <div className="flex items-center gap-5">
                  <div className="w-10 flex justify-center">
                    {getRankIcon(index)}
                  </div>

                  <img
                    src={user.photoUrl || "https://via.placeholder.com/150"}
                    alt={user.name || "Leaderboard User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />

                  <div>
                    <h3 className="font-bold text-slate-700">
                      {user.name} {user._id === userData?._id && "(You)"}
                    </h3>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${getBadgeStyle(user.rank)}`}>
                      {user.rank}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-blue-600">
                    {user.xp || 0}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    XP
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
