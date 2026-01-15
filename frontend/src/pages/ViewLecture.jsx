import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle, FaTrophy } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { setUserData } from '../redux/userSlice'; 

function ViewLecture() {
  const { courseId } = useParams();
  const dispatch = useDispatch(); 
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const selectedCourse = courseData?.find((course) => course._id === courseId);

  const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null);
  const navigate = useNavigate();
  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null;

  const handleLectureEnd = async () => {
    try {
      const { data } = await axios.post(`${serverUrl}/api/user/progress`, 
        { lectureId: selectedLecture._id }, 
        { withCredentials: true }
      );
      if (data.success) {
        // Update Redux Store to trigger Leaderboard refresh
        dispatch(setUserData(data.user)); 
        toast.success("🎯 +50 XP Earned!");
      }
    } catch (error) {
      console.error("XP Error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center justify-start gap-[20px] text-gray-800">
              <FaArrowLeftLong className='text-black w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/")} />
              {selectedCourse?.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
            <FaTrophy />
            <span className="font-bold">{userData?.xp || 0} XP</span>
          </div>
        </div>

        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300 shadow-inner">
          {selectedLecture?.videoUrl ? (
            <video
              key={selectedLecture._id}
              src={selectedLecture.videoUrl}
              controls
              onEnded={handleLectureEnd} 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white text-center p-4">Select a lecture to start your journey</div>
          )}
        </div>
        <div className="mt-2 text-xl font-bold text-gray-800">{selectedLecture?.lectureTitle}</div>
      </div>

      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Lectures</h2>
        <div className="flex flex-col gap-3 mb-6">
          {selectedCourse?.lectures?.map((lecture, index) => (
            <button
              key={index}
              onClick={() => setSelectedLecture(lecture)}
              className={`flex items-center justify-between p-3 rounded-lg border transition ${selectedLecture?._id === lecture._id ? 'bg-gray-200 border-gray-500' : 'hover:bg-gray-50 border-gray-300'}`}
            >
              <h4 className="text-sm font-semibold text-gray-800 truncate pr-2">{lecture.lectureTitle}</h4>
              <FaPlayCircle className="text-black text-xl shrink-0" />
            </button>
          ))}
        </div>
        
        {courseCreator && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Instructor</h3>
            <div className="flex items-center gap-4">
              <img src={courseCreator.photoUrl || '/default-avatar.png'} alt="Instructor" className="w-14 h-14 rounded-full border shadow-sm" />
              <div>
                <h4 className="text-base font-medium text-gray-800">{courseCreator.name}</h4>
                <p className="text-sm text-gray-600 leading-tight">{courseCreator.description || 'No bio available.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLecture;