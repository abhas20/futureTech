
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPen,
  FaHashtag,
  FaLayerGroup,
  FaSave,
} from "react-icons/fa";

function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(userData.name || "");
  const [description, setDescription] = useState(userData.description || "");
  const [photoFile, setPhotoFile] = useState(null);

  const [skills, setSkills] = useState(userData.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const [interests, setInterests] = useState(userData.interests || []);
  const [interestInput, setInterestInput] = useState("");

  const [preferredFields, setPreferredFields] = useState(
    userData.preferredFields || [],
  );
  const [preferredFieldInput, setPreferredFieldInput] = useState("");

  const [socialLinks, setSocialLinks] = useState({
    github: userData.socialLinks?.github || "",
    linkedin: userData.socialLinks?.linkedin || "",
    twitter: userData.socialLinks?.twitter || "",
    personalWebsite: userData.socialLinks?.personalWebsite || "",
  });

  const addTag = (e, type) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault(); // Prevent form submission on Enter
      const value = e.target.value.trim();

      if (type === "skill" && !skills.includes(value)) {
        setSkills([...skills, value]);
        setSkillInput("");
      }
      if (type === "interest" && !interests.includes(value)) {
        setInterests([...interests, value]);
        setInterestInput("");
      }
      if (type === "preferredFields" && !preferredFields.includes(value)) {
        setPreferredFields([...preferredFields, value]);
        setPreferredFieldInput("");
      }
    }
  };

  const removeTag = (tag, type) => {
    if (type === "skill") setSkills(skills.filter((s) => s !== tag));
    if (type === "interest") setInterests(interests.filter((i) => i !== tag));
    if (type === "preferredFields")
      setPreferredFields(preferredFields.filter((f) => f !== tag));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (photoFile) formData.append("photoUrl", photoFile);
    formData.append("skills", JSON.stringify(skills));
    formData.append("interests", JSON.stringify(interests));
    formData.append("preferredFields", JSON.stringify(preferredFields));
    formData.append("socialLinks", JSON.stringify(socialLinks));

    try {
      const result = await axios.post(
        `${serverUrl}/api/user/updateprofile`,
        formData,
        { withCredentials: true },
      );
      dispatch(setUserData(result.data.user));
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch {
      toast.error("Profile update failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 md:py-12 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[100px] -z-10" />

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/profile")}
        className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-800 p-4 rounded-2xl hover:border-amber-400 transition-all"
      >
        <FaArrowLeft />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Edit{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
              Profile
            </span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Refine your digital persona and professional details.
          </p>
        </div>

        <form onSubmit={updateProfile}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- LEFT COLUMN: IDENTITY --- */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-slate-900 to-blue-900 opacity-90" />

                <div className="relative z-10 -mt-4 mb-6 group">
                  <div className="w-40 h-40 mx-auto rounded-full p-1.5 bg-white shadow-xl relative">
                    <img
                      src={
                        photoFile
                          ? URL.createObjectURL(photoFile)
                          : userData.photoUrl
                      }
                      alt="profile"
                      className="w-full h-full rounded-full object-cover border-4 border-slate-100"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-2 right-2 bg-amber-400 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-amber-500 transition-colors border-4 border-white"
                    >
                      <FaCamera />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      hidden
                      onChange={(e) => setPhotoFile(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="space-y-6 text-left mt-8">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-amber-400 transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      Email Address
                    </label>
                    <div className="relative opacity-60">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input
                        value={userData.email}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
                      About Me
                    </label>
                    <div className="relative">
                      <FaPen className="absolute left-4 top-4 text-slate-300" />
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-amber-400 transition-all resize-none"
                        placeholder="Tell the world about yourself..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: DETAILS --- */}
            <div className="lg:col-span-8 space-y-6">
              {/* Tags Section */}
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10 space-y-8">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <FaLayerGroup className="text-blue-500" /> Professional DNA
                </h2>

                <TagInput
                  label="Core Skills"
                  icon={<FaHashtag className="text-amber-500" />}
                  value={skillInput}
                  setValue={setSkillInput}
                  items={skills}
                  onKeyDown={(e) => addTag(e, "skill")}
                  remove={(v) => removeTag(v, "skill")}
                  color="bg-slate-900"
                />

                <TagInput
                  label="Interests"
                  icon={<FaHashtag className="text-sky-500" />}
                  value={interestInput}
                  setValue={setInterestInput}
                  items={interests}
                  onKeyDown={(e) => addTag(e, "interest")}
                  remove={(v) => removeTag(v, "interest")}
                  color="bg-blue-600"
                />

                <TagInput
                  label="Preferred Fields"
                  icon={<FaHashtag className="text-emerald-500" />}
                  value={preferredFieldInput}
                  setValue={setPreferredFieldInput}
                  items={preferredFields}
                  onKeyDown={(e) => addTag(e, "preferredFields")}
                  remove={(v) => removeTag(v, "preferredFields")}
                  color="bg-emerald-600"
                />
              </div>

              {/* Socials Section */}
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                  <FaGlobe className="text-indigo-500" /> Digital Presence
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <SocialInput
                    icon={<FaGithub size={20} />}
                    color="text-slate-900"
                    placeholder="GitHub URL"
                    value={socialLinks.github}
                    onChange={(v) =>
                      setSocialLinks({ ...socialLinks, github: v })
                    }
                  />
                  <SocialInput
                    icon={<FaLinkedin size={20} />}
                    color="text-blue-700"
                    placeholder="LinkedIn URL"
                    value={socialLinks.linkedin}
                    onChange={(v) =>
                      setSocialLinks({ ...socialLinks, linkedin: v })
                    }
                  />
                  <SocialInput
                    icon={<FaTwitter size={20} />}
                    color="text-sky-500"
                    placeholder="Twitter URL"
                    value={socialLinks.twitter}
                    onChange={(v) =>
                      setSocialLinks({ ...socialLinks, twitter: v })
                    }
                  />
                  <SocialInput
                    icon={<FaGlobe size={20} />}
                    color="text-emerald-500"
                    placeholder="Portfolio / Website"
                    value={socialLinks.personalWebsite}
                    onChange={(v) =>
                      setSocialLinks({ ...socialLinks, personalWebsite: v })
                    }
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all"
                >
                  {loading ? (
                    <ClipLoader size={24} color="white" />
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* --- Styled Components --- */

const TagInput = ({
  label,
  icon,
  value,
  setValue,
  items,
  onKeyDown,
  remove,
  color,
}) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      {icon} {label}
    </label>
    <div className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type and press Enter..."
        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-amber-400 focus:bg-white transition-all shadow-sm"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold hidden sm:block">
        PRESS ENTER ↵
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {items.map((item) => (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            key={item}
            className={`px-4 py-2 text-xs font-bold rounded-lg text-white flex items-center gap-2 shadow-md ${color}`}
          >
            {item}
            {/* IMPORTANT FIX: ADD type="button" */}
            <button
              type="button"
              onClick={() => remove(item)}
              className="bg-white/20 hover:bg-white/40 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

const SocialInput = ({ icon, placeholder, value, onChange, color }) => (
  <div className="group relative">
    <div
      className={`absolute left-4 top-1/2 -translate-y-1/2 ${color} transition-transform group-focus-within:scale-110`}
    >
      {icon}
    </div>
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-amber-400 focus:bg-white transition-all shadow-sm"
    />
  </div>
);

export default EditProfile;