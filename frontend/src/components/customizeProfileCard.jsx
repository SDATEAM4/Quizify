import { useState, useEffect, useRef } from "react";
import {
  FaSave,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaCamera
} from "react-icons/fa";

const CustomizeProfile = ({ userData, onSave, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fname: userData?.fname || "",
    lname: userData?.lname || "",
    bio: userData?.bio || "",
    password: "",
    profileImageUrl: userData?.profileImageUrl || "",
    profileImage: null, // add this
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [previewImage, setPreviewImage] = useState(userData?.profileImageUrl || "");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        fname: userData.fname || "",
        lname: userData.lname  || "",
        bio: userData.bio || "",
        password: "",
        profileImageUrl: userData.profileImageUrl || ""
      });
      setPreviewImage(userData.profileImageUrl || "");
    }
  }, [userData]);

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    if (password.length >= 10) return "strong";
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleprofileImageUrlClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // For preview only
   setFormData({ ...formData, profileImageUrl: URL.createObjectURL(file), profileImage: file });

    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="border rounded-lg shadow-md p-6 mb-6 bg-white">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile image section */}
          <div className="flex flex-col items-center">
            <div 
              className="w-32 h-32 overflow-hidden rounded-full shadow-md mb-2 relative cursor-pointer group"
              onClick={handleprofileImageUrlClick}
            >
              <img
                src={previewImage || "/fallback.jpg"}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FaCamera className="text-white text-2xl" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-1">Click to change profile picture</p>
            <h2 className="text-lg font-bold text-center break-all mt-2">
              {userData?.username}
            </h2>
          </div>

          {/* User details section */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm text-gray-500 mb-1 block">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="text-sm text-gray-500 mb-1 block">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded col-span-1 md:col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Email</label>
                <p className="font-medium break-words p-2">{userData?.email}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded col-span-1 md:col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              <div className="bg-gray-50 p-3 rounded col-span-1 md:col-span-2">
                <label className="text-sm text-gray-500 mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    placeholder="New password (leave empty to keep current)"
                    className="w-full p-2 border pr-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 text-lg -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-2 flex items-center">
                    <span className="text-sm mr-2">Strength:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        passwordStrength === "weak"
                          ? "bg-red-100 text-red-700"
                          : passwordStrength === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {passwordStrength}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer p-2  text-yellow-600 bg-yellow-50 flex items-center relative group shadow-sm rounded-md"
          >
            <FaTimesCircle className="mr-2" /> Cancel
            <span className="bg-yellow-400 hover-underline-animation"></span>
          </button>
          <button
            type="submit"
            className="cursor-pointer p-2 flex items-center relative group shadow-sm rounded-md text-green-700 bg-green-100"
          >
            <span className="bg-green-600 hover-underline-animation"></span>
            <FaSave className="mr-2" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomizeProfile;