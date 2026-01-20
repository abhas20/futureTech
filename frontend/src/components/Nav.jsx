// // import React, { useState } from "react";
// // import logo from "../assets/logo.jpg";
// // import { IoMdPerson } from "react-icons/io";
// // import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import { useDispatch, useSelector } from "react-redux";
// // import { setUserData } from "../redux/userSlice";
// // import { serverUrl } from "../App";
// // import { FaVideo } from "react-icons/fa";

// // function Nav() {
// //   const [showHam, setShowHam] = useState(false);
// //   const [showPro, setShowPro] = useState(false);

// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const { userData } = useSelector((state) => state.user);

// //   const handleLogout = async () => {
// //     try {
// //       await axios.get(`${serverUrl}/api/auth/logout`, {
// //         withCredentials: true,
// //       });
// //       dispatch(setUserData(null));
// //       toast.success("Logged out successfully");
// //       navigate("/");
// //     } catch (err) {
// //       toast.error("Logout failed");
// //     }
// //   };

// //   /* -------------------- UI -------------------- */
// //   return (
// //     <>
// //       {/* ================= NAVBAR ================= */}
// //       <nav
// //         className="fixed top-0 w-full h-[72px] z-50 px-6 flex items-center justify-between
// //         bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
// //         {/* Logo */}
// //         <div
// //           className="flex items-center gap-3 cursor-pointer"
// //           onClick={() => navigate("/")}>
// //           <img
// //             src={logo}
// //             alt="logo"
// //             className="w-[46px] h-[46px] rounded-xl object-cover border border-white/40"
// //           />
// //           <span className="hidden sm:block font-semibold text-white tracking-wide">
// //             EduPlatform
// //           </span>
// //         </div>

// //         {/* Desktop Menu */}
// //         <div className="hidden lg:flex items-center gap-5">

// //           {/* === NEW: LIVE CLASSES BUTTON (Desktop) === */}
// //           {userData && (
// //             <button
// //               onClick={() => navigate('/live-schedule')}
// //               className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition mr-2"
// //             >
// //               <FaVideo className="text-red-400" /> Live Classes
// //             </button>
// //           )}
// //           {/* ========================================== */}

// //           {/* Profile */}
// //           <div className="relative">
// //             {!userData ? (
// //               <IoMdPerson
// //                 className="w-11 h-11 text-white bg-gradient-to-br from-indigo-500 to-violet-600
// //                 rounded-full p-2 cursor-pointer shadow-md"
// //                 onClick={() => setShowPro((p) => !p)}
// //               />
// //             ) : (
// //               <div
// //                 onClick={() => setShowPro((p) => !p)}
// //                 className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
// //                 text-white flex items-center justify-center cursor-pointer shadow-md overflow-hidden">
// //                 {userData.photoUrl ? (
// //                   <img
// //                     src={userData.photoUrl}
// //                     alt=""
// //                     className="w-full h-full object-cover"
// //                   />
// //                 ) : (
// //                   <span className="font-semibold">
// //                     {userData.name?.charAt(0).toUpperCase()}
// //                   </span>
// //                 )}
// //               </div>
// //             )}

// //             {/* Profile Dropdown */}
// //             {showPro && (
// //               <div
// //                 className="absolute right-0 mt-4 w-48 rounded-xl bg-white/80 backdrop-blur-xl
// //                 shadow-xl border border-white/30 p-2 space-y-1">
// //                 <DropdownItem
// //                   label="My Profile"
// //                   onClick={() => navigate("/profile")}
// //                 />
// //                 <DropdownItem
// //                   label="My Courses"
// //                   onClick={() => navigate("/enrolledcourses")}
// //                 />
// //                 {userData?.role === "student" && (
// //                   <DropdownItem
// //                     label="Career Guidance"
// //                     onClick={() => navigate("/career")}
// //                   />
// //                 )}
// //               </div>
// //             )}
// //           </div>

// //           {userData?.role === "educator" && (
// //             <GradientButton
// //               text="Dashboard"
// //               onClick={() => navigate("/dashboard")}
// //             />
// //           )}
// //           {userData?.role === "student" && (
// //             <GradientButton
// //               text="Dashboard"
// //               onClick={() => navigate("/studentdashboard")}
// //             />
// //           )}

