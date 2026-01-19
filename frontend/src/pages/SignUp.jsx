

import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import axios from "axios";
import { serverUrl } from "../App";
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  let [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, email, password, role },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));

      navigate("/");
      toast.success("Account Created Successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Signup Failed");
    }
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      let name = user.displayName;
      let email = user.email;

      const result = await axios.post(
        serverUrl + "/api/auth/googlesignup",
        { name, email, role },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("Signed in with Google");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Google Sign-in Failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Animated Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden border border-white"
      >
        {/* --- LEFT SIDE: FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-black text-slate-900 text-4xl mb-2 tracking-tight"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 text-sm font-medium"
            >
              Join our elite learning community today.
            </motion.p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  className="w-full h-12 bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-normal"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  className="w-full h-12 bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-normal"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={show ? "text" : "password"}
                  className="w-full h-12 bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-12 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-normal"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                  onClick={() => setShow(!show)}
                >
                  {show ? (
                    <MdRemoveRedEye size={20} />
                  ) : (
                    <MdOutlineRemoveRedEye size={20} />
                  )}
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2 mt-1">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${role === "student" ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-[1.02]" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"}`}
                  onClick={() => setRole("student")}
                >
                  <FaUserGraduate
                    className={`text-xl mb-1 ${role === "student" ? "text-blue-600" : "text-slate-300"}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Student
                  </span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${role === "educator" ? "border-amber-400 bg-amber-50 text-amber-700 shadow-md scale-[1.02]" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"}`}
                  onClick={() => setRole("educator")}
                >
                  <FaChalkboardTeacher
                    className={`text-xl mb-1 ${role === "educator" ? "text-amber-500" : "text-slate-300"}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Educator
                  </span>
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 bg-slate-900 hover:bg-blue-900 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center mt-4"
              disabled={loading}
              onClick={handleSignUp}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Create Account"
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-1">
              <div className="h-[1px] bg-slate-200 flex-1"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Or register with
              </span>
              <div className="h-[1px] bg-slate-200 flex-1"></div>
            </div>

            {/* Google Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all"
              onClick={googleSignUp}
            >
              <img src={google} alt="Google" className="w-5" />
              <span className="text-sm font-bold text-slate-600">
                Google Account
              </span>
            </motion.button>

            <div className="text-center text-xs font-bold text-slate-400 mt-2">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:text-blue-800 underline decoration-2 underline-offset-2"
                onClick={() => navigate("/login")}
              >
                Log in
              </span>
            </div>
          </form>
        </div>

        {/* --- RIGHT SIDE: BRANDING --- */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative flex-col items-center justify-center p-12 text-white overflow-hidden">
          {/* Abstract Shapes */}
          <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="p-1.5 rounded-full border-2 border-white/20 shadow-2xl mb-8"
            >
              <img
                src={logo}
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-900"
                alt="Logo"
              />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-black mb-4 tracking-tight"
            >
              TLE Terminators
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-blue-100/80 text-center text-sm leading-relaxed max-w-sm font-medium"
            >
              Unlock your potential with world-class education. Join thousands
              of learners building the future today.
            </motion.p>
          </div>

          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp;