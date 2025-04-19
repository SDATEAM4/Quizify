import { useState } from "react";
import { FaUserPlus, FaBookOpen, FaCheck } from "react-icons/fa";
import { SelectCourses } from "./selectCourses";
import { AddUserForm } from "./addUserForms";
export default function AddUserComponent() {
  const [username, setUsername] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    if (password.length >= 10) return "strong";
  };

  const handleClear = () => {
    setUsername("");
    setfirstname("");
    setlastname("");
    setemail("");
    setPassword("");
    setSubjects([]);
    setPasswordStrength("");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!username || !password) {
      alert("Username and password are required");
      return;
    }

    // Show success message
    setShowSuccessMessage(true);

    // Reset form after submission
    setTimeout(() => {
      setUsername("");
      setPassword("");
      setPasswordStrength("");
      setSubjects([]);
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto ">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New User</h1>
      <p className="text-gray-600 mb-6">
        Create a new user account with specific role and permissions
      </p>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <FaCheck className="mr-2" />
            <span>User added successfully!</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AddUserForm
          username={username}
          setUsername={setUsername}
          firstname={firstname}
          setfirstname={setfirstname}
          lastname={lastname}
          setlastname={setlastname}
          email={email}
          setemail={setemail}
          password={password}
          setPassword={setPassword}
          passwordStrength={passwordStrength}
          handlePasswordChange={handlePasswordChange}
        />

        <SelectCourses
          selectedCourses={subjects}
          setSelectedCourses={setSubjects}
          label="Select Subjects"
        />

        {/* Submit Button */}
        <div className="flex justify-between">
          
          <button
            className={`cursor-pointer p-2 rounded-t-2xl flex items-center relative group shadow-sm  `}
            onClick={handleClear}
            type="reset"
          >
            <FaUserPlus className="mr-2" /> Clear Details            
              <span className="bg-blue-500 hover-underline-animation"></span>

          </button>
          <button
          type="submit"
            className={`cursor-pointer p-2 flex items-center relative group shadow-sm rounded-t-2xl `}
            onClick={handleSubmit}
          >
            <FaUserPlus className="mr-2" /> Add User            
              <span className="bg-blue-500 hover-underline-animation"></span>

          </button>
        </div>
      </form>
    </div>
  );
}
