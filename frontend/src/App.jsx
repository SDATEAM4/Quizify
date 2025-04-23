// filepath: d:\UNIVERSITY-PROGRAMMING\4th Semester\SDA-PROJECT\Quizify\frontend\src\App.jsx
import { Routes, Route } from 'react-router-dom';
import { StudentHomePage } from './pages/homePage';
import { LoginPage } from "./pages/loginPage";
import { AttemptQuizPage } from "./pages/attemptQuizPage"; 
import { AdminAddUserPage } from './pages/adminAddUser';
import {QuizGenerator} from './pages/QuizGenerator';
import ManageUserComponent from './pages/manageUser';
import ViewReportsAdmin from './pages/adminViewReports';
import TeacherReports from './pages/teacherViewReports';
import { TeacherHomePage } from './pages/teacherHomePage';
import AddNewQuestion from './pages/teacherAddNewQuestion';
import TeacherAddQuiz from './pages/teacherAddQuiz';
import { TeacherEditQuiz } from './pages/teacherEditQuizPage';
import CustomizeProfile from './pages/customizeProfile';
function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/student/home' element={<StudentHomePage />} />
      <Route path='/attemptQuiz' element={<AttemptQuizPage />} /> {/* Fixed usage */}
  <Route path='/admin/addUser' element={<AdminAddUserPage/>}/>
  <Route path='/quizGenerator' element={<QuizGenerator/>}/> {/* Fixed usage */}
  <Route path='/admin/manageUser' element={<ManageUserComponent/>}/>
  <Route path='/admin/viewReports' element={<ViewReportsAdmin/>}/>
  <Route path='/teacher/viewReports' element={<TeacherReports/>}/>
  <Route path='/teacher/addQuestion' element={<AddNewQuestion/>}/>
  <Route path='/teacher/editQuiz' element={<TeacherEditQuiz/>}/>

  <Route path='/teacher/home' element={<TeacherHomePage/>}/>
  <Route path='/teacher/createQuiz' element={<TeacherAddQuiz/>}/>
  <Route path='/customizeProfile' element={<CustomizeProfile/>}/>

    </Routes>
  );
}

export default App;