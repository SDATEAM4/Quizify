import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/homePage';
import { LoginPage } from "./pages/loginPage";
import { AdminAddUserPage } from './pages/adminAddUser';
function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/admin/addUser' element={<AdminAddUserPage/>}/>
      

    </Routes>
  );
}

export default App;