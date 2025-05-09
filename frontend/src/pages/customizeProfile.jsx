import CustomizeProfile from "../components/customizeProfileCard";
import { NavBar } from "../components/navbar"; // Assuming you have a regular NavBar component
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { TeacherNavbar } from "../components/teacherNavbar";
import axios from "axios";
export default function CustomizeProfileContainer() {
  const navigate = useNavigate();
  const {user,refreshUser} = useAuth();
  const handleSaveProfile = async (formData) => {
    console.log(formData);
  
    const form = new FormData();
    form.append("fname", formData.fname);
    form.append("lname", formData.lname);
    form.append("bio", formData.bio);
    if (formData.password) {
      form.append("password", formData.password);
    }
    if (formData.profileImage instanceof File) {
      form.append("profileImage", formData.profileImage); // actual file
    }
  
    try {
      console.log(user.Uid)
      const response = await axios.put(
        `http://localhost:8080/Quizify/user/customizeProfile/${user.Uid}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await refreshUser();
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  const handleCancelEdit = () => {
      if(user.role === 'Teacher') navigate('/teacher/home')
        else navigate('/student/home')
    };

  return (
    <div className="min-h-screen flex flex-col">
      {user.role==='Teacher'? <TeacherNavbar/>: <NavBar/>}
      <div className="flex justify-center items-center flex-grow">
        <div className="w-full max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Profile</h1>
          <p className="text-gray-600 mb-6">
            Update your personal information and customize your profile
          </p>

              <CustomizeProfile
                userData={user}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />

        </div>
      </div>
    </div>
  );
}