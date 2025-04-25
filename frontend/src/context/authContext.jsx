import { useState, useContext, useEffect, createContext } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null); // 🔥 Fixed here

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user!=null) {
      console.log("👤 User Info:");
      console.log(user.username);
      console.log(user.fname);
      console.log(user.lname);
      console.log(user.bio);
      console.log(user.email);
      console.log(user.role);
      console.log(user.Uid);
    }
  }, [user]);
  

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      // Replace this with your real API call later
      const dummyData = {
        username: "introvertahmad",
        fname: "Muhammad",
        lname: "Ahmad Butt",
        bio: "I PARTICIPATED IN CODING HACKATHON WHEN I WAS 1 YEAR OLD.",
        email: "ahmadshahid78612345@gmail.com",
        Uid: 6,
        role: "Student",
      };
      setUser(dummyData);
      return true;
    } catch (error) {
      console.error("Error in login: ", error.message);
      toast.error(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
