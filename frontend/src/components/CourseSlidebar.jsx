import React from "react";
import { FaPlayCircle, FaClipboardList, FaCheckCircle } from "react-icons/fa";

function CourseSidebar({
  lectures,
  quizzes,
  activeTab,
  setActiveTab,
  activeUnit,
  setActiveUnit,
  courseCreator,
}) {

  return (
    <div className="flex flex-col gap-6 sticky top-24">
      {/* Instructor Info */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100">
          {courseCreator?.photoUrl ? (
            <img
              src={courseCreator.photoUrl}
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {courseCreator?.name?.charAt(0) || "I"}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Instructor
          </p>
          <p className="font-bold text-gray-900">
            {courseCreator?.name || "Unknown"}
          </p>
        </div>
      </div>

      {/* Content List Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col max-h-[calc(100vh-250px)]">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("lectures")}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === "lectures"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            Lectures ({lectures.length})
          </button>
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === "quizzes"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            Quizzes ({quizzes.length})
          </button>
        </div>

        {/* List Content */}
        <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {activeTab === "lectures" ? (
            lectures.map((lecture, index) => {
              const isActive = activeUnit?._id === lecture._id;
              return (
                <button
                  key={lecture._id}
                  onClick={() =>{ 
                    setActiveUnit(lecture);
                    window.dispatchEvent(
                    new CustomEvent("lectureSelected", { detail: lecture }),
                  );}}
                  className={`w-full text-left p-3 rounded-xl transition-all group flex items-start gap-3 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}>
                  <span
                    className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium line-clamp-2 ${isActive ? "text-white" : "text-gray-900"}`}>
                      {lecture.lectureTitle}
                    </p>
                  </div>
                  {isActive && (
                    <FaPlayCircle className="mt-1 text-indigo-200" />
                  )}
                </button>
              );
            })
          ) : quizzes.length > 0 ? (
            quizzes.map((quiz, index) => {
              const isActive = activeUnit?._id === quiz._id;
              return (
                <button
                  key={quiz._id}
                  onClick={() => setActiveUnit(quiz)}
                  className={`w-full text-left p-3 rounded-xl transition-all group flex items-start gap-3 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}>
                  <span
                    className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-purple-500 text-white"
                        : "bg-purple-100 text-purple-600"
                    }`}>
                    Q{index + 1}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium line-clamp-2 ${isActive ? "text-white" : "text-gray-900"}`}>
                      {quiz.quizTitle}
                    </p>
                    <p
                      className={`text-xs ${isActive ? "text-purple-200" : "text-gray-400"}`}>
                      {quiz.questions.length} Questions • {quiz.duration} Mins
                    </p>
                  </div>
                  {isActive && (
                    <FaClipboardList className="mt-1 text-purple-200" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              No quizzes available for this course.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseSidebar;
