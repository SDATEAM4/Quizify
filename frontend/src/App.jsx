import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/homePage';
import { LoginPage } from "./pages/loginPage";
function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/home' element={<HomePage/>}/>
      

    </Routes>
  );
}

export default App;