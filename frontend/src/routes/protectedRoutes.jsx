import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// ProtectedRoute component that handles authentication and role-based access
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  // Show brief loading state only if initial load is happening
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow access if no specific roles are required or if user has an allowed role
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return children;
  }

  // Redirect based on user role if they don't have permission
  switch (user.role) {
    case "Student":
      return <Navigate to="/student/home" replace />;
    case "Teacher":
      return <Navigate to="/teacher/home" replace />;
    case "Admin":
      return <Navigate to="/admin/manageUser" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// PublicRoute component for routes like login that should redirect logged-in users to their dashboard
export const PublicRoute = ({ children }) => {
  return children;
};