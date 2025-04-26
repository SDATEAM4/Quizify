import { useState } from "react";
import { FaHome, FaPencilAlt, FaQuestionCircle, FaTrophy, FaChartBar } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
export const NavBar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate(); // Uncomment this when using react-router
  // This would be your navigation handler with useNavigate
  const handleNavigation = (route) => {
    setActiveTab(route);
    navigate(`/${route}`); // You would uncomment this when using react-router
  };

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Quizify</div>
        <nav className="hidden md:flex items-center space-x-8">
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${activeTab === "home" ? "border-b-2 border-white" : ""
              }`}
            onClick={() => handleNavigation("student/home")}
          >
            <FaHome className="mr-2" /> Home
            {activeTab !== "home" && <span className="hover-underline-animation"></span>}
          </button>

          <button
            className={`cursor-pointer py-2 flex items-center relative group ${activeTab === "quiz" ? "border-b-2 border-white" : ""
              }`}
            onClick={() => handleNavigation("attemptQuiz")}
          >
            <FaPencilAlt className="mr-2" /> Attempt Quiz
            {activeTab !== "quiz" && <span className="hover-underline-animation"></span>}
          </button>

          <button
            className={`cursor-pointer py-2 flex items-center relative group ${activeTab === "queries" ? "border-b-2 border-white" : ""
              }`}
            onClick={() => handleNavigation("queries")}
          >
            <FaQuestionCircle className="mr-2" /> Queries
            {activeTab !== "queries" && <span className="hover-underline-animation"></span>}
          </button>

          <button
            className={`cursor-pointer py-2 flex items-center relative group ${activeTab === "leaderboard" ? "border-b-2 border-white" : ""
              }`}
            onClick={() => handleNavigation("student/leaderboard")}
          >
            <FaTrophy className="mr-2" /> Leaderboard
            {activeTab !== "leaderboard" && <span className="hover-underline-animation"></span>}
          </button>

          <button
            className={`cursor-pointer py-2 flex items-center relative group ${activeTab === "reports" ? "border-b-2 border-white" : ""
              }`}
            onClick={() => handleNavigation("student/viewReports")}
          >
            <FaChartBar className="mr-2" /> View Reports
            {activeTab !== "reports" && <span className="hover-underline-animation"></span>}
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20a%20person%20with%20neutral%20expression%2C%20high%20quality%2C%20realistic%2C%20professional%20photography%2C%20soft%20lighting%2C%20clean%20background%2C%20minimalist%20style%2C%20business%20attire&width=100&height=100&seq=1&orientation=squarish"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="hidden md:inline">John Doe</span>
          <i className="fas fa-chevron-down text-xs"></i>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white focus:outline-none">
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
    </header>
  );
};