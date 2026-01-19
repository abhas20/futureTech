// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { serverUrl } from "../App";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import img from "../assets/empty.jpg";
// import Card from "../components/Card.jsx";
// import { setSelectedCourseData } from "../redux/courseSlice";
// import { FaLock, FaPlayCircle, FaVideo } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { FaStar } from "react-icons/fa6";
// import CourseChat from "../components/CourseChat";
// import CourseAIChat from "../components/CourseAIChat";

// function ViewCourse() {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { courseData } = useSelector((state) => state.course);
//   const { userData } = useSelector((state) => state.user);
//   const [creatorData, setCreatorData] = useState(null);
//   const dispatch = useDispatch();
//   const [selectedLecture, setSelectedLecture] = useState(null);
//   const { lectureData } = useSelector((state) => state.lecture);
//   const { selectedCourseData } = useSelector((state) => state.course);
//   const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");

//   // === NEW STATE FOR LIVE LECTURES ===
//   const [liveLectures, setLiveLectures] = useState([]);
//   const [activeLiveClass, setActiveLiveClass] = useState(null);
//   // ===================================

//   const handleReview = async () => {
//     try {
//       const result = await axios.post(
//         serverUrl + "/api/review/givereview",
//         { rating, comment, courseId },
//         { withCredentials: true },
//       );
//       toast.success("Review Added");
//       console.log(result.data);
//       setRating(0);
//       setComment("");
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message);
//     }
//   };

//   const calculateAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const total = reviews.reduce((sum, review) => sum + review.rating, 0);
//     return (total / reviews.length).toFixed(1);
//   };

//   const avgRating = calculateAverageRating(selectedCourseData?.reviews);

//   const fetchCourseData = async () => {
//     courseData.map((item) => {
//       if (item._id === courseId) {
//         dispatch(setSelectedCourseData(item));
//         return null;
//       }
//     });
//   };

//   // === NEW: FETCH LIVE LECTURES ===
//   // === UPDATE THIS FUNCTION ===
//   const fetchLiveLectures = async () => {
//     try {
//       const { data } = await axios.get(
//         `${serverUrl}/api/live/course/${courseId}`,
//         { withCredentials: true },
//       );
//       if (data.success) {
//         setLiveLectures(data.lectures);

//         // FIX: Check if the lecture is actually marked as "Active" in Database
//         const active = data.lectures.find((l) => l.isActive === true);

//         setActiveLiveClass(active);
//       }
//     } catch (error) {
//       console.error("Failed to fetch live lectures", error);
//     }
//   };
//   // ============================
//   // ================================

//   const checkEnrollment = () => {
//     const verify = userData?.enrolledCourses?.some((c) => {
//       const enrolledId = typeof c === "string" ? c : c._id;
//       return enrolledId?.toString() === courseId?.toString();
//     });

//     if (verify) {
//       setIsEnrolled(true);
//     }
//   };

//   useEffect(() => {
//     fetchCourseData();
//     checkEnrollment();
//     // Trigger live lecture fetch
//     if (isEnrolled) {
//       fetchLiveLectures();
//     }
//   }, [courseId, courseData, lectureData, isEnrolled]);

//   useEffect(() => {
//     const getCreator = async () => {
//       if (selectedCourseData?.creator) {
//         try {
//           const result = await axios.post(
//             `${serverUrl}/api/course/getcreator`,
//             { userId: selectedCourseData.creator },
//             { withCredentials: true },
//           );
//           setCreatorData(result.data);
//         } catch (error) {
//           console.error("Error fetching creator:", error);
//         }
//       }
//     };

//     getCreator();
//   }, [selectedCourseData]);

//   useEffect(() => {
//     if (creatorData?._id && courseData.length > 0) {
//       const creatorCourses = courseData.filter(
//         (course) =>
//           course.creator === creatorData._id && course._id !== courseId,
//       );
//       setSelectedCreatorCourse(creatorCourses);
//     }
//   }, [creatorData, courseData]);

