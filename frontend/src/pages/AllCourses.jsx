import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaStar, FaUserGraduate, FaArrowLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setCourseData } from '../redux/courseSlice';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/course/getpublishedcourses`);
        setCourses(data);
        dispatch(setCourseData(data)); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [dispatch]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
       
       {/* Back Arrow */}
       <div className="absolute top-6 left-6 md:top-8 md:left-10">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all border border-gray-200"
          >
            <FaArrowLeft className="text-gray-700 text-lg" />
          </button>
       </div>

       {/* Header */}
       <div className="text-center mb-10 pt-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Our Courses</h1>
          <p className="text-gray-600">Master new skills with our top-rated content</p>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 group"
                onClick={() => navigate(`/viewcourse/${course._id}`)} 
              >
                
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                   <img 
                     src={course.thumbnail || "https://via.placeholder.com/400x250?text=No+Thumbnail"} 
                     alt={course.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                   />
                   <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-indigo-600 shadow-sm">
                      {course.category}
                   </div>
                </div>

                <div className="p-5">
                   <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                     {course.title}
                   </h3>
                   <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                     {course.description || "No description available."}
                   </p>
                   
                   <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-4">
                      <div className="flex items-center gap-1">
                         <FaUserGraduate className="text-indigo-400"/> 
                         {/* ✅ FIXED: Use enrolledStudents array length */}
                         <span>{course.enrolledStudents?.length || 0} Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <FaStar className="text-yellow-400"/> 
                         <span>{course.rating || 4.5}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <FaBookOpen className="text-green-400"/> 
                         <span>{course.lectures?.length || 0} Lectures</span>
                      </div>
                   </div>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full text-center py-20 text-gray-500">
                No courses published yet.
             </div>
          )}
       </div>
    </div>
  );
};

export default AllCourses;