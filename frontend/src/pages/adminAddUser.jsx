import { AdminNavBar } from "../components/adminNavbar";
import AddUserComponent from "../components/addUserModal";
import BackgroundTypography from "../components/backgroundTypography";
import { useEffect } from "react";

export const AdminAddUserPage = () => {
  useEffect(() => {
    document.title = "Quizify - Admin Add User";
  });

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Navbar section */}
      <div className="w-full">
        <AdminNavBar />
      </div>

      {/* Content section */}
      <div className="flex-1 w-full overflow-y-auto mt-[100px] px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
          <AddUserComponent />
        </div>
      </div>

      <BackgroundTypography />
    </div>
  );
};