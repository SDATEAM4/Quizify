import { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserEdit,
  FaSave,
  FaTrash,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaCross,
} from "react-icons/fa";
import { SelectCourses } from "./selectCourses";

const ManageUserCard = ({
  userData,
  isEditing,
  handleCancel,
  handleDelete, 
  handleSave,
  toggleDeleteConfirmation,
  handleEdit,
  confirmDelete,
  newPassword,
  setNewPassword,
  subjects,
  setSubjects
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    if (password.length >= 10) return "strong";
  };

  // Keep track of password strength when it changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(newPassword));
  }, [newPassword]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  return (
    <div className="border rounded-lg shadow-md p-4 sm:p-6 mb-6 bg-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile image section */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full shadow-md mb-2">
            <img
              src={userData.profileImageUrl || '/images/fallback.png'}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-md sm:text-lg font-bold text-center break-all">
            {userData.username}
          </h2>
        </div>
  
        {/* User details section */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500 mb-1">First Name</p>
              <p className="font-medium break-words">{userData.firstName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500 mb-1">Last Name</p>
              <p className="font-medium break-words">{userData.lastName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded sm:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium break-words">{userData.email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-medium break-words capitalize">{userData.role}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500 mb-1">User ID</p>
              <p className="font-medium break-words">{userData.id}</p>
            </div>
  
            {/* Password Field */}
            <div className="bg-gray-50 p-3 rounded sm:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Password</p>
              {isEditing ? (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New password"
                    className="w-full p-2 border pr-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
              ) : (
                <div className="relative rounded flex items-center">
                  <p className="font-medium flex-grow">
                    {showPassword ? userData.password : "••••••••••"}
                  </p>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-500 hover:text-gray-700 absolute right-2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              )}
              {passwordStrength && (
                <div className="mt-2 flex items-center text-sm">
                  <span className="mr-2">Strength:</span>
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
  
          {/* Subjects */}
          <div className="mt-6">
            {isEditing ? (
              <SelectCourses
                selectedCourses={subjects}
                setSelectedCourses={setSubjects}
                label=""
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {subjects && subjects.length > 0 ? (
                  subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {typeof subject === "object" ? subject.name : subject}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No subjects assigned</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t flex flex-wrap justify-end gap-3">
        {!isEditing ? (
          <>
            <button
              type="button"
              onClick={handleEdit}
              className="p-2 flex items-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm"
            >
              <FaUserEdit className="mr-2" /> Edit User
            </button>
            <button
              onClick={toggleDeleteConfirmation}
              className="p-2 flex items-center rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm"
            >
              <FaTrash className="mr-2" /> Delete User
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 flex items-center rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm"
            >
              <FaTimesCircle className="mr-2" /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="p-2 flex items-center rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
          </>
        )}
      </div>
  
      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-lg shadow-sm text-sm">
          <p className="text-red-600 font-medium mb-4">
            Are you sure you want to delete user "{userData.username}"? This action cannot be undone.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleDelete}
            >
              Confirm Delete
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              onClick={toggleDeleteConfirmation}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ManageUserCard;