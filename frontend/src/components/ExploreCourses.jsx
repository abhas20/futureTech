// import React from 'react'
// import { SiViaplay } from "react-icons/si";
// import { TbDeviceDesktopAnalytics } from "react-icons/tb";
// import { LiaUikit } from "react-icons/lia";
// import { MdAppShortcut } from "react-icons/md";
// import { FaHackerrank } from "react-icons/fa";
// import { TbBrandOpenai } from "react-icons/tb";
// import { SiGoogledataproc } from "react-icons/si";
// import { BsClipboardDataFill } from "react-icons/bs";
// import { SiOpenaigym } from "react-icons/si";
// import { useNavigate } from 'react-router-dom';
// function ExploreCourses() {
//   const navigate = useNavigate()
//   return (
//     <div className='w-[100vw] min-h-[50vh] lg:h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-4 px-[30px]'>
//         <div className='w-[100%] lg:w-[350px] lg:h-[100%] h-[400px]  flex flex-col items-start justify-center gap-1 md:px-[40px]  px-[20px]'>
//           <span className='text-[35px] font-semibold'>Explore</span>
//           <span className='text-[35px] font-semibold'>Our Courses</span>
//           <p className='text-[17px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vel iure explicabo laboriosam accusantium expedita laudantium facere magnam.</p>
//           <button className='px-[20px] py-[10px] border-2 bg-[black] border-white text-white rounded-[10px] text-[18px] font-light flex gap-2 mt-[40px]' onClick={()=>navigate("/allcourses")}>Explore Courses <SiViaplay className='w-[30px] h-[30px] fill-white' /></button>

//         </div>
//         <div className='w-[720px] max-w-[90%] lg:h-[300px] md:min-h-[300px] flex items-center justify-center lg:gap-[60px] gap-[50px] flex-wrap mb-[50px] lg:mb-[0px]'>
//           <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center '>
//             <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center '><TbDeviceDesktopAnalytics className='w-[60px] h-[60px] text-[#6d6c6c]' /></div>
//             Web Devlopment
//             </div>
//             <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center '>
//             <div className='w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center '><LiaUikit className='w-[60px] h-[60px] text-[#6d6c6c]' /></div>
//             UI UX Designing
//             </div>
//             <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
//             <div className='w-[100px] h-[90px] bg-[#fcb9c8] rounded-lg flex items-center justify-center '><MdAppShortcut className='w-[50px] h-[50px] text-[#6d6c6c]' /></div>
//             App Devlopment
//             </div>
//             <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
//             <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center '><FaHackerrank className='w-[55px] h-[55px] text-[#6d6c6c]' /></div>
//             Ethical Hacking
//             </div>
//             <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
//             <div className='w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center '><TbBrandOpenai className='w-[55px] h-[55px] text-[#6d6c6c]' /></div>
//             AI/ML
//             </div>
//             <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
//             <div className='w-[100px] h-[90px] bg-[#fcb9c8] rounded-lg flex items-center justify-center '><SiGoogledataproc className='w-[45px] h-[45px] text-[#6d6c6c]' /></div>
//             Data Science
//             </div>
//             <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center '>
//             <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center '><BsClipboardDataFill className='w-[50px] h-[50px] text-[#6d6c6c]' /></div>
//             Data Analytics
//             </div>
//             <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
//             <div className='w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center '><SiOpenaigym className='w-[50px] h-[50px] text-[#6d6c6c]' /></div>
//             AI Tools
//             </div>
//         </div>

//     </div>
//   )
// }

// export default ExploreCourses

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SiViaplay, SiGoogledataproc, SiOpenaigym } from "react-icons/si";
import {
  TbDeviceDesktopAnalytics,
  TbBrandOpenai,
  TbApps,
} from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank, FaArrowRight } from "react-icons/fa";
import { BsClipboardDataFill } from "react-icons/bs";

const categories = [
  {
    id: 1,
    name: "Web Development",
    icon: <TbDeviceDesktopAnalytics />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    id: 2,
    name: "UI/UX Design",
    icon: <LiaUikit />,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    id: 3,
    name: "App Development",
    icon: <MdAppShortcut />,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    id: 4,
    name: "Ethical Hacking",
    icon: <FaHackerrank />,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    id: 5,
    name: "AI & ML",
    icon: <TbBrandOpenai />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    id: 6,
    name: "Data Science",
    icon: <SiGoogledataproc />,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    id: 7,
    name: "Data Analytics",
    icon: <BsClipboardDataFill />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    id: 8,
    name: "AI Tools",
    icon: <SiOpenaigym />,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

function ExploreCourses() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-20 px-6 bg-[#0f172a] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* --- LEFT: Text Content --- */}
        <div className="w-full lg:w-1/3 flex flex-col items-start gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <TbApps size={20} />
              </span>
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">
                Discover
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Explore Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Top Categories
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-400 text-lg leading-relaxed"
          >
            Master the most in-demand skills in tech. From coding to design,
            find the perfect path to accelerate your career.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/allcourses")}
            className="group px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/10 flex items-center gap-3 transition-all hover:bg-blue-50"
          >
            Explore All Courses
            <SiViaplay className="text-blue-600 group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>

        {/* --- RIGHT: Grid Categories --- */}
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`flex flex-col items-center justify-center gap-4 p-6 rounded-3xl bg-slate-800/50 backdrop-blur-md border ${item.border} hover:bg-slate-800 transition-all cursor-pointer group`}
                onClick={() => navigate("/allcourses")}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {item.icon}
                </div>
                <h3 className="text-slate-300 font-bold text-sm text-center group-hover:text-white transition-colors">
                  {item.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExploreCourses;