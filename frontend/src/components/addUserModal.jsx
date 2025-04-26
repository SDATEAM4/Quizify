import { useState, useEffect } from "react";
import { FaUserPlus, FaCheck, FaTrash, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { SelectCourses } from "./selectCourses";
import { AddUserForm } from "./addUserForms";
import toast from "react-hot-toast";
import axios from 'axios';

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
  const [error, setError] = useState('');
  const [userType, setUserType] = useState("teacher");
  
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    if (password.length >= 10) return "strong";
  };

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8080/Quizify/admin/subjects");
        
        // Transform the API response to match our component's expected format
        const formattedSubjects = response.data.map(subject => ({
          id: subject.subject_id,
          name: subject.name
        }));
        
        console.log(formattedSubjects)
        toast.success("Courses fetched successfully")
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

    if(password.length >12){
      toast.error("Password must have less than 11 characters")
      return;
    }

    // Validation
    if (!username || !password || !firstname || !lastname || !email) {
      alert("All fields are required");
      return;
    }
    
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject");
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData for the API request
      const formData = new FormData();
      
      // Add basic user information
      formData.append("fname", firstname);
      formData.append("lname", lastname);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      
      // Add subject IDs as a comma-separated string
      const subjectIds = selectedSubjects.map(subject => subject.id).join(",");
      
      if (userType === "teacher") {
        formData.append("subjectTaught", subjectIds);
        await axios.post("http://localhost:8080/Quizify/admin/user/addTeacher", formData);
      } else {
        formData.append("enrolledSubjects", subjectIds);
        await axios.post("http://localhost:8080/Quizify/admin/user/addStudent", formData);
      }
      
      // Show success message
      setShowSuccessMessage(true);
      toast.success("User added successfully")
      // Reset form after successful submission
      handleClear();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error(err.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mt-2 rounded-lg shadow-md p-6 max-w-8/12 mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New User</h1>
      <p className="text-gray-600 mb-6">
        Create a new user account
      </p>

      {/* User Type Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md flex flex-row items-center ${
              userType === "teacher"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setUserType("teacher")}
          >
            <FaChalkboardTeacher className="mr-2"/> Teacher
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md flex flex-row items-center ${
              userType === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setUserType("student")}
          >
            <FaUserGraduate className="mr-2"/>
            Student
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <FaCheck className="mr-2" />
            <span>{userType === "teacher" ? "Teacher" : "Student"} added successfully!</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}

      {loading && availableSubjects.length === 0 ? (
        <div className="text-center p-6">Loading subjects...</div>
      ) : (
        <form onSubmit={handleSubmit}>
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

          <SelectCourses
            selectedCourses={selectedSubjects}
            setSelectedCourses={setSelectedSubjects}
            availableCourses={availableSubjects}
            label={userType === "teacher" ? "Select Subjects to Teach" : "Select Subjects for Enrollment"}
            />
           
          {/* Submit and Clear Buttons */}
          <div className="flex justify-between">
            <button
              className="cursor-pointer p-2 rounded-t-2xl flex items-center relative group shadow-sm"
              onClick={handleClear}
              type="reset"
              disabled={loading}
            >
              
              <	FaTrash className="mr-2 bgbl" /> Clear Details
              <span className="bg-yellow-300 hover-underline-animation"></span>
            </button>
            
            <button
              type="submit"
              className="cursor-pointer p-2 flex items-center relative group shadow-sm rounded-t-2xl"
              disabled={loading}
            >
              <FaUserPlus className="mr-2" /> 
              {loading ? "Processing..." : `Add ${userType === "teacher" ? "Teacher" : "Student"}`}
              <span className="bg-green-500 hover-underline-animation"></span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}