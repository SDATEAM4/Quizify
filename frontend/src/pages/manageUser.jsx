import { useState } from "react";
import ManageUserCard from '../components/managerUserCard'
import {
  FaSearch
} from "react-icons/fa";
import { AdminNavBar } from "../components/adminNavbar";
// Mock data for demonstration purposes
const mockUserData = {
  username: "AnonAbdur",
  firstname: "Abd Ur Rehman",
  lastname: "Naeem",
  email: "naeemabdulrehman77@gmail.com",
  password: "securepassword123",
  subjects: ["Mathematics", "Physics", "Computer Science"],
  profileImage: "https://res.cloudinary.com/dslcy5hj2/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1744826723/lost-and-found/gyu2rkub2zgkhavondne.jpg",
};

export default function ManageUserComponent() {
  const [searchUsername, setSearchUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [showUserCard, setShowUserCard] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  

  const handleSearch = (e) => {
    e.preventDefault();

    // In a real application, you would fetch user data from your backend
    // For demonstration, we'll use the mock data
    if (searchUsername.trim().length > 0) {
      // Simulate API call
      setTimeout(() => {
        setUserData(mockUserData);
        setSubjects(mockUserData.subjects);
        setShowUserCard(true);
        setIsEditing(false);
        setConfirmDelete(false);
      }, 500);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewPassword("");
  };

  const handleSave = () => {
    // In a real application, you would save changes to your backend
    const updatedUserData = {
      ...userData,
      password: newPassword || userData.password,
      subjects: subjects,
    };

    setUserData(updatedUserData);
    setIsEditing(false);
    setSuccessMessage("User details updated successfully!");

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const toggleDeleteConfirmation = () => {
    setConfirmDelete(!confirmDelete);
  };

  const handleDelete = () => {
    // In a real application, you would delete the user from your backend
    setSuccessMessage("User deleted successfully!");
    setShowUserCard(false);
    setUserData(null);
    setSearchUsername("");

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewPassword("");
    setSubjects(userData.subjects);
    setConfirmDelete(false);
  };

  return (
    <div className="min-h-screen flex justify-center flex-col ">
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
              >
                <FaSearch className="mr-2" /> Search
              </button>
            </div>
          </form>

          {/* User Card */}
          {showUserCard && userData && (
              <ManageUserCard 
              userData={mockUserData}
              isEditing={isEditing}
              handleCancel={handleCancel}
              handleDelete={handleDelete}
              handleSave={handleSave}
              toggleDeleteConfirmation={toggleDeleteConfirmation}
              handleEdit={handleEdit}
              confirmDelete={confirmDelete}
            />
            
          )}
        </div>
      </div>
    </div>
  );
}