// //           {!userData ? (
// //             <GradientButton text="Login" onClick={() => navigate("/login")} />
// //           ) : (
// //             <button
// //               onClick={handleLogout}
// //               className="px-5 py-2 rounded-xl bg-red-500/80 hover:bg-red-600
// //               text-white shadow-md transition">
// //               Logout
// //             </button>
// //           )}
// //         </div>

// //         {/* Mobile Menu Icon */}
// //         <GiHamburgerMenu
// //           className="lg:hidden w-8 h-8 text-white cursor-pointer"
// //           onClick={() => setShowHam(true)}
// //         />
// //       </nav>

// //       {/* ================= MOBILE DRAWER ================= */}
// //       <div
// //         className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-transform duration-300
// //         ${showHam ? "translate-x-0" : "-translate-x-full"}`}>
// //         <GiSplitCross
// //           className="absolute top-6 right-6 w-9 h-9 text-white cursor-pointer"
// //           onClick={() => setShowHam(false)}
// //         />

// //         <div className="h-full flex flex-col items-center justify-center gap-6">

// //           {/* === NEW: LIVE CLASSES BUTTON (Mobile) === */}
// //           {userData && (
// //             <MobileItem
// //               text="🔴 Live Classes"
// //               onClick={() => navigate("/live-schedule")}
// //             />
// //           )}
// //           {/* ========================================= */}

// //           <MobileItem text="My Profile" onClick={() => navigate("/profile")} />
// //           <MobileItem
// //             text="My Courses"
// //             onClick={() => navigate("/enrolledcourses")}
// //           />

// //           {userData?.role === "student" && (
// //             <MobileItem
// //               text="Career Guidance"
// //               onClick={() => navigate("/career")}
// //             />
// //           )}

// //           {userData?.role === "educator" && (
// //             <MobileItem
// //               text="Dashboard"
// //               onClick={() => navigate("/dashboard")}
// //             />
// //           )}
// //           {userData?.role === "student" && (
// //             <MobileItem
// //             text="Dashboard"
// //             onClick={()=>navigate("/studentdashboard")}
// //             />
// //           )}

// //           {!userData ? (
// //             <MobileItem text="Login" onClick={() => navigate("/login")} />
// //           ) : (
// //             <MobileItem text="Logout" onClick={handleLogout} danger />
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // /* ================= REUSABLE UI ================= */

// // const DropdownItem = ({ label, onClick }) => (
// //   <div
// //     onClick={onClick}
// //     className="px-4 py-2 rounded-lg text-gray-800 hover:bg-indigo-500/20
// //     cursor-pointer transition text-sm">
// //     {label}
// //   </div>
// // );

// // const GradientButton = ({ text, onClick }) => (
// //   <button
// //     onClick={onClick}
// //     className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600
// //     text-white shadow-md hover:opacity-90 transition">
// //     {text}
// //   </button>
// // );

// // const MobileItem = ({ text, onClick, danger }) => (
// //   <div
// //     onClick={onClick}
// //     className={`w-[80%] text-center py-4 rounded-xl text-lg cursor-pointer
// //     ${
// //       danger
// //         ? "bg-red-500/80 text-white"
// //         : "bg-white/10 text-white hover:bg-white/20"
// //     } backdrop-blur-md border border-white/20 transition`}>
// //     {text}
// //   </div>
// // );

// // export default Nav;

