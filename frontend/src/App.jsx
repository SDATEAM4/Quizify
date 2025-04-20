// filepath: d:\UNIVERSITY-PROGRAMMING\4th Semester\SDA-PROJECT\Quizify\frontend\src\App.jsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/homePage';
import { LoginPage } from "./pages/loginPage";
import { AttemptQuizPage } from "./pages/attemptQuizPage"; // Fixed import

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/attemptQuiz' element={<AttemptQuizPage />} /> {/* Fixed usage */}
    </Routes>
  );
}

export default App;