import { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserEdit,
  FaSave,
  FaTrash,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
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
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    if (password.length >= 10) return "strong";
  };

  // Initialize subjects with userData.subjects when the component mounts or userData changes
  const [subjects, setSubjects] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    if (userData && userData.subjects) {
      setSubjects(userData.subjects);
    }
  }, [userData]);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  // Function to handle saving with the updated values
  const onSave = () => {
    handleSave({
      newPassword,
      subjects,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="border rounded-lg shadow-md p-6 mb-6 bg-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile image section */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 overflow-hidden rounded-full shadow-md mb-2">
            <img
              src={userData.profileImage}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-bold text-center break-all">
            {userData.username}
          </h2>
        </div>

        {/* User details section */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500 mb-1">First Name</p>
              <p className="font-medium break-words">{userData.firstname}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500 mb-1">Last Name</p>
              <p className="font-medium break-words">{userData.lastname}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded col-span-1 md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium break-words">{userData.email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded col-span-1 md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Password</p>
              {isEditing ? (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New password"
                    className="w-full p-2 border pr-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 text-lg -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                                  </div>
              ) : (
                <div className="relative p-2 rounded flex items-center">
                  <p className="font-medium flex-grow">
                    {showPassword
                      ? userData.password || "No password set"
                      : "••••••••••"}
                  </p>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-500 hover:text-gray-700 absolute right-2 "
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              )}
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

          {/* Subjects section */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Subjects</p>
            {isEditing ? (
              <SelectCourses
                selectedCourses={subjects}
                setSelectedCourses={setSubjects}
                label=""
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {userData.subjects && userData.subjects.length > 0 ? (
                  userData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">
                    No subjects assigned
                  </span>
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
              className={`cursor-pointer p-2 flex items-center relative group shadow-sm rounded-t-2xl `}
            >
              <span className="bg-blue-500 hover-underline-animation"></span>
              <FaUserEdit className="mr-2" /> Edit User
            </button>
            <button
              className={`cursor-pointer p-2 flex items-center relative group shadow-sm rounded-t-2xl `}
              onClick={toggleDeleteConfirmation}
            >
              <FaTrash className="mr-2" />
              Delete User
              <span className="bg-red-600 hover-underline-animation"></span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className={`cursor-pointer p-2 flex items-center relative group shadow-sm rounded-t-2xl `}
            >
              <FaTimesCircle className="mr-2" /> Cancel
              <span className="bg-blue-500 hover-underline-animation"></span>
            </button>
            <button
              type="button"
              onClick={onSave}
              className={`cursor-pointer p-2 flex items-center relative group shadow-sm rounded-t-2xl `}
            >
              <span className="bg-green-600 hover-underline-animation"></span>
              <FaSave className="mr-2" /> Save Changes
            </button>
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-lg shadow-sm">
          <p className="text-red-600 font-medium mb-4">
            Are you sure you want to delete user "{userData.username}"? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={toggleDeleteConfirmation}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserCard;