// import React, { useState } from "react";
// import logo from "../assets/logo.jpg";
// import { IoMdPerson } from "react-icons/io";
// import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { setUserData } from "../redux/userSlice";
// import { serverUrl } from "../App";
// import { FaVideo, FaCrown, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// function Nav() {
//   const [showHam, setShowHam] = useState(false);
//   const [showPro, setShowPro] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.user);

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, {
//         withCredentials: true,
//       });
//       dispatch(setUserData(null));
//       toast.success("Logged out successfully");
//       navigate("/");
//     } catch (err) {
//       toast.error("Logout failed");
//     }
//   };

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <motion.nav
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="fixed top-0 w-full h-[80px] z-50 px-6 lg:px-12 flex items-center justify-between
//         bg-[#0f172a] border-b border-white/10 shadow-2xl"
//       >
//         {/* Logo Section */}
//         <div
//           className="flex items-center gap-4 cursor-pointer group"
//           onClick={() => navigate("/")}
//         >
//           <div className="relative">
//             <div className="absolute inset-0 bg-amber-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
//             <img
//               src={logo}
//               alt="logo"
//               className="relative w-12 h-12 rounded-xl object-cover border-2 border-white/10"
//             />
//           </div>
//           <div className="hidden sm:flex flex-col">
//             <span className="font-black text-white tracking-wide text-lg leading-tight">
//               TLE <span className="text-amber-400">Terminators</span>
//             </span>
//             <span className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">
//               LMS Platform
//             </span>
//           </div>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden lg:flex items-center gap-6">
//           {/* Live Classes Button */}
//           {userData && (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/live-schedule")}
//               className="flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-500/50 text-red-400 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all mr-4"
//             >
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
//               </span>
//               Live Now
//             </motion.button>
//           )}

//           {/* Action Buttons */}
//           {userData?.role === "educator" && (
//             <NavButton
//               text="Educator Dashboard"
//               onClick={() => navigate("/dashboard")}
//             />
//           )}
//           {userData?.role === "student" && (
//             <NavButton
//               text="Student Dashboard"
//               onClick={() => navigate("/studentdashboard")}
//             />
//           )}

//           {/* Profile Section */}
//           <div className="relative">
//             {!userData ? (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 onClick={() => navigate("/login")}
//                 className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all border border-white/10"
//               >
//                 Login
//               </motion.button>
//             ) : (
//               <div className="flex items-center gap-4">
//                 {/* Profile Trigger */}
//                 <div
//                   onClick={() => setShowPro(!showPro)}
//                   className="flex items-center gap-3 cursor-pointer p-1 pr-4 rounded-full bg-slate-800/50 border border-white/10 hover:bg-slate-800 transition-all"
//                 >
//                   <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500/50">
//                     {userData.photoUrl ? (
//                       <img
//                         src={userData.photoUrl}
//                         className="w-full h-full object-cover"
//                         alt="User"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white font-bold">
//                         {userData.name?.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                   </div>
//                   <span className="text-sm font-bold text-white">
//                     {userData.name.split(" ")[0]}
//                   </span>
//                 </div>

//                 {/* Profile Dropdown */}
//                 <AnimatePresence>
//                   {showPro && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                       className="absolute right-0 top-14 w-60 bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
//                     >
//                       <div className="p-4 border-b border-white/5">
//                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//                           Signed in as
//                         </p>
//                         <p className="text-white font-bold truncate">
//                           {userData.email}
//                         </p>
//                       </div>

//                       <div className="p-2 space-y-1">
//                         <DropdownItem
//                           icon={<FaUserCircle />}
//                           label="My Profile"
//                           onClick={() => navigate("/profile")}
//                         />
//                         <DropdownItem
//                           icon={<FaCrown />}
//                           label="My Courses"
//                           onClick={() => navigate("/enrolledcourses")}
//                         />
//                         {userData?.role === "student" && (
//                           <DropdownItem
//                             icon={<FaCrown />}
//                             label="Career Path"
//                             onClick={() => navigate("/career")}
//                           />
//                         )}
//                       </div>

//                       <div className="p-2 border-t border-white/5 bg-red-500/5">
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
//                         >
//                           <FaSignOutAlt /> Sign Out
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Menu Icon */}
//         <button
//           className="lg:hidden p-2 text-white bg-white/10 rounded-lg"
//           onClick={() => setShowHam(true)}
//         >
//           <GiHamburgerMenu className="w-6 h-6" />
//         </button>
//       </motion.nav>

//       {/* ================= MOBILE DRAWER ================= */}
//       <AnimatePresence>
//         {showHam && (
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             className="fixed inset-0 z-50 bg-[#0f172a] flex flex-col p-6"
//           >
//             <div className="flex justify-between items-center mb-10">
//               <span className="font-black text-white text-xl">Menu</span>
//               <button
//                 onClick={() => setShowHam(false)}
//                 className="p-2 bg-white/10 rounded-full text-white"
//               >
//                 <GiSplitCross className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4">
//               {userData && (
//                 <MobileItem
//                   icon={<FaVideo />}
//                   text="Live Classes"
//                   onClick={() => navigate("/live-schedule")}
//                   highlight
//                 />
//               )}

