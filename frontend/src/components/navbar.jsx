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

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: <FaHome className="mr-2" />, label: "Home", route: "student/home", tab: "home" },
    { icon: <FaPencilAlt className="mr-2" />, label: "Attempt Quiz", route: "attemptQuiz", tab: "quiz" },
    { icon: <FaQuestionCircle className="mr-2" />, label: "Queries", route: "queries", tab: "queries" },
    { icon: <FaTrophy className="mr-2" />, label: "Leaderboard", route: "student/leaderboard", tab: "leaderboard" },
    { icon: <FaChartBar className="mr-2" />, label: "View Reports", route: "student/viewReports", tab: "reports" }
  ];

  // Dynamically detect active tab from URL
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
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Profile */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20a%20person%20with%20neutral%20expression%2C%20high%20quality%2C%20realistic%2C%20professional%20photography%2C%20soft%20lighting%2C%20clean%20background%2C%20minimalist%20style%2C%20business%20attire&width=100&height=100&seq=1&orientation=squarish"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="hidden lg:inline text-sm xl:text-base">John Doe</span>
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
                className={`cursor-pointer py-3 px-2 flex items-center rounded
                  ${activeTab === item.tab ? "bg-gray-800 font-semibold" : ""}
                `}
                onClick={() => handleNavigation(item.route)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </button>
            ))}
            <div className="py-3 px-2 flex items-center border-t border-gray-700">
              <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden mr-2">
                <img
                  src="https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20a%20person%20with%20neutral%20expression%2C%20high%20quality%2C%20realistic%2C%20professional%20photography%2C%20soft%20lighting%2C%20clean%20background%2C%20minimalist%20style%2C%20business%20attire&width=100&height=100&seq=1&orientation=squarish"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <span>John Doe</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
