import { useState, useContext, useEffect, createContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AuthContext = createContext(null);

// Set up axios with defaults
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [taughtSubjects, setTaughtSubjects] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Load user data from localStorage immediately on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem('quizify_user');
        
        if (storedUser) {
          // Set user immediately from localStorage
          setUser(JSON.parse(storedUser));
          
          // Load other stored data as well
          setEnrolledSubjects(JSON.parse(localStorage.getItem('quizify_enrolledSubjects') || '[]'));
          setTaughtSubjects(JSON.parse(localStorage.getItem('quizify_taughtSubjects') || '[]'));
          setStudentId(JSON.parse(localStorage.getItem('quizify_studentId') || 'null'));
          setTeacherId(JSON.parse(localStorage.getItem('quizify_teacherId') || 'null'));
        }
        
        // Important: We still set isLoading to false here to allow immediate rendering
        // with the stored data while we validate the session in the background
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading stored auth:", error);
        setIsLoading(false);
      }
    };
    
    loadStoredAuth();
  }, []);

  // Then validate the session in the background (without blocking rendering)
  useEffect(() => {
    const validateSession = async () => {
      try {
        const storedUser = localStorage.getItem('quizify_user');
        
        if (!storedUser) {
          // No stored user, nothing to validate
          setAuthChecked(true);
          return;
        }
        
        const userData = JSON.parse(storedUser);
        
        // Try to validate session
        try {
          // Try fetching user data to validate session
          const userResponse = await axios.get(
            `http://localhost:8080/Quizify/admin/user/username/${userData.username}`
          );
          
          if (userResponse.data && userResponse.data.user) {
            // Session is valid, update with fresh data
            const freshUserData = userResponse.data.user;
            const updatedUser = {
              Uid: freshUserData.userId,
              fname: freshUserData.fname,
              lname: freshUserData.lname,
              username: freshUserData.username,
              email: freshUserData.email,
              role: freshUserData.role,
              profileImageUrl: freshUserData.profileImageUrl || null,
              bio: freshUserData.bio || null,
            };
            
            setUser(updatedUser);
            
            // Update localStorage
            localStorage.setItem("quizify_user", JSON.stringify(updatedUser));
          } else {
            // User data fetch failed, session is invalid
            logout();
          }
        } catch (fetchError) {
          console.error("Failed to validate session via user data fetch:", fetchError);
          // If server is unreachable, we'll keep the user logged in
          // This is a UX decision - you might want to change this behavior
          if (fetchError.response) {
            // Only logout if we got an actual error response (e.g. 401)
            logout();
          }
        }
      } catch (error) {
        console.error("Error during session validation:", error);
      } finally {
        setAuthChecked(true);
      }
    };
    
    validateSession();
  }, []);

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
        
        setUser(updatedUser);
        
        // Update localStorage too with the fresh data
        localStorage.setItem("quizify_user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Failed to refresh user data", err);
      // Only logout on 401 errors
      if (err.response?.status === 401) {
        logout();
      }
    }
  };
  
  // Debug logging for user info
  useEffect(() => {
    if (user != null) {
      console.log("👤 User Info loaded from storage or session:");
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

  // Helper function to save auth state to localStorage
  const saveAuthToStorage = (userData, subjects = [], id = null, isTeacher = false) => {
    if (userData) {
      localStorage.setItem('quizify_user', JSON.stringify(userData));
      
      if (isTeacher) {
        localStorage.setItem('quizify_taughtSubjects', JSON.stringify(subjects));
        localStorage.setItem('quizify_teacherId', JSON.stringify(id));
      } else {
        localStorage.setItem('quizify_enrolledSubjects', JSON.stringify(subjects));
        localStorage.setItem('quizify_studentId', JSON.stringify(id));
      }
    }
  };

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
            
            // Save to localStorage
            saveAuthToStorage(
              userInfo, 
              data.enrolledSubjectsWithNames || [], 
              data.studentId, 
              false
            );
          } else if (userData.role === "Teacher" || data.teacherId) {
            // Handle teacher data
            setTeacherId(data.teacherId);
            setTaughtSubjects(data.subjectsTaughtWithNames || []);
            setStudentId(null);
            setEnrolledSubjects([]);
            
            // Save to localStorage
            saveAuthToStorage(
              userInfo, 
              data.subjectsTaughtWithNames || [], 
              data.teacherId, 
              true
            );
          } else {
            // Handle admin or other roles
            localStorage.setItem('quizify_user', JSON.stringify(userInfo));
          }
          
          // Set auth as checked
          setAuthChecked(true);
        } else {
          throw new Error("Invalid user data format");
        }
        
        toast.success("Logged in successfully!");
        // Return the user role along with success status
        return { success: true, role: userData.role };
      }
    } catch (error) {
      console.error("Error in login: ", error);
    
      if (error.response?.status === 401) {
        toast.error("Invalid credentials. Please check your username/email and password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
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
    
    // Optional: Call logout API endpoint if you have one
    try {
      axios.post('http://localhost:8080/Quizify/logout')
        .catch(error => console.warn("Logout API call failed:", error));
    } catch (error) {
      console.warn("Error during logout API call:", error);
    }
    
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
        refreshUser,
        authChecked
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