//               <MobileItem text="Home" onClick={() => navigate("/")} />
//               <MobileItem
//                 text="My Profile"
//                 onClick={() => navigate("/profile")}
//               />
//               <MobileItem
//                 text="My Courses"
//                 onClick={() => navigate("/enrolledcourses")}
//               />

//               {userData?.role === "student" && (
//                 <>
//                   <MobileItem
//                     text="Career Guidance"
//                     onClick={() => navigate("/career")}
//                   />
//                   <MobileItem
//                     text="Dashboard"
//                     onClick={() => navigate("/studentdashboard")}
//                   />
//                 </>
//               )}

//               {userData?.role === "educator" && (
//                 <MobileItem
//                   text="Educator Dashboard"
//                   onClick={() => navigate("/dashboard")}
//                 />
//               )}

//               <div className="h-px bg-white/10 my-4" />

//               {!userData ? (
//                 <button
//                   onClick={() => navigate("/login")}
//                   className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl text-lg"
//                 >
//                   Login
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleLogout}
//                   className="w-full py-4 bg-red-600/20 text-red-400 font-bold rounded-xl text-lg border border-red-500/50"
//                 >
//                   Sign Out
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// const NavButton = ({ text, onClick }) => (
//   <button
//     onClick={onClick}
//     className="text-slate-300 font-bold text-sm hover:text-white transition-colors relative group"
//   >
//     {text}
//     <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
//   </button>
// );

// const DropdownItem = ({ icon, label, onClick }) => (
//   <div
//     onClick={onClick}
//     className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all text-sm font-medium"
//   >
//     <span className="text-amber-500/80">{icon}</span>
//     {label}
//   </div>
// );

// const MobileItem = ({ icon, text, onClick, highlight }) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center gap-4 p-4 rounded-xl text-lg font-bold transition-all
//     ${
//       highlight
//         ? "bg-gradient-to-r from-red-500/20 to-red-900/20 text-red-400 border border-red-500/30"
//         : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
//     }`}
//   >
//     {icon && (
//       <span className={highlight ? "text-red-400" : "text-amber-400"}>
//         {icon}
//       </span>
//     )}
//     {text}
//   </button>
// );

// export default Nav;

