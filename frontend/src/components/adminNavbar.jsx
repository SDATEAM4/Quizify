import { useState } from "react";
import {
  FaChartBar,
  FaSignOutAlt,
  FaUserCog,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const AdminNavBar = () => {
  const [activeTab, setActiveTab] = useState("addUser");
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
    setMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <header className="bg-black text-white shadow-md z-20 w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Quizify Admin</div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "addUser" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => handleNavClick("addUser", "/admin/addUser")}
          >
            <FaUserPlus className="mr-2" /> Add User
          </button>

          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "manageUser" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => handleNavClick("manageUser", "/admin/manageUser")}
          >
            <FaUserCog className="mr-2" /> Manage User
          </button>

          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "subject" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => handleNavClick("subject", "/admin/addSubject")}
          >
            <FaUserCog className="mr-2" /> Add Subject
          </button>

          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "viewReports" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => handleNavClick("viewReports", "/admin/viewReports")}
          >
            <FaChartBar className="mr-2" /> View Reports
          </button>
        </nav>

        {/* Logout Button - Always visible */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            className="bg-red-600 p-2 rounded-md hover:bg-white hover:text-red-500 transition-all duration-300 flex items-center gap-1"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Log out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700 px-4 pb-4 space-y-3">
          <button
            className="w-full flex items-center gap-2 py-2"
            onClick={() => handleNavClick("addUser", "/admin/addUser")}
          >
            <FaUserPlus />
            Add User
          </button>
          <button
            className="w-full flex items-center gap-2 py-2"
            onClick={() => handleNavClick("manageUser", "/admin/manageUser")}
          >
            <FaUserCog />
            Manage User
          </button>
          <button
            className="w-full flex items-center gap-2 py-2"
            onClick={() => handleNavClick("subject", "/admin/addSubject")}
          >
            <FaUserCog />
            Add Subject
          </button>
          <button
            className="w-full flex items-center gap-2 py-2"
            onClick={() => handleNavClick("viewReports", "/admin/viewReports")}
          >
            <FaChartBar />
            View Reports
          </button>
          <button
            className="w-full flex items-center gap-2 py-2 text-red-400 hover:text-red-200"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Log out
          </button>
        </div>
      )}
    </header>
  );
};
