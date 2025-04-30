import { useState, useEffect } from "react";
import { FaUserPlus, FaCheck, FaTrash, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { SelectCourses } from "./selectCourses";
import { AddUserForm } from "./addUserForms";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddUserComponent() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("teacher");

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    if (password.length >= 10) return "strong";
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8080/Quizify/admin/subjects");
        const formattedSubjects = response.data.map((subject) => ({
          id: subject.subject_id,
          name: subject.name,
        }));
        setAvailableSubjects(formattedSubjects);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects. Please try again later.");
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleClear = () => {
    setUsername("");
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setSelectedSubjects([]);
    setPasswordStrength("");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !firstname || !lastname || !email) {
      toast.error("All fields are required");
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fname", firstname);
      formData.append("lname", lastname);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      const subjectIds = selectedSubjects.map((subject) => subject.id).join(",");
      if (userType === "teacher") {
        formData.append("subjectTaught", subjectIds);
        await axios.post("http://localhost:8080/Quizify/admin/user/addTeacher", formData);
      } else {
        formData.append("enrolledSubjects", subjectIds);
        await axios.post("http://localhost:8080/Quizify/admin/user/addStudent", formData);
      }

      setShowSuccessMessage(true);
      toast.success("User added successfully");
      handleClear();

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New User</h1>
      <p className="text-gray-600 mb-6">Create a new user account</p>

      {/* User Type Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-md flex items-center ${
            userType === "teacher" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setUserType("teacher")}
        >
          <FaChalkboardTeacher className="mr-2" /> Teacher
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md flex items-center ${
            userType === "student" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setUserType("student")}
        >
          <FaUserGraduate className="mr-2" /> Student
        </button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          <FaCheck className="mr-2" />
          {userType === "teacher" ? "Teacher" : "Student"} added successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Add User Form Component */}
        <AddUserForm
          username={username}
          setUsername={setUsername}
          firstname={firstname}
          setfirstname={setFirstname}
          lastname={lastname}
          setlastname={setLastname}
          email={email}
          setemail={setEmail}
          password={password}
          setPassword={setPassword}
          passwordStrength={passwordStrength}
          handlePasswordChange={handlePasswordChange}
        />

        {/* Select Courses Component */}
        <SelectCourses
          selectedCourses={selectedSubjects}
          setSelectedCourses={setSelectedSubjects}
          availableCourses={availableSubjects}
          label={userType === "teacher" ? "Select Subjects to Teach" : "Select Subjects for Enrollment"}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            type="reset"
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
            onClick={handleClear}
          >
            <FaTrash className="mr-2" /> Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            disabled={loading}
          >
            <FaUserPlus className="mr-2" />
            {loading ? "Processing..." : `Add ${userType === "teacher" ? "Teacher" : "Student"}`}
          </button>
        </div>
      </form>
    </div>
  );
}