import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import { IoMdPerson, IoMdSettings, IoMdLogOut } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import { FaVideo, FaCrown, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Close dropdowns on route change
  useEffect(() => {
    setShowHam(false);
    setShowPro(false);
  }, [location]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full h-[80px] z-50 px-6 lg:px-12 flex items-center justify-between transition-all duration-300
        ${scrolled ? "bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl border-b border-white/5" : "bg-[#0f172a] border-b border-white/10"}`}
      >
        {/* --- Logo Section --- */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 rounded-xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
            <img
              src={logo}
              alt="logo"
              className="relative w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* UPDATED BRAND NAME */}
          <span className="font-black text-white tracking-tight text-2xl group-hover:text-blue-200 transition-colors">
            TLE <span className="text-amber-400">Terminators</span>
          </span>
        </div>

        {/* --- Desktop Menu --- */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Live Classes Button (Pulsing) */}
          {userData && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/live-schedule")}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all mr-2 group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 group-hover:bg-white"></span>
              </span>
              Live Classes
            </motion.button>
          )}

          {/* Role Based Dashboard Links */}
          {userData?.role === "educator" && (
            <NavLink
              text="Educator Panel"
              onClick={() => navigate("/dashboard")}
            />
          )}
          {userData?.role === "student" && (
            <NavLink
              text="My Dashboard"
              onClick={() => navigate("/studentdashboard")}
            />
          )}

          {/* Profile Section */}
          <div className="relative ml-2">
            {!userData ? (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg border border-white/10 transition-all"
              >
                Login
              </motion.button>
            ) : (
              <div className="relative">
                {/* Profile Trigger */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowPro(!showPro)}
                  className={`flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-full border transition-all duration-300 ${showPro ? "bg-slate-800 border-amber-500/50" : "bg-slate-800/50 border-white/10 hover:border-white/30"}`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-600">
                    {userData.photoUrl ? (
                      <img
                        src={userData.photoUrl}
                        className="w-full h-full object-cover"
                        alt="User"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                        {userData.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight">
                      {userData.name.split(" ")[0]}
                    </span>
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                      {userData.role}
                    </span>
                  </div>
                  <FaChevronDown
                    className={`text-xs text-slate-400 transition-transform duration-300 ${showPro ? "rotate-180" : ""}`}
                  />
                </motion.div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showPro && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-16 w-64 bg-[#1e293b] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-50 ring-1 ring-white/5"
                    >
                      {/* Header */}
                      <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Signed in as
                        </p>
                        <p className="text-white font-bold truncate text-sm">
                          {userData.email}
                        </p>
                      </div>

                      {/* Links */}
                      <div className="p-2 space-y-1">
                        <DropdownItem
                          icon={<FaUserCircle />}
                          label="My Profile"
                          onClick={() => navigate("/profile")}
                        />
                        <DropdownItem
                          icon={<FaCrown />}
                          label="Enrolled Courses"
                          onClick={() => navigate("/enrolledcourses")}
                        />
                        {userData?.role === "student" && (
                          <DropdownItem
                            icon={<IoMdSettings />}
                            label="Career Path"
                            onClick={() => navigate("/career")}
                          />
                        )}
                      </div>

                      {/* Logout */}
                      <div className="p-2 border-t border-white/5 bg-red-500/5 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <IoMdLogOut className="text-base" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* --- Mobile Menu Toggle --- */}
        <button
          className="lg:hidden p-2 text-white bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all"
          onClick={() => setShowHam(true)}
        >
          <GiHamburgerMenu className="w-6 h-6" />
        </button>
      </motion.nav>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {showHam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setShowHam(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 w-[80%] max-w-[300px] h-full bg-[#0f172a] border-l border-white/10 shadow-2xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                <div className="flex flex-col">
                  <span className="font-black text-white text-xl tracking-tight">
                    Menu
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Navigation
                  </span>
                </div>
                <button
                  onClick={() => setShowHam(false)}
                  className="p-2 bg-white/5 rounded-full text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
                >
                  <GiSplitCross className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                {userData && (
                  <MobileItem
                    icon={<FaVideo />}
                    text="Live Classes"
                    onClick={() => navigate("/live-schedule")}
                    highlight
                  />
                )}

                <MobileItem text="Home" onClick={() => navigate("/")} />
                <MobileItem
                  text="My Profile"
                  onClick={() => navigate("/profile")}
                />
                <MobileItem
                  text="My Courses"
                  onClick={() => navigate("/enrolledcourses")}
                />

                {userData?.role === "student" && (
                  <>
                    <MobileItem
                      text="Career Guidance"
                      onClick={() => navigate("/career")}
                    />
                    <MobileItem
                      text="Student Dashboard"
                      onClick={() => navigate("/studentdashboard")}
                    />
                  </>
                )}

                {userData?.role === "educator" && (
                  <MobileItem
                    text="Educator Dashboard"
                    onClick={() => navigate("/dashboard")}
                  />
                )}
              </div>

              {/* Drawer Footer (Login/Logout) */}
              <div className="pt-6 border-t border-white/10 mt-4">
                {!userData ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-900/20"
                  >
                    Login to Account
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3.5 bg-red-500/10 text-red-400 font-bold rounded-xl text-sm border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Log Out
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const NavButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-lg text-slate-300 font-bold text-xs uppercase tracking-wide hover:text-white hover:bg-white/5 transition-all"
  >
    {text}
  </button>
);

const NavLink = ({ text, onClick }) => (
  <span
    onClick={onClick}
    className="text-sm font-bold text-slate-300 hover:text-white cursor-pointer transition-colors relative group"
  >
    {text}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
  </span>
);

const DropdownItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer transition-all text-xs font-bold uppercase tracking-wide"
  >
    <span className="text-amber-500 text-sm">{icon}</span>
    {label}
  </div>
);

const MobileItem = ({ icon, text, onClick, highlight }) => (
  <button
    onClick={() => {
      onClick();
    }}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all text-left
    ${
      highlight
        ? "bg-gradient-to-r from-red-500/10 to-red-900/10 text-red-400 border border-red-500/20"
        : "bg-white/5 text-slate-200 hover:bg-white/10 hover:translate-x-1 border border-transparent"
    }`}
  >
    {icon && (
      <span className={highlight ? "text-red-400" : "text-amber-400"}>
        {icon}
      </span>
    )}
    {text}
  </button>
);

export default Nav;