import { useState } from "react";
import {
  FaChartBar,
  FaSignOutAlt,
  FaUserCog,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const AdminNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  const navLinks = [
    { label: "Add User", icon: <FaUserPlus />, path: "/admin/addUser" },
    { label: "Manage User", icon: <FaUserCog />, path: "/admin/manageUser" },
    { label: "Add Subject", icon: <FaUserCog />, path: "/admin/addSubject" },
    { label: "View Reports", icon: <FaChartBar />, path: "/admin/viewReports" },
  ];

  return (
    <header className="bg-black text-white shadow-md z-20 w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Quizify Admin</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => handleNavClick(path)}
              className={`relative group py-2 flex items-center transition-all duration-200 ${
                isActive(path) ? "border-b-2 border-white" : ""
              }`}
            >
              {icon}
              <span className="ml-2">{label}</span>
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={handleLogout}
            className="bg-red-600 p-2 rounded-md hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center gap-1"
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
          {navLinks.map(({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => handleNavClick(path)}
              className={`w-full flex items-center gap-2 py-2 px-3 rounded-md transition-all ${
                isActive(path)
                  ? "bg-white text-black font-semibold"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 py-2 text-red-400 hover:text-red-200"
          >
            <FaSignOutAlt />
            Log out
          </button>
        </div>
      )}
    </header>
  );
};
