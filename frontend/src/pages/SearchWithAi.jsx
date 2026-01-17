import React, { useEffect, useRef, useState } from "react";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import { RiMicAiFill } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import start from "../assets/start.mp3";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LoadingSpinner } from "../components/guidence/LoadingSpinner";

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
        speak("These are the top courses I found for you");
      } else {
        speak("No courses found");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
      {/* Search Box */}
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
        <FaArrowLeftLong
          className="text-black w-[22px] h-[22px] cursor-pointer absolute"
          onClick={() => navigate("/")}
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
          <img src={ai} className="w-8 h-8" alt="AI" />
          Search with <span className="text-[#CB99C7]">AI</span>
        </h1>

        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full">
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            placeholder="What do you want to learn? (AI, MERN, Cloud...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {input && (
            <button
              onClick={() => handleRecommendation(input)}
              className="absolute right-14 bg-white rounded-full"
              disabled={loading}>
              <img src={ai} className="w-10 h-10 p-2" alt="Search" />
            </button>
          )}

          <button
            className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleSearch}
            disabled={loading || listening}>
            <RiMicAiFill className="w-5 h-5 text-[#cb87c5]" />
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <p className="text-center text-gray-400 mt-8">
        Loading...
        </p>
      )}

      {listening && !loading && (
        <h1 className="text-center text-xl mt-8 text-gray-400">Listening...</h1>
      )}

      {searched && !loading && recommendations.length === 0 && !listening && (
        <h1 className="text-center text-xl mt-8 text-gray-400">
          No Courses Found
        </h1>
      )}

      {recommendations.length > 0 && (
        <div className="w-full max-w-6xl mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-3">
            <img src={ai1} className="w-10 h-10 p-2" alt="AI Results" />
            AI Search Results
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendations.map((course) => (
              <div
                key={course._id}
                className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/viewcourse/${course._id}`)}>
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchWithAi;