//   const handleEnroll = async (courseId, userId) => {
//     try {
//       const orderData = await axios.post(
//         serverUrl + "/api/payment/create-order",
//         {
//           courseId,
//           userId,
//         },
//         { withCredentials: true },
//       );

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: orderData.data.amount,
//         currency: "INR",
//         name: "TLE Terminator LMS",
//         description: "Course Enrollment Payment",
//         order_id: orderData.data.id,
//         handler: async function (response) {
//           try {
//             const verifyRes = await axios.post(
//               serverUrl + "/api/payment/verify-payment",
//               {
//                 ...response,
//                 courseId,
//                 userId,
//               },
//               { withCredentials: true },
//             );

//             setIsEnrolled(true);
//             toast.success(verifyRes.data.message);
//           } catch (verifyError) {
//             toast.error("Payment verification failed.");
//           }
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       toast.error("Something went wrong while enrolling.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8">
//       <div className="max-w-7xl mx-auto space-y-10">
//         {/* BACK */}
//         <FaArrowLeftLong
//           onClick={() => navigate("/allcourses")}
//           className="text-black text-xl cursor-pointer hover:scale-110 transition"
//         />

//         {/* HERO */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* LEFT */}
//           <div className="lg:col-span-2 space-y-6">
//             <img
//               src={selectedCourseData?.thumbnail || img}
//               className="w-full h-[360px] object-cover rounded-3xl shadow-xl"
//             />

//             <div className="space-y-3">
//               <h1 className="text-4xl font-extrabold text-black">
//                 {selectedCourseData?.title}
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 {selectedCourseData?.subTitle}
//               </p>

//               {/* Rating */}
//               <div className="flex items-center gap-3">
//                 <div className="flex gap-1 text-yellow-400">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} />
//                   ))}
//                 </div>
//                 <span className="font-semibold text-black">
//                   {avgRating || "New"}
//                 </span>
//                 <span className="text-gray-500 text-sm">
//                   ({selectedCourseData?.reviews?.length || 0} reviews)
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT – ENROLL CARD */}
//           <div className="bg-white rounded-3xl shadow-2xl p-6 h-fit sticky top-10 border">
//             <div className="space-y-4">
//               <div>
//                 <span className="text-3xl font-bold text-black">
//                   ₹{selectedCourseData?.price}
//                 </span>
//                 <span className="ml-2 line-through text-gray-400">
//                   ₹{selectedCourseData?.price * 2}
//                 </span>
//               </div>

//               {/* === LIVE CLASS BUTTON === */}
//               {isEnrolled && activeLiveClass && (
//                 <button
//                   onClick={() => navigate(`/live/${activeLiveClass.meetingId}`)}
//                   className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse shadow-red-200 shadow-lg mb-2"
//                 >
//                   <FaVideo className="animate-bounce" />
//                   🔴 Join Live: {activeLiveClass.topic}
//                 </button>
//               )}
//               {/* ========================= */}

//               {!isEnrolled ? (
//                 <button
//                   onClick={() => handleEnroll(courseId, userData._id)}
//                   className="w-full bg-gradient-to-r from-black to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
//                 >
//                   Enroll Now
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => navigate(`/viewlecture/${courseId}`)}
//                   className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold"
//                 >
//                   Go to Lectures
//                 </button>
//               )}

//               <ul className="text-sm text-gray-600 space-y-2 pt-2">
//                 <li>✔ Lifetime Access</li>
//                 <li>✔ Expert Instructor</li>
//                 <li>✔ Certificate of Completion</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* DESCRIPTION */}
//         <section className="bg-white rounded-3xl p-8 shadow-lg">
//           <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
//           <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
//             <li>✔ Master {selectedCourseData?.category}</li>
//             <li>✔ Build real-world projects</li>
//             <li>✔ Industry-ready skills</li>
//             <li>✔ Learn at your own pace</li>
//           </ul>
//         </section>

//         {/* CURRICULUM + PLAYER */}
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//           {/* CURRICULUM */}
//           <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg">
//             <h2 className="text-xl font-bold mb-4">Course Curriculum</h2>

