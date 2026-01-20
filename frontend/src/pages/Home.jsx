// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Nav from "../components/Nav";
// import Card from "../components/Card";
// import Leaderboard from "../components/Leaderboard";
// import Footer from "../components/Footer";

// import {
//   FaUserGraduate,
//   FaChalkboardTeacher,
//   FaLayerGroup,
// } from "react-icons/fa";
// import { RiSecurePaymentFill } from "react-icons/ri";
// import { BiSupport } from "react-icons/bi";
// import { SiViaplay } from "react-icons/si";

// import home from "../assets/home1.jpg";
// import ai from "../assets/ai.png";
// import ai1 from "../assets/SearchAi.png";

// function Home() {
//   const navigate = useNavigate();
//   const { courseData } = useSelector((state) => state.course);
//   const { userData } = useSelector((state) => state.user);

//   const featuredCourses = courseData?.slice(0, 3) || [];

//   /* ---------------- XP LOGIC ---------------- */
//   const getNextRankInfo = (xp = 0) => {
//     if (xp >= 1500) return { next: "MAXED", percent: 100 };
//     if (xp >= 1000) return { next: "Terminator", percent: (xp / 1500) * 100 };
//     if (xp >= 500) return { next: "Master", percent: (xp / 1000) * 100 };
//     if (xp >= 200) return { next: "Expert", percent: (xp / 500) * 100 };
//     return { next: "Apprentice", percent: (xp / 200) * 100 };
//   };

//   const progress = getNextRankInfo(userData?.xp);

//   return (
//     <div className="bg-slate-50 overflow-x-hidden">
//       {/* ================= HERO ================= */}
//       <section className="relative h-[90vh]">
//         <Nav />

//         <img
//           src={home}
//           alt="Hero"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-indigo-900/60 to-slate-900/90" />

//         <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
//           <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
//             Learn. Compete. <span className="text-yellow-400">Dominate.</span>
//           </h1>

//           <p className="max-w-2xl text-lg md:text-xl text-slate-200 mb-10">
//             A next-gen learning platform where students grow skills and
//             educators build impact — powered by AI & gamification.
//           </p>

//           <div className="flex flex-col md:flex-row gap-6">
//             <button
//               onClick={() => navigate("/allcourses")}
//               className="px-8 py-4 rounded-xl border border-white/30
//               text-white backdrop-blur-md hover:bg-white hover:text-slate-900
//               transition flex items-center gap-3 text-lg">
//               Explore Courses <SiViaplay />
//             </button>

//             <button
//               onClick={() => navigate("/searchwithai")}
//               className="px-8 py-4 rounded-xl bg-gradient-to-r
//               from-blue-500 to-indigo-600 text-white shadow-xl
//               hover:scale-105 transition flex items-center gap-3 text-lg">
//               Search with AI
//               <img
//                 src={ai}
//                 alt=""
//                 className="w-7 h-7 hidden lg:block rounded-full"
//               />
//               <img
//                 src={ai1}
//                 alt=""
//                 className="w-7 h-7 lg:hidden rounded-full"
//               />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ================= USER PROGRESS ================= */}
//       {userData && (
//         <section className="relative -mt-24 z-20 px-6">
//           <div
//             className="max-w-5xl mx-auto bg-blue-800 backdrop-blur-xl
//             rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row
//             items-center justify-between gap-6">
//             <div>
//               <p className="uppercase text-xs tracking-widest text-white/70 mb-2">
//                 Your Rank
//               </p>
//               <h2 className="text-3xl font-black text-yellow-300">
//                 {userData.rank || "Novice"} ·{" "}
//                 <span className="text-indigo-200">{userData.xp || 0} XP</span>
//               </h2>
//             </div>

//             <div className="w-full md:w-1/2">
//               <div className="flex justify-between text-xs font-semibold mb-2">
//                 <span className="text-gray-300" >Next: {progress.next}</span>
//                 <span className="text-gray-100">{Math.round(progress.percent)}%</span>
//               </div>
//               <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
//                   style={{ width: `${progress.percent}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ================= LEADERBOARD ================= */}
//       <section className="py-24 px-6">
//         <div className="text-center mb-16">
//           <h2 className="text-6xl font-black text-slate-900">
//             TERMINATOR'S HALL of <span className="text-indigo-600">FAME</span>
//           </h2>
//           <p className="text-slate-500 mt-4">
//             Our Top learners dominating the leaderboard this week.
//           </p>
//         </div>

