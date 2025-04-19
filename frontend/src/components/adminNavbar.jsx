import { useState } from "react";
import { FaChartBar, FaSignOutAlt, FaUserCog, FaUserPlus } from "react-icons/fa";

export const AdminNavBar = () => {
  const [activeTab, setActiveTab] = useState("home");
  
  // This would be your navigation handler with useNavigate
  const handleNavigation = (route) => {
    setActiveTab(route);
    // navigate(`/${route}`); // You would uncomment this when using react-router
  };

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Quizify Admin</div>
        <nav className="hidden md:flex items-center space-x-8">
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "home" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => handleNavigation("home")}
          >
            <FaUserPlus className="mr-2" /> Add User
            {activeTab !== "home" && <span className="hover-underline-animation"></span>}
          </button>
          
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "quiz" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => handleNavigation("quiz")}
          >
            <FaUserCog className="mr-2" /> Manage User
            {activeTab !== "quiz" && <span className="hover-underline-animation"></span>}
          </button>
          
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "queries" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => handleNavigation("queries")}
          >
            <FaChartBar className="mr-2" /> View Reports
            {activeTab !== "queries" && <span className="hover-underline-animation"></span>}
          </button>
          
          
        </nav>
        
        <div className="flex flexro items-center space-x-3">  
          <button
            className="bg-red-600 p-2 rounded-md hover:bg-white hover:text-red-500 transition-all duration-300 flex flex-row items-center gap-1"
          >
            <FaSignOutAlt/>Log out
          </button>
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden text-white focus:outline-none">
          
        </button>
      </div>
    </header>
  );
};