//             <div className="space-y-2">
//               {selectedCourseData?.lectures?.map((lecture, i) => (
//                 <button
//                   key={i}
//                   disabled={!lecture.isPreviewFree}
//                   onClick={() =>
//                     lecture.isPreviewFree && setSelectedLecture(lecture)
//                   }
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition
//                   ${
//                     lecture.isPreviewFree
//                       ? "hover:bg-blue-50 border-gray-200"
//                       : "opacity-50 cursor-not-allowed"
//                   }
//                 `}
//                 >
//                   {lecture.isPreviewFree ? (
//                     <FaPlayCircle className="text-blue-600" />
//                   ) : (
//                     <FaLock className="text-gray-500" />
//                   )}
//                   <span className="text-sm font-medium">
//                     {lecture.lectureTitle}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* PLAYER */}
//           <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-lg">
//             <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center mb-4">
//               {selectedLecture?.videoUrl ? (
//                 <video
//                   src={selectedLecture.videoUrl}
//                   controls
//                   className="w-full h-full"
//                 />
//               ) : (
//                 <span className="text-white text-sm">
//                   Select a preview lecture
//                 </span>
//               )}
//             </div>

//             <h3 className="font-semibold text-lg">
//               {selectedLecture?.lectureTitle || "Lecture Title"}
//             </h3>
//             <p className="text-sm text-gray-500">{selectedCourseData?.title}</p>
//           </div>
//         </div>

//         {/* REVIEW */}
//         <section className="bg-white rounded-3xl p-8 shadow-lg">
//           <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

//           <div className="flex gap-2 mb-3">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <FaStar
//                 key={star}
//                 onClick={() => setRating(star)}
//                 className={`cursor-pointer text-xl ${
//                   star <= rating ? "text-yellow-400" : "text-gray-300"
//                 }`}
//               />
//             ))}
//           </div>

//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             rows="3"
//             className="w-full border rounded-xl p-3 mb-3"
//             placeholder="Share your experience..."
//           />

//           <button
//             onClick={handleReview}
//             className="bg-black text-white px-6 py-2 rounded-xl"
//           >
//             Submit Review
//           </button>
//         </section>

//         {/* CHAT */}
//         {isEnrolled && (
//           <div className="bg-white rounded-3xl shadow-lg p-6">
//             <CourseChat courseId={courseId} user={userData} />
//           </div>
//         )}
//         {isEnrolled && <CourseAIChat courseId={courseId} />}

//         {/* INSTRUCTOR */}
//         <section className="bg-white rounded-3xl p-8 shadow-lg">
//           <div className="flex items-center gap-6">
//             <img
//               src={creatorData?.photoUrl || img}
//               className="w-20 h-20 rounded-full object-cover"
//             />
//             <div>
//               <h3 className="text-xl font-bold">{creatorData?.name}</h3>
//               <p className="text-gray-600">{creatorData?.description}</p>
//               <p className="text-sm text-gray-500">{creatorData?.email}</p>
//             </div>
//           </div>
//         </section>

