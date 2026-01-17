import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import Card from "../components/Card";
import Leaderboard from "../components/Leaderboard";
import Footer from "../components/Footer";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaLayerGroup,
} from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { SiViaplay } from "react-icons/si";

import home from "../assets/home1.jpg";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";

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

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="relative h-[90vh]">
        <Nav />

        <img
          src={home}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-indigo-900/60 to-slate-900/90" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Learn. Compete. <span className="text-yellow-400">Dominate.</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-slate-200 mb-10">
            A next-gen learning platform where students grow skills and
            educators build impact — powered by AI & gamification.
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => navigate("/allcourses")}
              className="px-8 py-4 rounded-xl border border-white/30
              text-white backdrop-blur-md hover:bg-white hover:text-slate-900
              transition flex items-center gap-3 text-lg">
              Explore Courses <SiViaplay />
            </button>

            <button
              onClick={() => navigate("/searchwithai")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r
              from-blue-500 to-indigo-600 text-white shadow-xl
              hover:scale-105 transition flex items-center gap-3 text-lg">
              Search with AI
              <img
                src={ai}
                alt=""
                className="w-7 h-7 hidden lg:block rounded-full"
              />
              <img
                src={ai1}
                alt=""
                className="w-7 h-7 lg:hidden rounded-full"
              />
            </button>
          </div>
        </div>
      </section>

      {/* ================= USER PROGRESS ================= */}
      {userData && (
        <section className="relative -mt-24 z-20 px-6">
          <div
            className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl
            rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row
            items-center justify-between gap-6">
            <div>
              <p className="uppercase text-xs tracking-widest text-slate-500">
                Your Rank
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {userData.rank || "Novice"} ·{" "}
                <span className="text-indigo-600">{userData.xp || 0} XP</span>
              </h2>
            </div>

            <div className="w-full md:w-1/2">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Next: {progress.next}</span>
                <span>{Math.round(progress.percent)}%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= LEADERBOARD ================= */}
      <section className="py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900">
            Hall of <span className="text-indigo-600">Fame</span>
          </h2>
          <p className="text-slate-500 mt-4">
            Top learners dominating the leaderboard
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">
              Learn & Compete
            </h3>
            <p className="text-slate-600">
              Complete lectures, earn XP, unlock ranks, and become a
              Terminator-level learner.
            </p>
            <button
              onClick={() => navigate("/allcourses")}
              className="w-full py-3 rounded-xl bg-slate-900 text-white
              hover:bg-indigo-600 transition shadow-lg">
              Start Learning
            </button>
          </div>

          <div className="lg:col-span-2">
            <Leaderboard />
          </div>
        </div>
      </section>

      {/* ================= FEATURED COURSES ================= */}
      <section className="bg-blue-100 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-14">
            Featured Courses
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card
                key={course._id}
                id={course._id}
                title={course.title}
                category={course.category}
                price={course.price}
                thumbnail={course.thumbnail}
                reviews={course.reviews}
              />
            ))}
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => navigate("/allcourses")}
              className="px-12 py-4 rounded-full bg-gradient-to-r
              from-slate-900 to-indigo-700 text-white
              font-bold shadow-xl hover:scale-105 transition">
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-100 to-gray-200 text-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="uppercase text-sm tracking-widest text-black">
              Why Choose Us
            </p>
            <h2 className="text-4xl font-black">
              Built for Students & Educators
            </h2>
            <p className="text-blue-950">
              Learn faster with AI, teach smarter with analytics, and grow
              together in one powerful ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Feature icon={<FaLayerGroup />} text="Gamified Learning" />
            <Feature icon={<FaChalkboardTeacher />} text="Expert Educators" />
            <Feature icon={<FaUserGraduate />} text="Career-Focused" />
            <Feature icon={<RiSecurePaymentFill />} text="Lifetime Access" />
          </div>
        </div>
      </section>    

      <Footer />
    </div>
  );
}


const Feature = ({ icon, text }) => (
  <div
    className="flex items-center gap-4 bg-black/10 backdrop-blur-md
    p-4 rounded-xl border border-blue-950/20">
    <div className="text-2xl text-yellow-400">{icon}</div>
    <span className="font-semibold">{text}</span>
  </div>
);

export default Home;
