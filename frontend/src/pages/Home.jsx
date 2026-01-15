import React from 'react';
import home from "../assets/home1.jpg";
import Nav from '../components/Nav';
import { SiViaplay } from "react-icons/si";
import Logos from '../components/Logos';
import Cardspage from '../components/Cardspage';
import ExploreCourses from '../components/ExploreCourses';
import About from '../components/About';
import ai from '../assets/ai.png';
import ai1 from '../assets/SearchAi.png';
import ReviewPage from '../components/ReviewPage';
import Footer from '../components/Footer';
import Leaderboard from '../components/Leaderboard';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Added to access real-time XP
import { FaTrophy, FaArrowRight } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user); // Get synced XP

  // Logic to calculate progress to next rank
  const getNextRankInfo = (xp) => {
    if (xp >= 1500) return { next: "MAXED", remaining: 0, percent: 100 };
    if (xp >= 1000) return { next: "Terminator", remaining: 1500 - xp, percent: (xp / 1500) * 100 };
    if (xp >= 500) return { next: "Master", remaining: 1000 - xp, percent: (xp / 1000) * 100 };
    if (xp >= 200) return { next: "Expert", remaining: 500 - xp, percent: (xp / 500) * 100 };
    return { next: "Apprentice", remaining: 200 - xp, percent: (xp / 200) * 100 };
  };

  const progress = getNextRankInfo(userData?.xp || 0);

  return (
    <div className='w-full overflow-x-hidden bg-slate-50 font-sans'>
      
      {/* --- HERO SECTION --- */}
      <div className='w-full lg:h-[90vh] h-[80vh] relative'>
        <div className="absolute top-0 left-0 w-full z-50">
           <Nav/>
        </div>
        <div className="w-full h-full relative">
           <img src={home} className='w-full h-full object-cover md:object-fill' alt="Hero" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-blue-900/40 to-slate-50"></div>
        </div>

        <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16'>
            <h1 className='text-3xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl mb-4'>
              Grow Your Skills to Advance
            </h1>
            <h2 className='text-xl md:text-3xl lg:text-5xl font-bold text-blue-200 drop-shadow-lg mb-10'>
              Your Career Path
            </h2>
            <div className='flex flex-col md:flex-row items-center gap-6 w-full justify-center'>
              <button className='px-8 py-3 border-2 border-white text-white rounded-xl text-lg font-medium flex items-center gap-3 hover:bg-white hover:text-blue-900 transition-all duration-300' onClick={() => navigate("/allcourses")}>
                View all Courses <SiViaplay className='w-6 h-6' />
              </button>
              <button className='px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-medium flex items-center gap-3 shadow-lg hover:bg-blue-700 hover:scale-105 transition-all' onClick={() => navigate("/searchwithai")}>
                Search with AI 
                <img src={ai} className='w-8 h-8 rounded-full hidden lg:block border border-blue-400' alt="AI" />
                <img src={ai1} className='w-8 h-8 rounded-full lg:hidden border border-blue-400' alt="AI" />
              </button>
            </div>
        </div>
      </div>

      {/* --- PERSONAL XP HIGHLIGHT SECTION (NEW) --- */}
      {userData && (
        <section className="bg-white pt-10 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between text-white gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                <FaTrophy className="text-4xl text-yellow-300" />
              </div>
              <div>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">Your Current Progress</p>
                <h3 className="text-2xl font-black">{userData.xp || 0} XP — {userData.rank || 'Novice'}</h3>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xs">
              <div className="flex justify-between text-xs mb-2 font-bold uppercase">
                <span>Next Rank: {progress.next}</span>
                <span>{Math.round(progress.percent)}%</span>
              </div>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-yellow-400 h-full transition-all duration-1000 shadow-[0_0_10px_#facc15]" 
                  style={{ width: `${progress.percent}%` }}
                ></div>
              </div>
              <p className="text-[10px] mt-2 text-blue-100 text-right">
                {progress.remaining > 0 ? `${progress.remaining} XP to go` : "Maximum Rank Achieved!"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* --- GLOBAL LEADERBOARD SECTION --- */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">
              The Terminator Hall of Fame
            </h2>
            <p className="text-blue-600 font-bold mt-2 text-lg">
              Top 10 Learners dominating the platform right now
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="lg:w-1/3 text-center lg:text-left">
               <h3 className="text-2xl font-bold text-slate-700 mb-4">Level Up Your Badge</h3>
               <p className="text-slate-500 mb-6 leading-relaxed">
                 Every lecture earns you <span className="text-blue-600 font-bold">50 XP</span>. Beat the high scores to claim your spot on the Global Leaderboard.
               </p>
               <button 
                 onClick={() => navigate("/allcourses")}
                 className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg mx-auto lg:mx-0 group"
               >
                 Earn More XP <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
            <div className="w-full lg:w-2/3">
              <Leaderboard />
            </div>
          </div>
        </div>
      </section>

      {/* --- REST OF SECTIONS --- */}
      <div className='bg-slate-50'><Logos/></div>
      <div className="bg-white"><ExploreCourses/><Cardspage/></div>
      <div className="bg-blue-50"><About/></div>
      <div className="bg-white py-16"><ReviewPage/></div>
      <Footer/>
    </div>
  );
}

export default Home;