//         {/* OTHER COURSES */}
//         <section>
//           <h2 className="text-2xl font-bold mb-4">
//             More Courses by this Instructor
//           </h2>
//           <div className="flex flex-wrap gap-6">
//             {selectedCreatorCourse?.map((item, i) => (
//               <Card
//                 key={i}
//                 thumbnail={item.thumbnail}
//                 title={item.title}
//                 id={item._id}
//                 price={item.price}
//                 category={item.category}
//               />
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default ViewCourse;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg";
import Card from "../components/Card.jsx";
import { setSelectedCourseData } from "../redux/courseSlice";
import {
  FaLock,
  FaPlayCircle,
  FaVideo,
  FaStar,
  FaInfinity,
  FaChalkboardTeacher,
  FaCertificate,
  FaUserGraduate,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import CourseChat from "../components/CourseChat";
import CourseAIChat from "../components/CourseAIChat";
import { motion, AnimatePresence } from "framer-motion";

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const [creatorData, setCreatorData] = useState(null);
  const dispatch = useDispatch();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { lectureData } = useSelector((state) => state.lecture);
  const { selectedCourseData } = useSelector((state) => state.course);
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolledDate, setEnrolledDate] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Live Lecture State
  const [liveLectures, setLiveLectures] = useState([]);
  const [activeLiveClass, setActiveLiveClass] = useState(null);

  useEffect(() => {
    if (creatorData?._id && courseData && courseData.length > 0) {
      const creatorCourses = courseData.filter((course) => {
        // Handle cases where course.creator is an object (populated) or a string (ID)
        const courseCreatorId =
          typeof course.creator === "object"
            ? course.creator._id
            : course.creator;

        // Compare IDs as strings to be safe
        return (
          courseCreatorId?.toString() === creatorData._id?.toString() &&
          course._id !== courseId
        );
      });
      setSelectedCreatorCourse(creatorCourses);
    }
  }, [creatorData, courseData, courseId]);

  const handleReview = async () => {
    try {
      const result = await axios.post(
        serverUrl + "/api/review/givereview",
        { rating, comment, courseId },
        { withCredentials: true },
      );
      toast.success("Review Added");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(selectedCourseData?.reviews);

  const fetchCourseData = async () => {
    courseData.map((item) => {
      if (item._id === courseId) {
        dispatch(setSelectedCourseData(item));
        return null;
      }
    });
  };

  const fetchLiveLectures = async () => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/live/course/${courseId}`,
        { withCredentials: true },
      );
      if (data.success) {
        setLiveLectures(data.lectures);

        // Logic to find if a class is currently active (Started < 60 mins ago OR Starts in < 15 mins)
        const now = new Date();
        const active = data.lectures.find((l) => {
          const start = new Date(l.startTime);
          const diff = (now - start) / 1000 / 60; // difference in minutes
          return diff > -15 && diff < 60;
        });
        setActiveLiveClass(active);
      }
    } catch (error) {
      console.error("Failed to fetch live lectures", error);
    }
  };

  const checkEnrollment = () => {
    if (!userData?.enrolledCourses) return;

    const enrollment = userData.enrolledCourses.find((item) => {
      const id = item.course ? item.course : item;
      const itemId = typeof id === "object" ? id._id : id;
      return itemId?.toString() === courseId;
    });

    if (enrollment) {
      setIsEnrolled(true);

      if (enrollment.enrolledAt) {
        setEnrolledDate(
          new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        );
      }
    }
  };

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
    if (isEnrolled) {
      fetchLiveLectures();
    }
  }, [courseId, courseData, lectureData, isEnrolled]);

  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/getcreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true },
          );
          setCreatorData(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };

    getCreator();
  }, [selectedCourseData]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      // Filters courses to show all courses by this creator (excluding the current one)
      const creatorCourses = courseData.filter(
        (course) =>
          course.creator === creatorData._id && course._id !== courseId,
      );
      setSelectedCreatorCourse(creatorCourses);
    }
  }, [creatorData, courseData]);

  const handleEnroll = async (courseId, userId) => {
    try {
      const orderData = await axios.post(
        serverUrl + "/api/payment/create-order",
        {
          courseId,
          userId,
        },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "TLE Terminator LMS",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              serverUrl + "/api/payment/verify-payment",
              {
                ...response,
                courseId,
                userId,
              },
              { withCredentials: true },
            );

            setIsEnrolled(true);
            toast.success(verifyRes.data.message);
          } catch (verifyError) {
            toast.error("Payment verification failed.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Something went wrong while enrolling.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800 pb-20">
      {/* --- Background Elements --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-12">
        {/* --- Back Button --- */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate("/allcourses")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors mb-4"
        >
          <div className="p-2 bg-white rounded-full shadow-sm border border-slate-200">
            <FaArrowLeftLong />
          </div>
          <span>Back to Courses</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* === LEFT COLUMN: Hero & Content === */}
          <div className="lg:col-span-2 space-y-10">
            {/* HERO SECTION */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group aspect-video"
              >
                <img
                  src={selectedCourseData?.thumbnail || img}
                  alt="Course Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-amber-400 text-black text-xs font-black rounded-md uppercase tracking-wide mb-3 shadow-lg">
                    {selectedCourseData?.category || "Course"}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  {selectedCourseData?.title}
                </h1>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  {selectedCourseData?.subTitle}
                </p>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  {selectedCourseData?.description}
                </p>

                {/* --- RATINGS & ENROLLED COUNT --- */}
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6">
                  {/* Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-amber-400 text-lg">
                      <span className="font-bold text-slate-900 mr-1 text-xl">
                        {avgRating}
                      </span>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(avgRating)
                              ? "fill-amber-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-slate-400 text-sm font-semibold">
                      ({selectedCourseData?.reviews?.length || 0} Ratings)
                    </span>
                  </div>

                  {/* Vertical Divider (Hidden on mobile) */}
                  <div className="hidden sm:block w-px h-5 bg-slate-300"></div>

                  {/* Enrollment Count */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-full">
                      <FaUserGraduate className="text-sm" />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">
                      {selectedCourseData?.enrolledStudents?.length ||
                        selectedCourseData?.enrolledCount ||
                        0}{" "}
                      Students Enrolled
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* === RIGHT COLUMN: Sticky Enroll Card === */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white p-6 md:p-8 space-y-6"
            >
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
                  Current Price
                </p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">
                    ₹{selectedCourseData?.price}
                  </span>
                  <span className="text-xl text-slate-400 font-bold line-through mb-2 decoration-2 decoration-red-400">
                    ₹{selectedCourseData?.price * 2}
                  </span>
                </div>
                <p className="text-emerald-600 text-sm font-bold mt-2">
                  OFF for a limited time only!
                </p>
              </div>

              {/* --- LIVE CLASS BUTTON (Only visible when Enrolled AND Class is Active) --- */}
              <AnimatePresence>
                {isEnrolled && activeLiveClass && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() =>
                      navigate(`/live/${activeLiveClass.meetingId}`)
                    }
                    className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:shadow-red-300 transition-all uppercase text-sm tracking-wide animate-pulse mb-4"
                  >
                    <FaVideo className="animate-bounce" />
                    <span>Join Live: {activeLiveClass.topic || "Class"}</span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* --- ENROLLED STATUS & DATE & NAME --- */}
              {isEnrolled && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 mt-1">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <div>
                    <p className="text-emerald-900 font-bold text-sm">
                      Welcome, {userData?.name || "Student"}!
                    </p>
                    <p className="text-emerald-700 text-xs font-medium mt-0.5">
                      Enrolled on {enrolledDate || "a recent date"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ACTION BUTTON */}
              {!isEnrolled ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEnroll(courseId, userData._id)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold shadow-xl shadow-slate-200 transition-all text-sm uppercase tracking-widest"
                >
                  Enroll Now
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/viewlecture/${courseId}`)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <FaPlayCircle className="text-lg" />
                  Go to Lectures
                </motion.button>
              )}

              {/* FEATURES LIST */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                  <FaInfinity className="text-blue-500 text-lg" /> Full Lifetime
                  Access
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                  <FaChalkboardTeacher className="text-amber-500 text-lg" />{" "}
                  Expert Instructor
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                  <FaCertificate className="text-emerald-500 text-lg" />{" "}
                  Certificate of Completion
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- DESCRIPTION SECTION --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
            What you'll learn
          </h2>
          <ul className="grid md:grid-cols-2 gap-y-4 gap-x-8">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
              <span className="text-slate-600 font-medium">
                Master {selectedCourseData?.category} from scratch
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
              <span className="text-slate-600 font-medium">
                Build professional, real-world projects
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
              <span className="text-slate-600 font-medium">
                Industry-standard best practices
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
              <span className="text-slate-600 font-medium">
                Lifetime access to all course materials
              </span>
            </li>
          </ul>
        </motion.section>

        {/* --- CURRICULUM & PLAYER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* CURRICULUM LIST */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-[500px]">
            <h2 className="text-xl font-black text-slate-900 mb-6 px-2">
              Course Content
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {selectedCourseData?.lectures?.map((lecture, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={!lecture.isPreviewFree}
                  onClick={() =>
                    lecture.isPreviewFree && setSelectedLecture(lecture)
                  }
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                    ${
                      lecture.isPreviewFree
                        ? "bg-white border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md cursor-pointer group"
                        : "bg-slate-50 border-transparent opacity-60 cursor-not-allowed"
                    }
                  `}
                >
                  <div
                    className={`p-3 rounded-full flex-shrink-0 ${lecture.isPreviewFree ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors" : "bg-slate-200 text-slate-400"}`}
                  >
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-bold block ${lecture.isPreviewFree ? "text-slate-700" : "text-slate-500"}`}
                    >
                      {lecture.lectureTitle}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {lecture.isPreviewFree ? "Free Preview" : "Locked"}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* VIDEO PLAYER */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <motion.div
              layout
              className="aspect-video rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center mb-6 shadow-2xl relative border border-slate-800"
            >
              {selectedLecture?.videoUrl ? (
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <FaPlayCircle className="text-4xl text-slate-600" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60">
                    Select a preview to play
                  </span>
                </div>
              )}
            </motion.div>

            <div className="px-2">
              <h3 className="font-black text-2xl text-slate-900 mb-2">
                {selectedLecture?.lectureTitle || "Welcome to the Course"}
              </h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                Preview Mode
              </p>
            </div>
          </div>
        </div>

        {/* --- REVIEW SECTION --- */}
        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full opacity-50 pointer-events-none" />

          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Leave a Review
          </h2>

          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-3xl transition-all hover:scale-125 hover:drop-shadow-md ${
                  star <= rating ? "text-amber-400" : "text-slate-200"
                }`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all resize-none placeholder:text-slate-400"
            placeholder="Tell us about your learning experience..."
          />

          <div className="mt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReview}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl hover:bg-black transition-all"
            >
              Submit Review
            </motion.button>
          </div>
        </section>

        {/* --- CHATS (ENROLLED ONLY) --- */}
        {isEnrolled && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Discussion Chat */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">
                Course Discussion
              </div>
              <div className="p-2">
                <CourseChat courseId={courseId} user={userData} />
              </div>
            </motion.div>

            {/* AI Tutor Chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl shadow-lg p-6 text-white border border-white/10"
            >
              <h4 className="font-bold mb-4 flex items-center gap-3 text-lg">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <FaUserGraduate className="text-indigo-300" />
                </div>
                AI Tutor Assistance
              </h4>

              {/* Fixed Visibility: White background, Dark text */}
              <div className="bg-white rounded-2xl p-2 text-slate-800 shadow-inner overflow-hidden">
                <CourseAIChat courseId={courseId} />
              </div>
            </motion.div>
          </div>
        )}

        {/* --- INSTRUCTOR --- */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-20"></div>
              <img
                src={creatorData?.photoUrl || img}
                alt="Instructor"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
              />
            </motion.div>

            <div className="space-y-2">
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Instructor
              </span>
              <h3 className="text-3xl font-black text-slate-900">
                {creatorData?.name}
              </h3>
              <p className="text-slate-600 font-medium max-w-2xl leading-relaxed">
                {creatorData?.description}
              </p>
              <p className="text-sm text-slate-400 font-bold pt-2">
                {creatorData?.email}
              </p>
            </div>
          </div>
        </section>

        {/* --- OTHER COURSES --- */}
        <section className="pt-8 border-t border-slate-200 mt-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-1.5 bg-amber-400 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                More by {creatorData?.name}
              </h2>
              <p className="text-slate-500 font-medium">
                Continue your learning journey
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            {selectedCreatorCourse && selectedCreatorCourse.length > 0 ? (
              selectedCreatorCourse.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="transition-all w-full sm:w-[300px]" // Ensures consistent card width
                >
                  <Card
                    thumbnail={item.thumbnail}
                    title={item.title}
                    id={item._id}
                    price={item.price}
                    category={item.category}
                    creator={item.creator} // Pass creator if your Card uses it
                    description={item.description} // Pass description if needed
                  />
                </motion.div>
              ))
            ) : (
              <div className="w-full text-center py-12 bg-slate-100 rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-400 font-bold text-lg">
                  No other courses available from this instructor yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  
}



export default ViewCourse;