//         <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
//           <div className="lg:col-span-1 space-y-6">
//             <h3 className="text-2xl font-bold text-slate-800">
//               Learn & Compete
//             </h3>
//             <p className="text-slate-600">
//               Complete lectures, earn XP, unlock ranks, and become a
//               Terminator-level learner.
//             </p>
//             <button
//               onClick={() => navigate("/allcourses")}
//               className="w-full py-3 rounded-xl bg-slate-900 text-white
//               hover:bg-indigo-600 transition shadow-lg">
//               Start Learning
//             </button>
//           </div>

//           <div className="lg:col-span-2">
//             <Leaderboard />
//           </div>
//         </div>
//       </section>

//       {/* ================= FEATURED COURSES ================= */}
//       <section className="bg-blue-100 py-24 px-6">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-black text-center mb-14">
//             Featured Courses
//           </h2>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {featuredCourses.map((course) => (
//               <Card
//                 key={course._id}
//                 id={course._id}
//                 title={course.title}
//                 category={course.category}
//                 price={course.price}
//                 thumbnail={course.thumbnail}
//                 reviews={course.reviews}
//               />
//             ))}
//           </div>

//           <div className="text-center mt-14">
//             <button
//               onClick={() => navigate("/allcourses")}
//               className="px-12 py-4 rounded-full bg-gradient-to-r
//               from-slate-900 to-indigo-700 text-white
//               font-bold shadow-xl hover:scale-105 transition">
//               View All Courses
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ================= WHY US ================= */}
//       <section className="py-24 px-6 bg-gradient-to-br from-blue-100 to-gray-200 text-black">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
//           <div className="space-y-6">
//             <p className="uppercase text-sm tracking-widest text-black">
//               Why Choose Us
//             </p>
//             <h2 className="text-4xl font-black">
//               Built for Students & Educators
//             </h2>
//             <p className="text-blue-950">
//               Learn faster with AI, teach smarter with analytics, and grow
//               together in one powerful ecosystem.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <Feature icon={<FaLayerGroup />} text="Gamified Learning" />
//             <Feature icon={<FaChalkboardTeacher />} text="Expert Educators" />
//             <Feature icon={<FaUserGraduate />} text="Career-Focused" />
//             <Feature icon={<RiSecurePaymentFill />} text="Lifetime Access" />
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }

// const Feature = ({ icon, text }) => (
//   <div
//     className="flex items-center gap-4 bg-black/10 backdrop-blur-md
//     p-4 rounded-xl border border-blue-950/20">
//     <div className="text-2xl text-yellow-400">{icon}</div>
//     <span className="font-semibold">{text}</span>
//   </div>
// );

// export default Home;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import Card from "../components/Card";
import Leaderboard from "../components/Leaderboard";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaLayerGroup,
  FaArrowRight,
  FaCrown,
  FaRocket,
} from "react-icons/fa";
import { RiSecurePaymentFill, RiRobot2Fill } from "react-icons/ri";
import { SiViaplay } from "react-icons/si";

import home from "../assets/home1.jpg";
import ai from "../assets/ai.png";

