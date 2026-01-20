// import React, { useEffect, useRef, useState } from "react";
// import ai from "../assets/ai.png";
// import ai1 from "../assets/SearchAi.png";
// import { RiMicAiFill } from "react-icons/ri";
// import axios from "axios";
// import { serverUrl } from "../App";
// import { useNavigate } from "react-router-dom";
// import start from "../assets/start.mp3";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { LoadingSpinner } from "../components/guidence/LoadingSpinner";

// function SearchWithAi() {
//   const [input, setInput] = useState("");
//   const [recommendations, setRecommendations] = useState([]);
//   const [listening, setListening] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searched, setSearched] = useState(false);

//   const navigate = useNavigate();

//   const recognitionRef = useRef(null);
//   const startSoundRef = useRef(null);

//   /* ---------- Speech Setup ---------- */
//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.lang = "en-US";
//     } else {
//       console.log("Speech recognition not supported");
//     }

//     startSoundRef.current = new Audio(start);
//   }, []);

//   /* ---------- Voice Output ---------- */
//   const speak = (message) => {
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(message);
//     window.speechSynthesis.speak(utterance);
//   };

//   /* ---------- Voice Search ---------- */
//   const handleSearch = () => {
//     const recognition = recognitionRef.current;
//     if (!recognition || listening || loading) return;

//     setListening(true);
//     setSearched(true);
//     startSoundRef.current.play();

//     recognition.start();

//     recognition.onresult = async (e) => {
//       const transcript = e.results[0][0].transcript.trim();
//       setInput(transcript);
//       await handleRecommendation(transcript);
//     };

//     recognition.onerror = () => {
//       setListening(false);
//     };

//     recognition.onend = () => {
//       setListening(false);
//     };
//   };

//   /* ---------- API Search ---------- */
//   const handleRecommendation = async (query) => {
//     setLoading(true);
//     setSearched(true);

//     try {
//       const result = await axios.post(
//         `${serverUrl}/api/ai/search`,
//         { input: query },
//         { withCredentials: true },
//       );

//       setRecommendations(result.data);

//       if (result.data.length > 0) {
//         speak("These are the top courses I found for you");
//       } else {
//         speak("No courses found");
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//       setListening(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
//       {/* Search Box */}
//       <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
//         <FaArrowLeftLong
//           className="text-black w-[22px] h-[22px] cursor-pointer absolute"
//           onClick={() => navigate("/")}
//         />

//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
//           <img src={ai} className="w-8 h-8" alt="AI" />
//           Search with <span className="text-[#CB99C7]">AI</span>
//         </h1>

//         <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full">
//           <input
//             type="text"
//             className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
//             placeholder="What do you want to learn? (AI, MERN, Cloud...)"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />

//           {input && (
//             <button
//               onClick={() => handleRecommendation(input)}
//               className="absolute right-14 bg-white rounded-full"
//               disabled={loading}>
//               <img src={ai} className="w-10 h-10 p-2" alt="Search" />
//             </button>
//           )}

//           <button
//             className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
//             onClick={handleSearch}
//             disabled={loading || listening}>
//             <RiMicAiFill className="w-5 h-5 text-[#cb87c5]" />
//           </button>
//         </div>
//       </div>

//       {/* Results */}
//       {loading && (
//         <p className="text-center text-gray-400 mt-8">
//         Loading...
//         </p>
//       )}

//       {listening && !loading && (
//         <h1 className="text-center text-xl mt-8 text-gray-400">Listening...</h1>
//       )}

//       {searched && !loading && recommendations.length === 0 && !listening && (
//         <h1 className="text-center text-xl mt-8 text-gray-400">
//           No Courses Found
//         </h1>
//       )}

