import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaHome,
  FaPencilAlt,
  FaQuestionCircle,
  FaTrophy,
  FaChartBar,
  FaBars,
  FaChevronDown
} from 'react-icons/fa';
import { useAuth } from "../context/authContext"; // Make sure this path is correct

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { icon: <FaHome className="mr-2" />, label: "Home", route: "student/home", tab: "home" },
    { icon: <FaPencilAlt className="mr-2" />, label: "Attempt Quiz", route: "attemptQuiz", tab: "quiz" },
    { icon: <FaQuestionCircle className="mr-2" />, label: "Queries", route: "student/queries", tab: "queries" },
    { icon: <FaTrophy className="mr-2" />, label: "Leaderboard", route: "student/leaderboard", tab: "leaderboard" },
    { icon: <FaChartBar className="mr-2" />, label: "View Reports", route: "student/viewReports", tab: "reports" }
  ];

  const activeTab = navItems.find(item => location.pathname.includes(item.route))?.tab;

  const handleNavigation = (route) => {
    navigate(`/${route}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-bold">Quizify</div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          {navItems.map((item) => (
            <button
              key={item.route}
              className={`cursor-pointer py-2 flex items-center relative group
                ${activeTab === item.tab ? "border-b-2 border-white font-semibold" : ""}
              `}
              onClick={() => handleNavigation(item.route)}
            >
              {item.icon}
              {item.label}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Profile */}
        <div className="flex items-center space-x-3">
          {!mobileMenuOpen && (
            < div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden hover:cursor-pointer">
              <img
                src={user.profileImageUrl || "img/fallback.png"} alt="Profile"
                className="h-full w-full object-cover"
                onClick={() => navigate("/customizeProfile")}
              />
            </div>
          )}
          <span className="hidden lg:inline text-sm xl:text-base">
            {user?.fname} {user?.lname}
          </span>
          <FaChevronDown className="text-xs hidden sm:inline lg:hidden" />
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-900">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.route}
                className={`cursor-pointer py-3 px-2 flex items-center rounded relative group
                  ${activeTab === item.tab ? "bg-gray-800 font-semibold" : ""}
                `}
                onClick={() => handleNavigation(item.route)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <div className="py-3 px-2 flex items-center border-t border-gray-700">
              <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden mr-2">
                <img
                  src={user?.profileImageUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onClick={() => navigate("/customizeProfile")}
                />
              </div>
              <span>{user?.fname} {user?.lname}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
