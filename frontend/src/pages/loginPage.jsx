import { useEffect, useState } from "react";
import { LoginForm } from "../components/loginForm.jsx";
import { ForgotPassword } from "../components/forgotPassword.jsx";
import { OTPVerification } from "../components/otpVerification.jsx";
import { ResetPassword } from "../components/resetPassword.jsx";
import BackgroundTypography from "../components/backgroundTypography.jsx";

export const LoginPage = () => {
  const [currentView, setCurrentView] = useState("login"); // "login", "forgotPassword", "otpVerification", "resetPassword"
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    document.title = 'Quizify - Login';
  }, []);

  useEffect(()=>{
    console.log(currentView)
  },[currentView])

  const handleShowForgotPassword = () => {
    setCurrentView("forgotPassword");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleOtpSent = (userEmail) => {
    console.log("OTP sent - Email:", userEmail, "UserID:");
    setEmail(userEmail);

    setCurrentView("otpVerification");
  };

  const handleOtpVerified = () => {
    setCurrentView("resetPassword");
  };

  const handlePasswordReset = () => {
    console.log("Password reset successfully");
    setCurrentView("login");
    // Could show a success toast/message here
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gray-50 overflow-hidden">
      {/* Background Typography */}
      <BackgroundTypography />
      
      {/* Main Content */}
      <div className="relative z-10 min-w-1/3">
        {currentView === "login" && (
          <LoginForm onForgotPasswordClick={handleShowForgotPassword} />
        )}
        
        {currentView === "forgotPassword" && (
          <ForgotPassword
            onOtpSent={handleOtpSent}
            onBackToLogin={handleBackToLogin}
            setUserId={setUserId}
          />
        )}
        
        {currentView === "otpVerification" && (
          <OTPVerification
            email={email}
            userId={userId}
            onVerified={handleOtpVerified}
            onBackToLogin={handleBackToLogin}
            setCurrentView={setCurrentView}
          />
        )}
        
        {currentView === "resetPassword" && (
          <ResetPassword
            email={email}
            onPasswordReset={handlePasswordReset}
            onBackToLogin={handleBackToLogin}
          />
        )}
      </div>
    </div>
  );
};