import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer} from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import AllCourses from "./pages/AllCourses"; 
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'

import getCouseData from './customHooks/getCouseData'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'
import getAllReviews from './customHooks/getAllReviews'
import Career from './pages/Career'
import EditQuiz from './pages/admin/EditQuiz'
import StudentDashboard from './pages/StudentDashboard'

import LiveClassDashboard from './pages/LiveClassDashboard';


import LiveRoom from './pages/LiveRoom'; 


export const serverUrl = import.meta.env.VITE_BACKEND || "http://localhost:8000"
// console.log(serverUrl);

function App() {
  
  let {userData} = useSelector(state=>state.user)

  getCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()
  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route 
          path="/live-schedule" 
          element={userData ? <LiveClassDashboard /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/allcourses"
          element={userData ? <AllCourses /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/viewcourse/:courseId"
          element={userData ? <ViewCourse /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/enrolledcourses"
          element={userData ? <EnrolledCourse /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/viewlecture/:courseId"
          element={userData ? <ViewLecture /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/searchwithai"
          element={userData ? <SearchWithAi /> : <Navigate to={"/signup"} />}
        />

       
        <Route
          path="/live/:meetingId"
          element={userData ? <LiveRoom /> : <Navigate to="/login" />}
        />


        <Route
          path="/dashboard"
          element={
            userData?.role === "educator" ? (
              <Dashboard />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/courses"
          element={
            userData?.role === "educator" ? (
              <Courses />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/addcourses/:courseId"
          element={
            userData?.role === "educator" ? (
              <AddCourses />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/createcourses"
          element={
            userData?.role === "educator" ? (
              <CreateCourse />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />

        <Route
          path="/admin/edit-quiz/:lectureId/:courseId/:quizId?"
          element={
            userData?.role === "educator" ? (
              <EditQuiz />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />

        <Route
          path="/studentdashboard"
          element={
            userData?.role === "student" ? (
              <StudentDashboard/>
            ) : (
              <Navigate to={"/"} />
            )
          }
        />

        <Route
          path="/career"
          element={
            userData?.role === "student" ? <Career /> : <Navigate to={"/"} />
          }
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
      
    </>
  );
}

export default App