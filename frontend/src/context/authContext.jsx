import { useState, useContext, useEffect, createContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [taughtSubjects, setTaughtSubjects] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    if (user != null) {
      console.log("👤 User Info:");
      console.log(user.username);
      console.log(user.fname);
      console.log(user.lname);
      console.log(user.bio);
      console.log(user.email);
      console.log(user.role);
      console.log(user.Uid);
      
      if (user.role === "Student") {
        console.log("📚 Enrolled Subjects:", enrolledSubjects);
        console.log("👨‍🎓 Student ID:", studentId);
      } else if (user.role === "Teacher") {
        console.log("🧑‍🏫 Taught Subjects:", taughtSubjects);
        console.log("👨‍🏫 Teacher ID:", teacherId);
      }
    }
  }, [user, enrolledSubjects, taughtSubjects, studentId, teacherId]);

  const login = async (identifier, password) => {
    setIsLoading(true);
    try {
      // First try using username
      let response;
      let userDetailsResponse;
      
      try {
        response = await axios.post(
          `http://localhost:8080/Quizify/login?username=${identifier}&password=${password}`
        );
        // If successful, fetch user details by username
        userDetailsResponse = await axios.get(
          `http://localhost:8080/Quizify/admin/user/username/${identifier}`
        );
        console.log(userDetailsResponse);
      } catch (error) {
        error.message
        // If username fails, try email
        response = await axios.post(
          `http://localhost:8080/Quizify/login?email=${identifier}&password=${password}`
        );
        // If successful, fetch user details by email
        userDetailsResponse = await axios.get(
          `http://localhost:8080/Quizify/admin/user/email/${identifier}`
        );
      }

      // Check if we have user data in the response
      if (userDetailsResponse && userDetailsResponse.data) {
        const data = userDetailsResponse.data;
        let userData;
        
        // Process user data based on the role/response structure
        if (data.user) {
          // This is either a student or teacher
          userData = data.user;
          
          // Extract core user info
          const userInfo = {
            Uid: userData.userId,
            fname: userData.fname,
            lname: userData.lname,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            profileImageUrl: userData.profileImageUrl || null,
            bio: userData.bio || null,
          };
          
          // Set the user in state
          setUser(userInfo);
          
          // Process specific role data
          if (userData.role === "Student" || data.studentId) {
            // Handle student data
            setStudentId(data.studentId);
            setEnrolledSubjects(data.enrolledSubjectsWithNames || []);
            setTeacherId(null);
            setTaughtSubjects([]);
          } else if (userData.role === "Teacher" || data.teacherId) {
            // Handle teacher data
            setTeacherId(data.teacherId);
            setTaughtSubjects(data.subjectsTaughtWithNames || []);
            setStudentId(null);
            setEnrolledSubjects([]);
          }
        } else {
          throw new Error("Invalid user data format");
        }
        
        toast.success("Logged in successfully!");
        return true;
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error in login: ", error.message);
      toast.error(error.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setEnrolledSubjects([]);
    setTaughtSubjects([]);
    setStudentId(null);
    setTeacherId(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isLoading,
        enrolledSubjects,
        taughtSubjects,
        studentId,
        teacherId
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};