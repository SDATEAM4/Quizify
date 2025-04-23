import { useState, useEffect } from "react";
import CustomizeProfile from "../components/customizeProfileCard";
import { NavBar } from "../components/navbar"; // Assuming you have a regular NavBar component

// Mock user data for demonstration purposes
const mockUserData = {
    username: "AnonAbdur",
    firstname: "Abd Ur Rehman",
    lastname: "Naeem",
    email: "naeemabdulrehman77@gmail.com",
    password: "securepassword123",
    bio: "I am a passionate developer with experience in React, Node.js, and MongoDB. I love building web applications and solving complex problems.",
    subjects: ["Mathematics", "Physics", "Computer Science"],
    profileImage: "https://res.cloudinary.com/dslcy5hj2/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1744826723/lost-and-found/gyu2rkub2zgkhavondne.jpg",
};

export default function CustomizeProfileContainer() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // In a real application, you would fetch the user data from your backend
    // For demonstration, we'll use mock data and simulate a loading delay
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setUserData(mockUserData);
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the user data with the new form data
      const updatedUserData = {
        ...userData,
        firstname: formData.firstname,
        lastname: formData.lastname,
        bio: formData.bio,
        // Only update password if a new one was provided
        ...(formData.password && { password: formData.password }),
        profileImage: formData.profileImage
      };
      
      setUserData(updatedUserData);
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again later.");
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // In a real application, you might want to reset the form or fetch fresh data
    // For this demo, we'll just clear any messages
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex justify-center items-center flex-grow">
        <div className="w-full max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600 mb-6">
            View and manage your profile information 
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            // Profile Edit Form
            userData && (
              <CustomizeProfile
                userData={userData}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}