//       {recommendations.length > 0 && (
//         <div className="w-full max-w-6xl mt-12">
//           <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-3">
//             <img src={ai1} className="w-10 h-10 p-2" alt="AI Results" />
//             AI Search Results
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {recommendations.map((course) => (
//               <div
//                 key={course._id}
//                 className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 cursor-pointer hover:bg-gray-200"
//                 onClick={() => navigate(`/viewcourse/${course._id}`)}>
//                 <h3 className="text-lg font-bold">{course.title}</h3>
//                 <p className="text-sm text-gray-600">{course.category}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SearchWithAi;

import React, { useEffect, useRef, useState } from "react";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import { RiMicAiFill, RiSearch2Line, RiSoundModuleFill } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import start from "../assets/start.mp3";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaExternalLinkAlt } from "react-icons/fa";

function SearchWithAi() {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const startSoundRef = useRef(null);

  /* ---------- Speech Setup ---------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
    } else {
      console.log("Speech recognition not supported");
    }

    startSoundRef.current = new Audio(start);
  }, []);

  /* ---------- Voice Output ---------- */
  const speak = (message) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  /* ---------- Voice Search ---------- */
  const handleSearch = () => {
    const recognition = recognitionRef.current;
    if (!recognition || listening || loading) return;

    setListening(true);
    setSearched(true);
    startSoundRef.current.play();

    recognition.start();

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  /* ---------- API Search ---------- */
  const handleRecommendation = async (query) => {
    if (!query) return;
    setLoading(true);
    setSearched(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/ai/search`,
        { input: query },
        { withCredentials: true },
      );

      setRecommendations(result.data);

      if (result.data.length > 0) {
        speak("Here are the top courses I found for you");
      } else {
        speak("I couldn't find any courses matching that.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-4 py-10 relative overflow-hidden font-sans">
      {/* --- Background Decor --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] -z-10" />

      {/* Back Button */}
      <motion.button
        whileHover={{ x: -5 }}
        className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/10 z-20"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong />
      </motion.button>

      {/* --- Main Search Container --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl flex flex-col items-center mt-10 z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <img src={ai} className="w-12 h-12 invert brightness-0" alt="AI" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Ask the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              AI Tutor
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Find the perfect course with natural language.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full group">
          {/* Glowing Border Effect */}
          <div
            className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${listening ? "opacity-100 animate-pulse" : ""}`}
          ></div>

          <div className="relative flex items-center bg-[#1e293b] rounded-full p-2 border border-slate-700 shadow-2xl">
            {/* Input */}
            <input
              type="text"
              className="flex-grow px-6 py-4 bg-transparent text-white text-lg placeholder-slate-500 focus:outline-none font-medium"
              placeholder="Ex: 'I want to learn React from scratch'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleRecommendation(input)
              }
            />

            {/* Manual Search Button */}
            <AnimatePresence>
              {input && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => handleRecommendation(input)}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full mr-2 transition-colors"
                  disabled={loading}
                >
                  <RiSearch2Line className="text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mic Button (The Star) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              animate={
                listening
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
                    }
                  : {}
              }
              transition={listening ? { repeat: Infinity, duration: 1.5 } : {}}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                listening
                  ? "bg-gradient-to-r from-red-500 to-pink-600 shadow-red-500/50"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/30"
              }`}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <RiMicAiFill className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Status Text */}
        <div className="h-8 mt-4">
          {listening && (
            <p className="text-purple-400 font-medium animate-pulse">
              Listening for your command...
            </p>
          )}
          {loading && (
            <p className="text-blue-400 font-medium animate-pulse">
              Analyzing your request...
            </p>
          )}
        </div>
      </motion.div>

      {/* --- Results Section --- */}
      <div className="w-full max-w-7xl mt-12 z-10">
        {searched && !loading && recommendations.length === 0 && !listening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-slate-300">
              No courses found
            </h3>
            <p className="text-slate-500">
              Try asking in a different way, e.g., "Full stack web development"
            </p>
          </motion.div>
        )}

        {recommendations.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-8 px-4">
              <RiSoundModuleFill className="text-purple-400 text-xl" />
              <h2 className="text-xl font-bold text-white">
                AI Recommendations
              </h2>
              <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-md">
                {recommendations.length} Results
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 cursor-pointer group hover:bg-slate-800 transition-colors relative overflow-hidden"
                  onClick={() => navigate(`/viewcourse/${course._id}`)}
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-700/50 rounded-xl text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                        <FaRobot size={20} />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-700">
                        {course.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-blue-200 transition-colors">
                      {course.title}
                    </h3>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                      <span className="text-sm text-slate-400">
                        View Details
                      </span>
                      <FaExternalLinkAlt className="text-slate-500 group-hover:text-white transition-colors text-sm" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;

