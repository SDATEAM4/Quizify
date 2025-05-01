import { Routes, Route } from "react-router-dom";
import { StudentHomePage } from "./pages/homePage";
import { LoginPage } from "./pages/loginPage";
import { AttemptQuizPage } from "./pages/attemptQuizPage";
import { AdminAddUserPage } from "./pages/adminAddUser";
import { QuizGenerator } from "./pages/QuizGenerator";
import ManageUserComponent from "./pages/manageUser";
import ViewReportsAdmin from "./pages/adminViewReports";
import TeacherReports from "./pages/teacherViewReports";
import { TeacherHomePage } from "./pages/teacherHomePage";
import AddNewQuestion from "./pages/teacherAddNewQuestion";
import TeacherAddQuiz from "./pages/teacherAddQuiz";
import { TeacherEditQuiz } from "./pages/teacherEditQuizPage";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "react-hot-toast";
import CustomizeProfile from "./pages/customizeProfile";
import AddSubjectPage from "./pages/adminAddSubject";
import StudentViewReport from "./pages/studentViewReports";
import TeacherChatApp from "./pages/teacherChat";
import StudentChatApp from "./pages/studentChat";
import Leaderboard from "./pages/Leaderboard";
import { ProtectedRoute, PublicRoute } from "./routes/protectedRoutes";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes (accessible without authentication) */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* Student routes */}
        <Route 
          path="/student/home" 
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentHomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/queries" 
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentChatApp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/attemptQuiz" 
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <AttemptQuizPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/leaderboard" 
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <Leaderboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/viewReports" 
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentViewReport />
            </ProtectedRoute>
          } 
        />

        {/* Teacher routes */}
        <Route 
          path="/teacher/home" 
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <TeacherHomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/queries" 
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <TeacherChatApp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/addQuestion" 
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <AddNewQuestion />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/editQuiz" 
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <TeacherEditQuiz />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/createQuiz" 
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <TeacherAddQuiz />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/viewReports" 
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <TeacherReports />
            </ProtectedRoute>
          } 
        />

        {/* Admin routes */}
        <Route 
          path="/admin/addUser" 
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminAddUserPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/manageUser" 
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ManageUserComponent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/viewReports" 
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ViewReportsAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/addSubject" 
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddSubjectPage />
            </ProtectedRoute>
          } 
        />

        {/* Shared routes (accessible by multiple roles) */}
        <Route 
          path="/customizeProfile" 
          element={
            <ProtectedRoute allowedRoles={["Student", "Teacher", "Admin"]}>
              <CustomizeProfile />
            </ProtectedRoute>
          } 
        />

        {/* Quiz generator may need special permissions */}
        <Route 
          path="/quizGenerator" 
          element={
            <ProtectedRoute allowedRoles={["Teacher", "Admin"]}>
              <QuizGenerator />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;