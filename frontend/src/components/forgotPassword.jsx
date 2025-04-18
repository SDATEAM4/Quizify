import { useState } from "react";
import { IoMail } from "react-icons/io5";

export const ForgotPassword = ({ onOtpSent, onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Sending OTP to:", email);
      setIsSubmitting(false);
      if (onOtpSent) onOtpSent(email);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Quizify</h1>
        <p className="text-gray-600">Password Recovery</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Forgot Password</h2>
        <p className="text-gray-600 text-sm mb-4">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
              <IoMail />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded-md font-medium cursor-pointer whitespace-nowrap disabled:bg-gray-400"
        >
          {isSubmitting ? "Sending..." : "Send OTP"}
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