import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeftLong,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa6";

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
      e.preventDefault();
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
    } catch (err) {
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-blue-100 p-8 relative">
        <FaArrowLeftLong
          onClick={() => navigate("/profile")}
          className="absolute top-6 left-6 text-gray-400 hover:text-blue-600 cursor-pointer transition"
        />

        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Edit Profile
        </h2>

        <form onSubmit={updateProfile} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                photoFile ? URL.createObjectURL(photoFile) : userData.photoUrl
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-600 shadow"
            />
            <input
              type="file"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
          </div>

          {/* Name & Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                value={userData.email}
                readOnly
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Bio</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Skills */}
          <TagInput
            label="Skills"
            value={skillInput}
            setValue={setSkillInput}
            items={skills}
            onKeyDown={(e) => addTag(e, "skill")}
            remove={(v) => removeTag(v, "skill")}
            accent="bg-blue-600"
          />

          {/* Interests */}
          <TagInput
            label="Interests"
            value={interestInput}
            setValue={setInterestInput}
            items={interests}
            onKeyDown={(e) => addTag(e, "interest")}
            remove={(v) => removeTag(v, "interest")}
          />

          {/* Preferred Fields */}
          <TagInput
            label="Preferred Fields"
            value={preferredFieldInput}
            setValue={setPreferredFieldInput}
            items={preferredFields}
            onKeyDown={(e) => addTag(e, "preferredFields")}
            remove={(v) => removeTag(v, "preferredFields")}
          />

          {/* Social Links */}
          <div className="grid md:grid-cols-2 gap-4 border-t pt-6">
            <SocialInput
              icon={<FaGithub />}
              placeholder="GitHub URL"
              value={socialLinks.github}
              onChange={(v) => setSocialLinks({ ...socialLinks, github: v })}
            />
            <SocialInput
              icon={<FaLinkedin className="text-blue-600" />}
              placeholder="LinkedIn URL"
              value={socialLinks.linkedin}
              onChange={(v) => setSocialLinks({ ...socialLinks, linkedin: v })}
            />
            <SocialInput
              icon={<FaTwitter className="text-sky-500" />}
              placeholder="Twitter URL"
              value={socialLinks.twitter}
              onChange={(v) => setSocialLinks({ ...socialLinks, twitter: v })}
            />
            <SocialInput
              icon={<FaGlobe />}
              placeholder="Website URL"
              value={socialLinks.personalWebsite}
              onChange={(v) =>
                setSocialLinks({ ...socialLinks, personalWebsite: v })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
            {loading ? <ClipLoader size={20} color="white" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;

/* ---------- Reusable Components ---------- */

const TagInput = ({
  label,
  value,
  setValue,
  items,
  onKeyDown,
  remove,
  accent,
}) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onKeyDown}
      className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
    />
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item) => (
        <span
          key={item}
          className={`px-3 py-1 text-xs rounded-lg text-white flex items-center gap-2 ${accent || "bg-gray-700"}`}>
          {item}
          <button onClick={() => remove(item)}>×</button>
        </span>
      ))}
    </div>
  </div>
);

const SocialInput = ({ icon, placeholder, value, onChange }) => (
  <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
    {icon}
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full outline-none text-sm"
    />
  </div>
);
