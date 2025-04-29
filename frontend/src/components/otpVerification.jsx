import { useState, useRef, useEffect } from "react";

export const OTPVerification = ({ email, userId, onVerified,setCurrentView, onBackToLogin }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace - move to previous input if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const otpString = otp.join("");

    try {
      const response = await fetch(
        `http://localhost:8080/Quizify/forgot-password/verify-otp?userId=${userId}&otp=${otpString}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        console.log("OTP verified successfully:", data);
        setCurrentView("resetPassword")
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
        // Clear OTP fields on error
        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
    
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    setError("");
    
    // For development/testing - simulate API call
    setTimeout(() => {
      console.log("Resending OTP to:", email);
      // Reset timer
      setTimer(60);
      setCanResend(false);
      // Clear current OTP
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      setIsResending(false);
    }, 1500);
    
    try {
      const response = await fetch(
        `http://localhost:8080/Quizify/forgot-password/send-otp?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        console.log("OTP resent successfully:", data);
        // Reset timer
        setTimer(60);
        setCanResend(false);
        // Clear current OTP
        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Quizify</h1>
        <p className="text-gray-600">OTP Verification</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Enter OTP</h2>
        <p className="text-gray-600 text-sm mb-4">
          We've sent a verification code to <strong>{email || "your email"}</strong>
        </p>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || otp.join("").length !== 6}
          className="w-full bg-black text-white py-3 rounded-md font-medium cursor-pointer whitespace-nowrap disabled:bg-gray-400"
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      <div className="flex justify-between mt-4 text-sm">
        <button
          onClick={handleResendOtp}
          disabled={!canResend || isResending}
          className={`relative ${canResend ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400'} cursor-pointer transition-colors duration-200 group`}
        >
          {isResending 
            ? "Resending..." 
            : canResend 
              ? "Resend OTP" 
              : `Resend OTP in ${timer}s`}
          {canResend && (
            <span className="absolute bottom-0 left-0 h-[1.5px] w-full scale-x-0 bg-gray-900 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          )}
        </button>
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