function Home() {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const featuredCourses = courseData?.slice(0, 3) || [];

  /* ---------------- XP LOGIC ---------------- */
  const getNextRankInfo = (xp = 0) => {
    if (xp >= 1500) return { next: "MAXED", percent: 100 };
    if (xp >= 1000) return { next: "Terminator", percent: (xp / 1500) * 100 };
    if (xp >= 500) return { next: "Master", percent: (xp / 1000) * 100 };
    if (xp >= 200) return { next: "Expert", percent: (xp / 500) * 100 };
    return { next: "Apprentice", percent: (xp / 200) * 100 };
  };

  const progress = getNextRankInfo(userData?.xp);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="bg-[#f8fafc] overflow-x-hidden font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen min-h-[600px] flex flex-col">
        <Nav />

        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0">
          <img src={home} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-900/40" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-2 mb-4"
            >
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                Next-Gen Learning Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg"
            >
              Learn. Compete. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                Dominate.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed"
            >
              Ascend the ranks from Novice to Terminator. Master new skills with
              our gamified, AI-powered ecosystem designed for modern achievers.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigate("/allcourses")}
                className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 group"
              >
                <SiViaplay className="text-blue-600 group-hover:scale-110 transition-transform" />
                Explore Courses
              </button>

              <button
                onClick={() => navigate("/searchwithai")}
                className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3 group"
              >
                <img
                  src={ai}
                  alt="AI"
                  className="w-6 h-6 group-hover:rotate-12 transition-transform"
                />
                <span>Ask AI Tutor</span>
                <FaArrowRight className="text-xs opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= USER PROGRESS (Floating Card) ================= */}
      {userData && (
        <section className="relative -mt-24 z-20 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-white flex flex-col md:flex-row items-center justify-between gap-8"
          >
            {/* Rank Info */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white text-3xl">
                <FaCrown />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
                  Current Rank
                </p>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {userData.rank || "Novice"}
                </h2>
                <p className="text-sm font-bold text-blue-600">
                  {userData.xp || 0} XP Earned
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full md:flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-500">
                  Progress to{" "}
                  <span className="text-slate-900">{progress.next}</span>
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {Math.round(progress.percent)}%
                </span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress.percent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ================= LEADERBOARD SECTION ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Text */}
            <div className="lg:col-span-4 space-y-8 sticky top-24">
              <div>
                <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2 block">
                  Competition
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  Hall of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                    Fame
                  </span>
                </h2>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed">
                See who's dominating the charts this week. Earn XP by completing
                lectures and quizzes to claim your spot at the top.
              </p>

              <div className="p-6 bg-blue-900 text-white rounded-3xl relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[50px] -mr-10 -mt-10" />
                <h3 className="text-xl font-bold relative z-10 mb-2">
                  Ready to compete?
                </h3>
                <p className="text-blue-200 text-sm relative z-10 mb-6">
                  Join thousands of students pushing their limits.
                </p>
                <button
                  onClick={() => navigate("/allcourses")}
                  className="w-full py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors relative z-10"
                >
                  Start Learning Now
                </button>
              </div>
            </div>

            {/* Right Leaderboard */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-2 overflow-hidden">
                <Leaderboard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED COURSES ================= */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Featured <span className="text-blue-400">Courses</span>
              </h2>
              <p className="text-slate-400 max-w-lg">
                Hand-picked courses to get you started on your journey to
                mastery.
              </p>
            </div>
            <button
              onClick={() => navigate("/allcourses")}
              className="px-6 py-3 rounded-full border border-slate-700 text-white hover:bg-white hover:text-slate-900 transition-all font-bold text-sm"
            >
              View Full Catalog
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  id={course._id}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  thumbnail={course.thumbnail}
                  reviews={course.reviews}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY US (Feature Grid) ================= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-2 block">
            The Advantage
          </span>
          <h2 className="text-4xl font-black text-slate-900">
            Why TLE Terminators?
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<FaLayerGroup />}
            title="Gamified"
            desc="Earn XP, unlock ranks, and compete on global leaderboards."
            color="text-blue-500"
            bg="bg-blue-50"
          />
          <FeatureCard
            icon={<RiRobot2Fill />}
            title="AI Powered"
            desc="Smart search and recommendations tailored to your goals."
            color="text-purple-500"
            bg="bg-purple-50"
          />
          <FeatureCard
            icon={<FaChalkboardTeacher />}
            title="Expert Tutors"
            desc="Learn from industry professionals with real-world experience."
            color="text-emerald-500"
            bg="bg-emerald-50"
          />
          <FeatureCard
            icon={<FaRocket />}
            title="Career Boost"
            desc="Projects and certificates designed to get you hired."
            color="text-amber-500"
            bg="bg-amber-50"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Sub-component for features
const FeatureCard = ({ icon, title, desc, color, bg }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 bg-white flex flex-col items-center text-center"
  >
    <div
      className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center text-3xl mb-6`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;