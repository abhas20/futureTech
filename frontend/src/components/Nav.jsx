import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import { FaVideo } from "react-icons/fa";

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className="fixed top-0 w-full h-[72px] z-50 px-6 flex items-center justify-between
        bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="logo"
            className="w-[46px] h-[46px] rounded-xl object-cover border border-white/40"
          />
          <span className="hidden sm:block font-semibold text-white tracking-wide">
            EduPlatform
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-5">
          
          {/* === NEW: LIVE CLASSES BUTTON (Desktop) === */}
          {userData && (
            <button
              onClick={() => navigate('/live-schedule')}
              className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition mr-2"
            >
              <FaVideo className="text-red-400" /> Live Classes
            </button>
          )}
          {/* ========================================== */}

          {/* Profile */}
          <div className="relative">
            {!userData ? (
              <IoMdPerson
                className="w-11 h-11 text-white bg-gradient-to-br from-indigo-500 to-violet-600
                rounded-full p-2 cursor-pointer shadow-md"
                onClick={() => setShowPro((p) => !p)}
              />
            ) : (
              <div
                onClick={() => setShowPro((p) => !p)}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
                text-white flex items-center justify-center cursor-pointer shadow-md overflow-hidden">
                {userData.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-semibold">
                    {userData.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            )}

            {/* Profile Dropdown */}
            {showPro && (
              <div
                className="absolute right-0 mt-4 w-48 rounded-xl bg-white/80 backdrop-blur-xl
                shadow-xl border border-white/30 p-2 space-y-1">
                <DropdownItem
                  label="My Profile"
                  onClick={() => navigate("/profile")}
                />
                <DropdownItem
                  label="My Courses"
                  onClick={() => navigate("/enrolledcourses")}
                />
                {userData?.role === "student" && (
                  <DropdownItem
                    label="Career Guidance"
                    onClick={() => navigate("/career")}
                  />
                )}
              </div>
            )}
          </div>

          {userData?.role === "educator" && (
            <GradientButton
              text="Dashboard"
              onClick={() => navigate("/dashboard")}
            />
          )}
          {userData?.role === "student" && (
            <GradientButton
              text="Dashboard"
              onClick={() => navigate("/studentdashboard")}
            />
          )}

          {!userData ? (
            <GradientButton text="Login" onClick={() => navigate("/login")} />
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-red-500/80 hover:bg-red-600
              text-white shadow-md transition">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <GiHamburgerMenu
          className="lg:hidden w-8 h-8 text-white cursor-pointer"
          onClick={() => setShowHam(true)}
        />
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-transform duration-300
        ${showHam ? "translate-x-0" : "-translate-x-full"}`}>
        <GiSplitCross
          className="absolute top-6 right-6 w-9 h-9 text-white cursor-pointer"
          onClick={() => setShowHam(false)}
        />

        <div className="h-full flex flex-col items-center justify-center gap-6">
          
          {/* === NEW: LIVE CLASSES BUTTON (Mobile) === */}
          {userData && (
            <MobileItem 
              text="🔴 Live Classes" 
              onClick={() => navigate("/live-schedule")} 
            />
          )}
          {/* ========================================= */}

          <MobileItem text="My Profile" onClick={() => navigate("/profile")} />
          <MobileItem
            text="My Courses"
            onClick={() => navigate("/enrolledcourses")}
          />

          {userData?.role === "student" && (
            <MobileItem
              text="Career Guidance"
              onClick={() => navigate("/career")}
            />
          )}

          {userData?.role === "educator" && (
            <MobileItem
              text="Dashboard"
              onClick={() => navigate("/dashboard")}
            />
          )}
          {userData?.role === "student" && (
            <MobileItem
            text="Dashboard"
            onClick={()=>navigate("/studentdashboard")}
            />
          )}

          {!userData ? (
            <MobileItem text="Login" onClick={() => navigate("/login")} />
          ) : (
            <MobileItem text="Logout" onClick={handleLogout} danger />
          )}
        </div>
      </div>
    </>
  );
}

/* ================= REUSABLE UI ================= */

const DropdownItem = ({ label, onClick }) => (
  <div
    onClick={onClick}
    className="px-4 py-2 rounded-lg text-gray-800 hover:bg-indigo-500/20
    cursor-pointer transition text-sm">
    {label}
  </div>
);

const GradientButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600
    text-white shadow-md hover:opacity-90 transition">
    {text}
  </button>
);

const MobileItem = ({ text, onClick, danger }) => (
  <div
    onClick={onClick}
    className={`w-[80%] text-center py-4 rounded-xl text-lg cursor-pointer
    ${
      danger
        ? "bg-red-500/80 text-white"
        : "bg-white/10 text-white hover:bg-white/20"
    } backdrop-blur-md border border-white/20 transition`}>
    {text}
  </div>
);

export default Nav;