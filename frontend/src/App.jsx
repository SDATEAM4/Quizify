// filepath: d:\UNIVERSITY-PROGRAMMING\4th Semester\SDA-PROJECT\Quizify\frontend\src\App.jsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/homePage';
import { LoginPage } from "./pages/loginPage";
import { AttemptQuizPage } from "./pages/attemptQuizPage"; 
import { AdminAddUserPage } from './pages/adminAddUser';
import {QuizGenerator} from './pages/QuizGenerator';
import ManageUserComponent from './pages/manageUser';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/attemptQuiz' element={<AttemptQuizPage />} /> {/* Fixed usage */}
  <Route path='/admin/addUser' element={<AdminAddUserPage/>}/>
  <Route path='/quizGenerator' element={<QuizGenerator/>}/> {/* Fixed usage */}
  <Route path='/admin/manageUser' element={<ManageUserComponent/>}/>
    </Routes>
  );
}

export default App;