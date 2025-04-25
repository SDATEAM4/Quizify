import { AdminNavBar } from "../components/adminNavbar"
import AddUserComponent from "../components/addUserModal"
import { useAuth } from "../context/authContext"
import { useEffect } from "react";

export const AdminAddUserPage = () => {
  const {user, login} = useAuth();
  
  useEffect(() => {
    // only on first render
    login("", "");
  }, []);
  
  useEffect(() => {
    if (user) {
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
  

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Navbar section - fixed height */}
      <div className="w-full">
        <AdminNavBar/>
      </div>
      
      {/* Content section - scrollable */}
      <div className="flex-1 w-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <AddUserComponent/>
        </div>
      </div>
    </div>
  )
}