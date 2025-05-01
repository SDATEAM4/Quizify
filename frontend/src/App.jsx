// filepath: d:\UNIVERSITY-PROGRAMMING\4th Semester\SDA-PROJECT\Quizify\frontend\src\App.jsx
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
function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right"/>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student/home" element={<StudentHomePage />} />
      <Route path="/student/queries" element={<StudentChatApp />} />
      <Route path="/attemptQuiz" element={<AttemptQuizPage />} />{" "}
      {/* Fixed usage */}
      <Route path="/admin/addUser" element={<AdminAddUserPage />} />
      <Route path="/quizGenerator" element={<QuizGenerator />} />{" "}
      {/* Fixed usage */}
      <Route path="/admin/manageUser" element={<ManageUserComponent />} />
      <Route path="/admin/viewReports" element={<ViewReportsAdmin />} />
      <Route path="/teacher/viewReports" element={<TeacherReports />} />
      <Route path="/admin/addSubject" element={<AddSubjectPage />} />
      <Route path="/teacher/addQuestion" element={<AddNewQuestion />} />
      <Route path="/teacher/editQuiz" element={<TeacherEditQuiz />} />
      <Route path="/teacher/home" element={<TeacherHomePage />} />
      <Route path="/teacher/queries" element={<TeacherChatApp />} />
      <Route path="/teacher/createQuiz" element={<TeacherAddQuiz />} />
      <Route path="/customizeProfile" element={<CustomizeProfile />} />
      <Route path="/student/leaderboard" element={<Leaderboard />} />
      <Route path="/student/viewReports" element={< StudentViewReport/>} />
    </Routes>
    </AuthProvider>
  );
}

export default App;
