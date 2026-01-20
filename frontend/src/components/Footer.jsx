// import React from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.jpg";

// const Footer = () => {
//   let navigate = useNavigate();
//   return (
//     // Changed bg-black to a Blue Gradient to match your new theme
//     <footer className="bg-gradient-to-r from-blue-900 to-slate-900 text-blue-100 py-10 px-6 border-t-4 border-blue-600">
//       <div className="max-w-7xl mx-auto flex lg:items-start items-start justify-between gap-[40px] lg:gap-[100px] flex-col lg:flex-row">

//         {/* Logo + Description */}
//         <div className="lg:w-[40%] md:w-[50%] w-[100%]">
//           <div className="flex items-center gap-3 mb-3">
//              <img src={logo} alt="Logo" className="h-12 w-12 rounded-full border-2 border-blue-400" />
//              <h2 className="text-2xl font-bold text-white">TLE Terminators</h2>
//           </div>
//           <p className="text-sm leading-relaxed text-blue-200">
//             A Gamified STEM Learning Platform designed to master Science and Mathematics through interactive challenges. Level up your career with AI guidance.
//           </p>
//         </div>

//         {/* Quick Links */}
//         <div className="lg:w-[30%] md:w-[50%]">
//           <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
//           <ul className="space-y-2 text-sm">
//             <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer" onClick={() => navigate("/")}>Home</li>
//             <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer" onClick={() => navigate("/allcourses")}>All Courses</li>
//             <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer" onClick={() => navigate("/login")}>Login</li>
//             <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer" onClick={() => navigate("/profile")}>My Profile</li>
//           </ul>
//         </div>

//         {/* Explore Categories */}
//         <div className="lg:w-[30%] md:w-[50%]">
//           <h3 className="text-white font-bold text-lg mb-4">Explore</h3>
//           <ul className="space-y-2 text-sm">
//             <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">STEM Challenges</li>
//             <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">AI Career Guidance</li>
//             <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Mathematics & Science</li>
//             <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Coding & Logic</li>
//           </ul>
//         </div>

//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-blue-800 mt-10 pt-5 text-sm text-center text-blue-400">
//         © {new Date().getFullYear()} TLE Terminators. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  let navigate = useNavigate();

  return (
    <footer className="relative bg-[#0f172a] text-slate-300 border-t border-white/5 overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* --- Brand Section (Large) --- */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="flex items-center gap-4 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img
                  src={logo}
                  alt="Logo"
                  className="relative h-14 w-14 rounded-xl border border-white/10 shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  TLE <span className="text-amber-400">Terminators</span>
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
                  Premium Learning Ecosystem
                </p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Level up your skills with our gamified STEM platform. Master
              logic, conquer challenges, and build your future with AI-powered
              guidance.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaTwitter />} />
              <SocialIcon icon={<FaLinkedinIn />} />
              <SocialIcon icon={<FaInstagram />} />
            </div>
          </div>

          {/* --- Links Section --- */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-white font-bold text-lg relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink text="Home" onClick={() => navigate("/")} />
              <FooterLink
                text="All Courses"
                onClick={() => navigate("/allcourses")}
              />
              <FooterLink
                text="Login / Sign Up"
                onClick={() => navigate("/login")}
              />
              <FooterLink
                text="My Dashboard"
                onClick={() => navigate("/studentdashboard")}
              />
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-white font-bold text-lg relative inline-block">
              Explore
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink text="STEM Challenges" />
              <FooterLink
                text="AI Career Path"
                onClick={() => navigate("/career")}
              />
              <FooterLink text="Leaderboard" />
              <FooterLink
                text="Live Classes"
                onClick={() => navigate("/live-schedule")}
              />
            </ul>
          </div>

          {/* --- Newsletter Section --- */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-white font-bold text-lg">Stay Updated</h3>
            <p className="text-sm text-slate-400">
              Join our newsletter to get the latest challenges and career tips.
            </p>

            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <button className="absolute right-2 top-2 p-1.5 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors">
                <FaArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="border-t border-white/5 bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>
            © {new Date().getFullYear()} TLE Terminators. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Cookie Settings
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* --- Sub-Components --- */

const FooterLink = ({ text, onClick }) => (
  <li
    onClick={onClick}
    className="group flex items-center gap-2 cursor-pointer text-sm text-slate-400 hover:text-white transition-colors"
  >
    <span className="w-0 h-[2px] bg-amber-500 transition-all duration-300 group-hover:w-3"></span>
    {text}
  </li>
);

const SocialIcon = ({ icon }) => (
  <motion.div
    whileHover={{ y: -3, backgroundColor: "#ffffff", color: "#0f172a" }}
    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 cursor-pointer transition-all"
  >
    {icon}
  </motion.div>
);

export default Footer;