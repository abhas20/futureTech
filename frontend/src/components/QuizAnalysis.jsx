import React from "react";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaUserGraduate,
} from "react-icons/fa";

function QuizAnalysis({loading, data}) {

  if (loading) return <div className="p-10 text-center">Loading Stats...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <FaChalkboardTeacher className="text-indigo-600" />
        Instructor Dashboard
      </h1>

      {/* Stats Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Quiz Performance Report</h3>
          <span className="text-sm text-gray-500">
            {data.length} Quizzes Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50 text-indigo-900 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Quiz Title</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Lecture</th>
                <th className="p-4 font-semibold text-center">Attempts</th>
                <th className="p-4 font-semibold text-center">Avg. Score</th>
                <th className="p-4 font-semibold text-center">Highest Score</th>
              </tr>
            </thead>

            

            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  {/* Quiz Title */}
                  <td className="p-4 font-medium text-gray-900">
                    {item.quizTitle}
                    <div className="text-xs text-gray-400 mt-1">
                      {item.totalQuestions} Questions
                    </div>
                  </td>

                  {/* Course Name */}
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaBookOpen className="text-gray-300" />
                      {item.courseName}
                    </div>
                  </td>

                  {/* Lecture Name */}
                  <td className="p-4 text-gray-600">
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs inline-block">
                      {item.lectureName}
                    </div>
                  </td>

                  {/* Attempts */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-gray-700">
                      <FaUserGraduate className="text-gray-400" />
                      {item.totalAttempts}
                    </div>
                  </td>

                  {/* Average Score */}
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        item.averageScore >= item.totalQuestions * 0.7
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {item.averageScore} / {item.totalQuestions}
                    </span>
                  </td>

                  {/* Highest Score */}
                  <td className="p-4 text-center font-bold text-indigo-600">
                    {item.highestScore}
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No quizzes created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
  );
}


export default QuizAnalysis;

