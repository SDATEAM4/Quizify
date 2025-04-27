import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useAuth } from "../context/authContext";
export const LoginForm = ({ onForgotPasswordClick }) => {
  const navigate = useNavigate();
  const {login ,isLoading} = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error('Please enter both identifier and password');
      return;
    }
    
    try {
      const result = await login(identifier, password);
      
      if (result.success) {
        console.log('Login successful, role:', result.role);
        
        // Navigate based on the returned role
        if (result.role === 'Teacher') {
          navigate('/teacher/home');
        } else if (result.role === 'Student') {
          navigate('/student/home');
        } else {
          navigate('/admin/addUser');
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden ">
      {/* Login card */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Quizify</h1>
          <p className="text-gray-600">Your Smart Quiz Platform</p>
        </div>

        

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Username Or Email"
                value={identifier}
                onChange={(e) => {setIdentifier(e.target.value)}}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-2xl"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible? <IoEye/>:<IoMdEyeOff/>}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-medium cursor-pointer whitespace-nowrap !rounded-button"
          >
           {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Additional links */}
        <div className="flex justify-between mt-4 text-sm">
          <a
            href="#"
            className="relative text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200 group"
            onClick={onForgotPasswordClick}
          >
            Forgot Password?
            <span className="hover-underline-animation"></span>
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          © 2025 Quizify Learning System
        </div>
      </div>
    </div>
  );
};