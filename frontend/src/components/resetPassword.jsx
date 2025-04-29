import { useState } from "react";
import { IoLockClosed, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export const ResetPassword = ({ onPasswordReset, onBackToLogin,email }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return false;
    }
    
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return false;
    }
    
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return false;
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/Quizify/forgot-password/reset?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(password)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // optional here, but keeping it won’t hurt
          },
          // ❌ no body
        }
      );
    
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("Password reset successfully:", data);
        if (onPasswordReset) onPasswordReset();
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
    
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Quizify</h1>
        <p className="text-gray-600">Reset Password</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Create New Password</h2>
        <p className="text-gray-600 text-sm mb-4">
          Please enter a new password for your account
        </p>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl flex">
              <IoLockClosed className="mr-2" />
              <button 
                type="button" 
                onClick={toggleShowPassword}
                className="focus:outline-none"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl flex">
              <IoLockClosed className="mr-2" />
              <button 
                type="button" 
                onClick={toggleShowConfirmPassword}
                className="focus:outline-none"
              >
                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>
        </div>
        <div className="mb-6 text-xs text-gray-600">
          <p>Password must contain:</p>
          <ul className="pl-5 mt-1 list-disc">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !password || !confirmPassword}
          className="w-full bg-black text-white py-3 rounded-md font-medium cursor-pointer whitespace-nowrap disabled:bg-gray-400"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      <div className="flex justify-center mt-4 text-sm">
        <a
          href="#"
          className="relative text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200 group"
          onClick={onBackToLogin}
        >
          Back to Login
          <span className="absolute bottom-0 left-0 h-[1.5px] w-full scale-x-0 bg-gray-900 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </a>
      </div>
      <div className="text-center mt-8 text-gray-500 text-sm">
        © 2025 Quizify Learning System
      </div>
    </div>
  );
};