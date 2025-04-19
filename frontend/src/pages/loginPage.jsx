import { useState } from "react";
import { LoginForm } from "../components/loginForm.jsx";
import { ForgotPassword } from "../components/forgotPassword.jsx";
import { OTPVerification } from "../components/otpVerification.jsx";
import BackgroundTypography from "../components/backgroundTypography.jsx";

export const LoginPage = () => {
  const [currentView, setCurrentView] = useState("login"); // "login", "forgotPassword", "otpVerification"
  const [email, setEmail] = useState("");

  const handleShowForgotPassword = () => {
    setCurrentView("forgotPassword");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleOtpSent = (userEmail) => {
    setEmail(userEmail);
    setCurrentView("otpVerification");
  };

  const handleOtpVerified = () => {
    console.log("OTP verified successfully");
    setCurrentView("login");
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gray-50 overflow-hidden">
      {/* Background Typography */}
      <BackgroundTypography />

      {/* Main Content */}
      <div className="relative z-10">
        {currentView === "login" && (
          <LoginForm onForgotPasswordClick={handleShowForgotPassword} />
        )}

        {currentView === "forgotPassword" && (
          <ForgotPassword
            onOtpSent={handleOtpSent}
            onBackToLogin={handleBackToLogin}
          />
        )}

        {currentView === "otpVerification" && (
          <OTPVerification
            email={email}
            onVerified={handleOtpVerified}
            onBackToLogin={handleBackToLogin}
          />
        )}
      </div>
    </div>
  );
};