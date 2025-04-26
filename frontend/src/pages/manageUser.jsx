import { useState } from "react";
import ManageUserCard from '../components/managerUserCard';
import { FaSearch } from "react-icons/fa";
import { AdminNavBar } from "../components/adminNavbar";
import axios from "axios";
import toast from "react-hot-toast";

export default function ManageUserComponent() {
  const [searchUsername, setSearchUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [showUserCard, setShowUserCard] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchUsername.trim().length === 0) {
      toast.error("Please enter a username");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.get(
        `http://localhost:8080/Quizify/admin/user/username/${searchUsername}`
      );
      
      console.log("User Data Response:", response.data);
      
      // Process the response data
      if (response.data) {
        let processedUserData;
        
        // Check if the response has user property (for students/teachers)
        if (response.data.user) {
          const user = response.data.user;
          
          // Prepare subjects based on role
          let userSubjects = [];
          if (response.data.enrolledSubjectsWithNames) {
            // This is a student
            userSubjects = response.data.enrolledSubjectsWithNames;
          } else if (response.data.subjectsTaughtWithNames) {
            // This is a teacher
            userSubjects = response.data.subjectsTaughtWithNames;
          }
          
          processedUserData = {
            id: user.userId,
            username: user.username,
            firstName: user.fname,
            lastName: user.lname,
            email: user.email,
            password: user.password, // We don't show actual password
            bio: user.bio || "No bio available",
            role: user.role,
            profileImageUrl: user.profileImageUrl || null,
            subjects: userSubjects,
            studentId: response.data.studentId || null,
            teacherId: response.data.teacherId || null
          };
        } else {
          // Direct user data (possibly admin)
          const user = response.data;
          processedUserData = {
            id: user.userId,
            username: user.username,
            firstName: user.fname,
            lastName: user.lname,
            email: user.email,
            password: "●●●●●●●●", // We don't show actual password
            bio: user.bio || "No bio available",
            role: user.role,
            profileImageUrl: user.profileImageUrl || null,
            subjects: []
          };
        }
        
        setUserData(processedUserData);
        setSubjects(processedUserData.subjects);
        setShowUserCard(true);
        setIsEditing(false);
        setConfirmDelete(false);
      } else {
        toast.error("No user found with that username");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.response?.data?.message || "Error fetching user data");
      setShowUserCard(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewPassword("");
  };

  const handleSave = async () => {
    
    try{
      await axios.put(`http://localhost:8080/Quizify/forgot-password/reset?email=${userData.email}&newPassword=${newPassword}`)
      toast.success("Password changed successfully")
      // setting courses now
      try{
        const idsString = subjects.map(course => course.id).join(',');
        console.log(idsString)
        await axios.put(`http://localhost:8080/Quizify/admin/subjects/overwrite-user-subjects?userId=${userData.id}&subjects=${idsString}`)
        console.log(userData.id)
        toast.success("Courses updated successfully")
      }
      catch(error){
        toast.error("Could not update courses")
      }
    }
    catch(error){
      error.message
      toast.error("Could not update password")
    }
  };

  const toggleDeleteConfirmation = () => {
    setConfirmDelete(!confirmDelete);
  };

  const handleDelete = async () => {
    try {
      // Example API call to delete user
      // await axios.delete(`http://localhost:8080/Quizify/admin/user/delete/${userData.id}`);
      
      setSuccessMessage("User deleted successfully!");
      setShowUserCard(false);
      setUserData(null);
      setSearchUsername("");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewPassword("");
    setSubjects(userData.subjects);
    setConfirmDelete(false);
  };

  return (
    <div className="min-h-screen flex justify-center flex-col">
      <AdminNavBar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage User</h1>
          <p className="text-gray-600 mb-6">
            Search for a user to view, edit or delete their account
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <FaSearch className="mr-2" /> Search
                  </>
                )}
              </button>
            </div>
          </form>

          {/* User Card */}
          {showUserCard && userData && (
            <ManageUserCard 
              userData={userData}
              isEditing={isEditing}
              handleCancel={handleCancel}
              handleDelete={handleDelete}
              handleSave={handleSave}
              toggleDeleteConfirmation={toggleDeleteConfirmation}
              handleEdit={handleEdit}
              confirmDelete={confirmDelete}
              setNewPassword={setNewPassword}
              newPassword={newPassword}
              subjects={subjects}
              setSubjects={setSubjects}
            />
          )}
        </div>
      </div>
    </div>
  );
}