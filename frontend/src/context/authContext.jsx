import { useState, useContext, useEffect, createContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [taughtSubjects, setTaughtSubjects] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);

  const refreshUser = async () => {
    if (!user) return;
  
    try {
      const res = await axios.get(
        `http://localhost:8080/Quizify/admin/user/username/${user.username}`
      );
      
      const data = res.data;
      if (data && data.user) {
        const userData = data.user;
        const updatedUser = {
          Uid: userData.userId,
          fname: userData.fname,
          lname: userData.lname,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          profileImageUrl: userData.profileImageUrl || null,
          bio: userData.bio || null,
        };
        console.log(userData)
        setUser(updatedUser); // 🧠 Boom! This updates the context
  
        // Update localStorage too
        localStorage.setItem("quizify_user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
  };
  
  // Check for saved auth state when component mounts
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem('quizify_user');
        const storedEnrolledSubjects = localStorage.getItem('quizify_enrolledSubjects');
        const storedTaughtSubjects = localStorage.getItem('quizify_taughtSubjects');
        const storedStudentId = localStorage.getItem('quizify_studentId');
        const storedTeacherId = localStorage.getItem('quizify_teacherId');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setEnrolledSubjects(storedEnrolledSubjects ? JSON.parse(storedEnrolledSubjects) : []);
          setTaughtSubjects(storedTaughtSubjects ? JSON.parse(storedTaughtSubjects) : []);
          setStudentId(storedStudentId ? JSON.parse(storedStudentId) : null);
          setTeacherId(storedTeacherId ? JSON.parse(storedTeacherId) : null);
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredAuth();
  }, []);

  // Debug logging for user info
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

  // // Helper function to save auth state to localStorage
  // const saveAuthToStorage = (userData, subjects, id, isTeacher = false) => {
  //   localStorage.setItem('quizify_user', JSON.stringify(userData));
    
  //   if (isTeacher) {
  //     localStorage.setItem('quizify_taughtSubjects', JSON.stringify(subjects));
  //     localStorage.setItem('quizify_teacherId', JSON.stringify(id));
  //     localStorage.removeItem('quizify_enrolledSubjects');
  //     localStorage.removeItem('quizify_studentId');
  //   } else {
  //     localStorage.setItem('quizify_enrolledSubjects', JSON.stringify(subjects));
  //     localStorage.setItem('quizify_studentId', JSON.stringify(id));
  //     localStorage.removeItem('quizify_taughtSubjects');
  //     localStorage.removeItem('quizify_teacherId');
  //   }
  // };

  // In authContext.jsx, modify the login function:
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
      // Return the user role along with success status
      return { success: true, role: userData.role };
    } else {
      throw new Error("Failed to fetch user details");
    }
  } catch (error) {
    console.error("Error in login: ", error.message);
    toast.error(error.message || "Login failed");
    return { success: false };
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    // Clear state
    setUser(null);
    setEnrolledSubjects([]);
    setTaughtSubjects([]);
    setStudentId(null);
    setTeacherId(null);
    
    // Clear localStorage
    localStorage.removeItem('quizify_user');
    localStorage.removeItem('quizify_enrolledSubjects');
    localStorage.removeItem('quizify_taughtSubjects');
    localStorage.removeItem('quizify_studentId');
    localStorage.removeItem('quizify_teacherId');
    
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
        teacherId,
        refreshUser
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