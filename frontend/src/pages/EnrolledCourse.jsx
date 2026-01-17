import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      {/* Back */}
      <FaArrowLeftLong
        className="absolute top-5 left-5 md:top-8 md:left-8 w-5 h-5 md:w-6 md:h-6 cursor-pointer text-gray-400 hover:text-blue-600 transition"
        onClick={() => navigate("/")}
      />

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-8">
        My Enrolled Courses
      </h1>

      {/* Empty State */}
      {userData.enrolledCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <p className="text-gray-500 text-sm md:text-base">
            You haven’t enrolled in any course yet.
          </p>
        </div>
      ) : (
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            max-w-7xl mx-auto
          ">
          {userData.enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="
                bg-white rounded-2xl shadow-md border border-blue-100
                overflow-hidden
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
              ">
              {/* Thumbnail */}
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-44 object-cover"
              />

              {/* Content */}
              <div className="p-5 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {course.title}
                </h2>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="capitalize">{course.category}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {course.level}
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate(`/viewlecture/${course._id}`)}
                  className="
                    mt-4 w-full py-2.5
                    rounded-xl font-semibold
                    bg-blue-600 text-white
                    hover:bg-blue-700
                    active:scale-95
                    transition
                  ">
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnrolledCourse;
